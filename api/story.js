import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { category = "Animal", length = "5-10 min", language = "English", moral = "Kindness" } = req.body || {};

  try {
    const prompt = `Create a ${length} ${language} story for kids about "${category}" with a moral of "${moral}". Include a title at the beginning. Separate paragraphs with line breaks.`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    const storyText = response.data.choices[0].message.content;

    const lines = storyText.split("\n").filter(l => l.trim() !== "");
    let title = lines[0] || "Magic Story";
    let content = lines.slice(1).join("\n") || storyText;

    const images = []; // keep empty for now
    res.status(200).json({ title, content, images });
  } catch (err) {
    console.error("Story API error:", err.message);
    res.status(500).json({ error: "Oops.. Please try again" });
  }
}
