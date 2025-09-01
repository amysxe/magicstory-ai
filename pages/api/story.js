import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { category, length, language, moral } = req.body;

    const prompt = `Generate a ${length} story in ${language} about ${category}, teaching the moral of ${moral}. Return JSON like { "title": "Story title", "content": ["paragraph1", "paragraph2"] }`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    // Ensure proper JSON parsing
    const storyText = response.data.choices[0].message.content;
    const storyJson = JSON.parse(storyText);

    res.status(200).json(storyJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate story. Please try again." });
  }
}
