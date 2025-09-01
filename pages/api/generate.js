// pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });

  const { category = "animal", length = "5-10" } = req.body || {};
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: "OpenAI key not configured" });

  // Construct prompts
  const storyPrompt = `Write a warm, simple, imaginative children's bedtime story for ages 4-8.
Theme/category: ${category}.
Approx duration: ${length} minutes.
Keep language simple, positive, and add gentle conflict + resolution.
Provide the story as plain text.`;

  const imagePrompt = `Children's book illustration, pastel palette, soft outlines, whimsical, theme: ${category}, focus on one main scene that strongly represents the story (no text).`;

  try {
    // 1) Chat completion (text)
    const chatResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change if you have a different model
        messages: [{ role: "user", content: storyPrompt }],
        max_tokens: 900
      })
    });
    if (!chatResp.ok) {
      const errText = await chatResp.text();
      console.error("chat error:", errText);
      throw new Error("Chat API failed");
    }
    const chatJson = await chatResp.json();
    const story = chatJson.choices?.[0]?.message?.content || chatJson.choices?.[0]?.text || "";

    // 2) Image generation
    const imgResp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1024x1024"
      })
    });
    let imageUrl = "";
    if (imgResp.ok) {
      const imgJson = await imgResp.json();
      imageUrl = imgJson.data?.[0]?.url || "";
    } else {
      console.warn("image generation failed (non-fatal)");
    }

    res.status(200).json({ story, image: imageUrl });
  } catch (err) {
    console.error("generate error:", err);
    res.status(500).json({ error: "Generation failed" });
  }
}
