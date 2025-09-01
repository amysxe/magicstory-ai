import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { category, length, language } = req.body;

    // Step 1: Generate story
    const storyPrompt = `Write a ${length} bedtime story in ${language} about ${category}.
Make it engaging, imaginative, and child-friendly.
Return only the story text with paragraphs.`;

    const storyResp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: storyPrompt }],
    });

    const story = storyResp.choices[0].message.content.trim();

    // Step 2: Generate 2–4 key scenes
    const scenePrompt = `From this story, extract 3 short scene descriptions (max 10 words each) 
that would look beautiful as illustrations: ${story}`;

    const sceneResp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: scenePrompt }],
    });

    const scenes = sceneResp.choices[0].message.content
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 3)
      .slice(0, 3); // keep 3 images max

    // Step 3: Generate images for scenes
    const imageUrls = [];
    for (const scene of scenes) {
      const img = await client.images.generate({
        model: "gpt-image-1",
        prompt: `Children's book illustration, soft pastel style: ${scene}`,
        size: "512x512",
      });
      imageUrls.push(img.data[0].url);
    }

    // Step 4: Return result
    res.status(200).json({
      title: `A Magical ${category} Story`,
      content: story,
      images: imageUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
