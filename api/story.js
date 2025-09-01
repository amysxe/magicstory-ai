import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language, moral } = req.body;

  if (!category || !length || !language || !moral) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `Write a ${length} ${language} story for kids about "${category}" with a moral of "${moral}". Include a title as the first line. Separate paragraphs with line breaks.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    });

    console.log("OpenAI raw response:", response);

    const storyText = response.choices[0].message.content;
    if (!storyText || storyText.trim() === "") {
      console.error("Empty story from OpenAI");
      return res.status(500).json({ error: "OpenAI returned empty story." });
    }

    const lines = storyText.split("\n").filter(l => l.trim() !== "");
    const title = lines[0] || "Magic Story";
    const content = lines.slice(1).join("\n") || storyText;

    res.status(200).json({ title, content });

  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message || err);
    let message = "Failed to generate story";
    if (err.response?.status === 401) message = "Invalid OpenAI API key";
    if (err.response?.status === 429) message = "OpenAI rate limit exceeded";
    res.status(500).json({ error: message });
  }
}
