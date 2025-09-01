import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { category, length, language, moral } = req.body;

    const prompt = `
      Write a ${length} ${language} story for kids about ${category}.
      Include a moral about ${moral}.
      Return the story as plain text.
      The first line should be the title.
      Separate paragraphs with two newlines (\n\n).
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const text = completion.data.choices[0].message.content;

    // Split text into paragraphs
    const lines = text.split("\n\n").filter(Boolean);
    const title = lines.shift() || "Magic Story";

    // Generate a single AI cartoonish image representing the title
    const imageResponse = await openai.createImage({
      prompt: `Cartoonish illustration for: ${title}, colorful, fun, child-friendly`,
      n: 1,
      size: "512x512",
      model: "gpt-image-1",
    });

    const imageUrl = imageResponse.data.data[0].url;

    res.status(200).json({ title, paragraphs: lines, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
