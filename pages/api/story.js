// pages/api/story.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language } = req.body;

  try {
    const prompt = `Write a children's bedtime story in ${language}.
Category: ${category}.
Length: ${length} minutes.
Make the first line the story title.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const story = completion.choices[0].message.content;
    res.status(200).json({ story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
