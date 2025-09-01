import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { paragraphs, language } = req.body;
  if (!paragraphs || !Array.isArray(paragraphs)) return res.status(400).json({ error: "Missing paragraphs" });

  try {
    const audioUrls = [];
    for (let p of paragraphs) {
      const ttsResponse = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy", // human-like voice
        input: p,
        language: language.toLowerCase() // ensure correct language
      });
      // Convert response to base64 URL
      const audioData = Buffer.from(await ttsResponse.arrayBuffer());
      const fileName = `audio_${Date.now()}.mp3`;
      const filePath = path.join("/tmp", fileName);
      fs.writeFileSync(filePath, audioData);
      audioUrls.push(`/api/tts-file?file=${fileName}`);
    }
    res.status(200).json({ audioUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate TTS" });
  }
}
