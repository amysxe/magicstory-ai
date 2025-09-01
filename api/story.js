import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { category, length, language, moral } = req.body;

  try {
    console.log("Request body:", req.body);

    // 1. Generate story text
    const storyPrompt = `
Write a fun and meaningful story for kids.
Category: ${category}
Length: ${length}
Language: ${language}
Moral: ${moral}
Return strictly as valid JSON:
{
  "title": "<story title>",
  "content": ["<paragraph 1>", "<paragraph 2>", "..."]
}
`;

    const storyResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: storyPrompt }],
      max_tokens: 600,
    });

    let storyData;
    try {
      storyData = JSON.parse(storyResp.choices[0].message.content);
    } catch (err) {
      console.error("JSON parse error:", err);
      console.error("Raw response:", storyResp.choices[0].message.content);

      // Fallback: wrap response in title + single paragraph
      storyData = {
        title: "A fun story",
        content: [storyResp.choices[0].message.content],
      };
    }

    // 2. Generate cartoonish AI image (optional, failsafe)
    let image_url = null;
    try {
      const imageResp = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Cartoonish illustration for a kids story titled "${storyData.title}" in ${language}, bright and fun style`,
        size: "1024x1024",
      });
      image_url = imageResp.data[0]?.url || null;
    } catch (err) {
      console.warn("Image generation skipped:", err.message);
      image_url = null;
    }

    res.status(200).json({ ...storyData, image: image_url });
  } catch (err) {
    console.error("Story generation failed:", err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
