import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, length, language, moral } = req.body;

    // 1️⃣ Generate story text
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a friendly bedtime story generator for kids.",
        },
        {
          role: "user",
          content: `Write a ${length} bedtime story in ${language} about ${category}. Include a title on the first line. Make sure the story teaches the moral lesson of ${moral}. Use short paragraphs separated by newlines.`,
        },
      ],
    });

    const storyText = completion.choices[0].message.content.trim();

    const lines = storyText.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0].replace(/^Title:\s*/i, "").replace(/\*\*/g, "").trim();
    const content = lines.slice(1).join("\n\n");

    // 2️⃣ Generate 2 AI images (base64)
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
          size: "256x256",
          response_format: "b64_json",
        });
        images.push(`data:image/png;base64,${imgRes.data[0].b64_json}`);
      }
    } catch (err) {
      console.error("Image generation failed:", err.message);
      // fallback placeholders
      images = [
        "https://via.placeholder.com/256x256?text=Image+Unavailable",
        "https://via.placeholder.com/256x256?text=Image+Unavailable",
      ];
    }

    res.status(200).json({ title, content, images });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
