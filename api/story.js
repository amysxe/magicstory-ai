import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { category, length, language, moral } = req.body;

  if (!category || !length || !language || !moral) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `Create a ${length} ${language} story for kids about "${category}" with a moral of "${moral}". Include a title as the first line. Separate paragraphs with line breaks.`;
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    const storyText = response.data.choices[0].message.content;
    const lines = storyText.split("\n").filter(l => l.trim() !== "");
    const title = lines[0] || "Magic Story";
    const content = lines.slice(1).join("\n") || storyText;

    res.status(200).json({ title, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
