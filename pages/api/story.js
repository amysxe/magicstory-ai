import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { category, length, language, moral } = req.body;

  const prompt = `
Create a ${length} story for kids about ${category}.
Language: ${language}
Moral: ${moral}

Return in JSON format:
{
  "title": "<title of the story>",
  "paragraphs": ["paragraph 1", "paragraph 2", "..."]
}
`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = response.data.choices[0].message.content;
    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (err) {
    console.error("Failed to generate story:", err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
