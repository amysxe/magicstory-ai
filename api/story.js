import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { category, length, language, moral } = req.body;
  if (!category || !length || !language || !moral)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const prompt = `Write a ${length} ${language} story for kids about "${category}" with a moral of "${moral}". Include a title as the first line. Separate paragraphs with line breaks.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    const storyText = response.choices[0].message.content;
    const lines = storyText.split("\n").filter(l => l.trim() !== "");
    const title = lines[0] || "Magic Story";
    const paragraphs = lines.slice(1);

    // Generate ONE image for the title
    let image = null;
    try {
      const imgResp = await openai.images.generate({
        prompt: title,
        size: "512x512",
      });
      image = imgResp.data[0].url;
    } catch (err) {
      console.error("Image generation error:", err);
    }

    res.status(200).json({ title, content: paragraphs, image });

  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
