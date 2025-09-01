import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language, moral } = req.body;

  if (!category || !length || !language || !moral) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Construct prompt for story generation
    const prompt = `
Generate a children's story with the following details:
- Category: ${category}
- Story length: ${length}
- Language: ${language}
- Moral lesson: ${moral}

Please provide:
1. A short and catchy title for the story.
2. The story content with clear paragraph breaks.
Do NOT include "Title:" before the title.
`;

    // Call OpenAI GPT to generate the story
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const responseText = completion.choices[0].message.content;

    // Split into title and content
    const lines = responseText.split("\n").filter((line) => line.trim() !== "");
    let title = lines[0];
    let content = lines.slice(1).join("\n");

    // Fallback if GPT returns differently
    if (!title) title = "Magic Story";
    if (!content) content = responseText;

    res.status(200).json({ title, content });
  } catch (err) {
    console.error("Story generation error:", err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
