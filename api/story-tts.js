import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  try {
    // Generate TTS audio
    const ttsResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts", // human-like narration
      voice: "alloy",            // choose voice
      input: text,
    });

    const buffer = Buffer.from(await ttsResponse.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate TTS audio" });
  }
}
