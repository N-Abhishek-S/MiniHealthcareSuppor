import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT || 8787);
const API_KEY =
  process.env.SAMBANOVA_API_KEY ||
  process.env.API_KEY ||
  process.env.VITE_GEMINI_API_KEY;
const MODEL = process.env.SAMBANOVA_MODEL || "gpt-oss-120b";
const API_URL = "https://api.sambanova.ai/v1/chat/completions";

const MAX_HISTORY = 10;
const MAX_INPUT = 500;

const SYSTEM_PROMPT = `You are HealthBot, a warm and knowledgeable healthcare assistant for a non-profit NGO platform serving 28 districts across Maharashtra, Karnataka, and Telangana.

ABSOLUTE RULES - never break these:
1. Provide ONLY general health guidance and wellness information.
2. NEVER diagnose any medical condition under any circumstance.
3. NEVER suggest specific medicines, dosages, or treatment plans.
4. ALWAYS end medical answers by recommending the user consult a licensed doctor.
5. For ANY life-threatening emergency, immediately direct to 108 (Ambulance) or 112 (Emergency) before anything else.
6. Keep answers concise, warm, and human - 2 to 4 short paragraphs at most.
7. Do NOT engage with topics unrelated to health, wellness, or the NGO's services.

NGO FACTS you may share:
- Services are completely free of charge.
- Helpline: 1800-000-0000 (24/7).
- Email: help@healthcarengo.org.
- Volunteer matching: 15-30 minutes urgent, 24 hours routine.
- Coverage: 28 districts across Maharashtra, Karnataka, and Telangana. Expanding soon.
- Donations are 80G tax-exempt. Accepted via UPI, bank transfer, international payments.

Tone: compassionate, clear, never alarmist. Speak like a trusted health advisor, not a robot.
Format: Use **bold** for key terms. Keep responses to 2-4 short paragraphs.`;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, provider: "SambaNova", model: MODEL });
});

app.post("/api/gemini", async (req, res) => {
  const userMessage =
    typeof req.body?.userMessage === "string" ? req.body.userMessage.trim() : "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!API_KEY) {
    return res.status(500).json({
      code: "SERVER_CONFIG_ERROR",
      message: "SambaNova API key is missing on the server.",
    });
  }

  if (!userMessage) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Message is required.",
    });
  }

  if (userMessage.length > MAX_INPUT) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: `Message must be ${MAX_INPUT} characters or less.`,
    });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history
      .slice(-(MAX_HISTORY * 2))
      .filter(
        (item) =>
          item &&
          typeof item.text === "string" &&
          item.text.trim() &&
          (item.role === "user" || item.role === "bot")
      )
      .map((item) => ({
        role: item.role === "bot" ? "assistant" : "user",
        content: item.text.trim(),
      })),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: true,
        model: MODEL,
        messages,
      }),
    });

    const raw = await response.text();

    if (!response.ok) {
      const message = extractErrorMessage(raw, response.status);
      return res.status(response.status).json({
        code: mapErrorCode(response.status, message),
        message,
        retryAfterSeconds: extractRetryAfterSeconds(response),
      });
    }

    const reply = extractStreamedReply(raw);

    if (!reply) {
      return res.status(502).json({
        code: "EMPTY_RESPONSE",
        message: "SambaNova returned an empty response.",
      });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("[sambanova-proxy]", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Unable to reach SambaNova right now. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HealthBot backend listening on http://localhost:${PORT}`);
  console.log(`Using SambaNova model: ${MODEL}`);
});

function extractStreamedReply(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter((payload) => payload && payload !== "[DONE]")
    .map((payload) => {
      try {
        return JSON.parse(payload);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .map((chunk) => chunk?.choices?.[0]?.delta?.content ?? "")
    .join("")
    .trim();
}

function extractErrorMessage(raw, status) {
  if (!raw) return `SambaNova API error ${status}`;

  try {
    const data = JSON.parse(raw);
    return (
      data?.error?.message ||
      data?.message ||
      data?.detail ||
      `SambaNova API error ${status}`
    );
  } catch {
    const cleaned = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return cleaned || `SambaNova API error ${status}`;
  }
}

function mapErrorCode(status, message = "") {
  if (status === 429) return "RATE_LIMIT";
  if (status === 400) return "BAD_REQUEST";
  if (status === 401 || status === 403) return "AUTH_ERROR";
  if (status === 503) return "TEMP_UNAVAILABLE";
  if (status === 502) return "TEMP_UNAVAILABLE";
  return /quota|limit/i.test(message) ? "QUOTA_UNAVAILABLE" : `API_${status}`;
}

function extractRetryAfterSeconds(response) {
  const retryAfterHeader = response.headers.get("retry-after");
  const headerSeconds = Number(retryAfterHeader);
  if (Number.isFinite(headerSeconds) && headerSeconds > 0) {
    return headerSeconds;
  }

  return null;
}
