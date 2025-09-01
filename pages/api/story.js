// pages/api/story.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API Key" });
  }

  try {
    // --- Generate story text ---
    const storyPrompt = `
    Write a ${length} bedtime story for kids in ${language}.
    The main character should be from this category: ${category}.
    Make it fun, simple, and imaginative.
    Return the story with a short title (first line).
    `;

    const storyResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: storyPrompt }],
        temperature: 0.8,
      }),
    });

    const storyData = await storyResponse.json();

    if (!storyData.choices || storyData.choices.length === 0) {
      throw new Error("No story generated");
    }

    const storyText = storyData.choices[0].message.content.trim();
    const [titleLine, ...contentLines] = storyText.split("\n");
    const title = titleLine.replace(/\*\*/g, "").trim();
    const content = contentLines.join("\n").trim();

    // --- Generate representative image ---
    const imagePrompt = `Children's book illustration, ${category}, dreamy, colorful, soft style`;
    const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "512x512",
      }),
    });

    const imageData = await imageResponse.json();
    const imageUrl =
      imageData.data && imageData.data.length > 0 ? imageData.data[0].url : null;

    res.status(200).json({ title, content, imageUrl });
  } catch (error) {
    console.error("Story generation error:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
