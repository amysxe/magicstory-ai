import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { category, length, language, moral } = req.body;
  if (!category || !length || !language || !moral)
    return res.status(400).json({ error: "Missing fields" });

  try {
    // Generate story JSON
    const storyPrompt = `
You are a children's story writer.
Generate a story based on:
- Category: ${category}
- Length: ${length}
- Language: ${language}
- Moral: ${moral}

Return as JSON:
{
  "title": "short title",
  "content": "full story text with paragraph breaks using \\n"
}
Do not include anything else.
`;

    const storyCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: storyPrompt }],
      temperature: 0.8,
      max_tokens: 1200,
    });

    let storyData;
    try {
      storyData = JSON.parse(storyCompletion.choices[0].message.content);
    } catch {
      const lines = storyCompletion.choices[0].message.content.split("\n").filter(Boolean);
      storyData = { title: lines[0], content: lines.slice(1).join("\n") };
    }

    // Generate 2 images
    const images = [];
    for (let i = 0; i < 2; i++) {
      const imgResp = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Cartoon illustration for children's story titled "${storyData.title}"`,
        size: "512x512",
      });
      images.push(imgResp.data[0].url);
    }

    res.status(200).json({ ...storyData, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story or images" });
  }
}
