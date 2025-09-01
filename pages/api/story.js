// /pages/api/story.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in Vercel Environment Variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, length, language, moral } = req.body;

    // 1. Generate story text
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a friendly bedtime story generator for kids.",
        },
        {
          role: "user",
          content: `Write a ${length} bedtime story in ${language} about ${category}. Include a title on the first line and make sure the story teaches the moral lesson of ${moral}. Use short paragraphs separated by newlines.`,
        },
      ],
    });

    const storyText = completion.choices[0].message.content.trim();

    // 2. Extract title and content
    const lines = storyText.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0].replace(/^Title:\s*/i, "").replace(/\*\*/g, "").trim();
    const content = lines.slice(1).join("\n\n");

    // 3. Generate 2 AI images
    const prompts = [
      `A colorful, child-friendly illustration of ${category} in a bedtime story style`,
      `A cozy magical ending scene for a bedtime story about ${category}`,
    ];

    let images = [];
    try {
      for (let prompt of prompts) {
        const imgRes = await client.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "512x512",
        });
        images.push(imgRes.data[0].url);
      }
    } catch (err) {
      console.error("Image generation failed:", err.message);
      images = [];
    }

    // 4. Return response
    res.status(200).json({ title, content, images });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
