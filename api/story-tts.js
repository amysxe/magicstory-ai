import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    // Generate TTS audio using OpenAI
    const mp3Response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // you can choose another voice if supported
      input: text,
    });

    // Convert ArrayBuffer to Node.js buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    // Send as audio/mpeg
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err) {
    console.error("TTS generation error:", err);
    res.status(500).json({ error: "Failed to generate audio" });
  }
}
