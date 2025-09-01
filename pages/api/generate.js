import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length } = req.body;

  try {
    // 1. Generate story
    const storyPrompt = `Write a children's bedtime story in English. 
    Theme: ${category}. 
    Duration: about ${length} minutes. 
    The tone should be warm, simple, and imaginative.`;

    const storyResp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: storyPrompt }],
      max_tokens: 500,
    });

    const story = storyResp.choices[0].message.content;

    // 2. Generate illustration
    const imagePrompt = `Whimsical children's book illustration, pastel colors, soft outlines, theme: ${category} fantasy adventure.`;
    const imgResp = await client.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "512x512",
    });

    const imageUrl = imgResp.data[0].url;

    res.status(200).json({ story, image: imageUrl });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
