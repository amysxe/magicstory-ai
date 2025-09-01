// /pages/api/story.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure you set this in .env.local
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, length, language } = req.body;

    // 1. Generate the story text
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // You can also use "gpt-4o" or "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: "You are a friendly bedtime story generator for kids.",
        },
        {
          role: "user",
          content: `Write a ${length} bedtime story in ${language} about ${category}. 
          Start with the title on the first line, then the story paragraphs.`,
        },
      ],
    });

    const storyText = completion.choices[0].message.content.trim();

    // 2. Extract title and story body
    const lines = storyText.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0].replace(/^Title:\s*/i, "").trim();
    const content = lines.slice(1).join("\n\n");

    // 3. Generate images (2 images to avoid overload)
    const prompts = [
      `A beautiful illustration of ${category}, in bedtime story style, soft pastel colors, child friendly`,
      `A magical ending scene for a bedtime story about ${category}, cozy and warm style`,
    ];

    const imageUrls = [];
    for (let prompt of prompts) {
      const image = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "512x512",
      });
      imageUrls.push(image.data[0].url);
    }

    // 4. Return response
    res.status(200).json({
      title: title || "Your Bedtime Story",
      content: content,
      images: imageUrls,
    });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
