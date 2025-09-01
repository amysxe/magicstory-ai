import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, language } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    // Map the selected language to a neural voice or TTS locale
    let voice = "alloy"; // default English
    if (language === "Bahasa") voice = "indonesian"; 
    else if (language === "German") voice = "german"; 
    else voice = "alloy"; // English fallback

    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice,
      input: text,
      format: "mp3"
    });

    res.status(200).json({ audio: audioResponse });
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "Failed to generate TTS" });
  }
}
