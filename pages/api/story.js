// /pages/api/story.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, length, language } = req.body;

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
          content: `Write a ${length} bedtime story in ${language} about ${category}. 
          Start with the title on the first line, then the story paragraphs.`,
        },
      ],
    });

    const storyText = completion.choices[0].message.content.trim();

    // 2. Extract title and story
    const lines = storyText.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0].replace(/^Title:\s*/i, "").trim();
    const content = lines.slice(1).join("\n\n");

    // 3. Generate images (use try/catch so story still works if images fail)
    let imageUrls = [];
    try {
      const prompts = [
        `A soft, pastel illustration of ${category}, child-friendly bedtime story style`,
        `A magical cozy ending scene for a bedtime story about ${category}`,
      ];

      for (let prompt of prompts) {
        const image = await client.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "512x512",
        });
        imageUrls.push(image.data[0].url);
      }
    } catch (imgError) {
      console.error("Image generation failed:", imgError.message);
      imageUrls = []; // fallback: no images
    }

    // 4. Send back result
    res.status(200).json({
      title: title || "Your Bedtime Story",
      content,
      images: imageUrls,
    });
  } catch (error) {
    console.error("Story generation error:", error.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
