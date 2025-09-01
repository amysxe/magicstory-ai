import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { category, length, language, moral } = req.body;

  try {
    // Generate story text
    const storyPrompt = `
Write a fun and meaningful story for kids.
Category: ${category}
Length: ${length}
Language: ${language}
Moral: ${moral}
Return the output as JSON:
{
  "title": "<story title>",
  "content": ["<paragraph 1>", "<paragraph 2>", "..."]
}
`;

    const storyResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: storyPrompt }],
    });

    const storyData = JSON.parse(storyResp.choices[0].message.content);

    // Generate cartoonish AI image for title
    const imageResp = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Cartoonish illustration for a kids story titled "${storyData.title}" in ${language}, bright and fun style`,
      size: "1024x1024"
    });

    const image_url = imageResp.data[0].url;

    res.status(200).json({ ...storyData, image: image_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
