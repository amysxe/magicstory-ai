import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { category, length, language, moral } = req.body;

  try {
    const prompt = `
      Write a ${length} story for kids in ${language}.
      The story should be about ${category} and teach the moral value: ${moral}.
      Include a clear title in the first line, then the content in paragraphs.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const storyText = completion.choices[0].message.content;

    // Split first line as title
    const [titleLine, ...contentLines] = storyText.split("\n").filter(Boolean);
    const title = titleLine.replace(/^Title:\s*/i, "");
    const content = contentLines.join("\n");

    res.status(200).json({ title, content });
  } catch (err) {
    console.error("Error generating story:", err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
