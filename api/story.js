import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { category, length, language, moral } = req.body;

    const prompt = `
Write a ${length} story in ${language} about ${category}, teaching the moral of ${moral}.
Return JSON with this format only: 
{
  "title": "story title",
  "content": ["paragraph1", "paragraph2", "paragraph3"]
}
Do not add any explanation or extra text. Make sure the JSON is valid.
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const storyText = completion.data.choices[0].message.content;

    // Safe JSON parsing using regex to extract JSON object
    const match = storyText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON from AI");

    const story = JSON.parse(match[0]);

    res.status(200).json(story);
  } catch (err) {
    console.error("Story generation error:", err);
    res.status(500).json({ error: "Failed to generate story. Please try again." });
  }
}
