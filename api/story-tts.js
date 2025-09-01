import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, language } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",  // neural voice
      voice: "alloy",            // human-like voice
      input: text,
      format: "mp3"
    });

    // return as base64 or blob URL
    res.status(200).json({ audio: mp3 });
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "Failed to generate TTS" });
  }
}
