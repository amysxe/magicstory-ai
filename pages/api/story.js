import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { category, length, language, moral } = req.body;

    const prompt = `Write a ${length} story in ${language} about ${category}, teaching the moral of ${moral}. Return JSON: { "title": "story title", "content": ["paragraph1", "paragraph2"] }`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const storyText = completion.data.choices[0].message.content;

    // Parse AI JSON safely
    const story = JSON.parse(storyText);

    res.status(200).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story. Please try again." });
  }
}
