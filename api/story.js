import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // store this in Vercel environment variables
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language, moral } = req.body;

  try {
    // Generate story
    const prompt = `Create a ${length} ${language} story for kids about "${category}" with a moral of "${moral}". Include a title at the beginning. Separate paragraphs with line breaks.`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    const storyText = response.data.choices[0].message.content;

    // Optional: split title and content
    const lines = storyText.split("\n").filter((l) => l.trim() !== "");
    let title = lines[0];
    let content = lines.slice(1).join("\n");

    // Optional: include empty images array for now
    const images = []; 

    res.status(200).json({ title, content, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
