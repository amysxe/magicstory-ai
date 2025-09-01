import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language, moral } = req.body || {};

  if (!category || !length || !language || !moral) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `
      Create a ${length} ${language} story for kids about "${category}" 
      with a moral of "${moral}". Include a clear title as the first line, max 6 words. 
      Separate paragraphs with line breaks. 
      Keep it simple and kid-friendly.
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    const text = completion.data.choices?.[0]?.message?.content || "";

    if (!text) {
      return res.status(500).json({ error: "OpenAI returned empty text" });
    }

    const lines = text.split("\n").filter(l => l.trim() !== "");
    const title = lines[0] || "Magic Story";
    const content = lines.slice(1).join("\n") || text;

    res.status(200).json({
      title,
      content,
      images: [] // can add AI images later
    });

  } catch (err) {
    console.error("Story API error:", err);
    res.status(500).json({ error: "Failed to generate story", details: err.message });
  }
}
