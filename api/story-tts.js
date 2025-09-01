import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, language } = req.body;

  try {
    // Map language to voice
    let voice = "alloy";
    if (language === "Bahasa") voice = "indonesian";
    else if (language === "German") voice = "german";

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    res.status(200).json({ audio: base64Audio });
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "Failed to generate TTS" });
  }
}
