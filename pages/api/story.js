export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, length, language } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative story generator for children.",
          },
          {
            role: "user",
            content: `Write a ${length} children's story in ${language}. The main character should be from the category: ${category}. Include a fun, imaginative title.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "OpenAI request failed" });
    }

    const output = data.choices[0].message.content;

    // Extract title + story (if GPT gives in markdown style)
    const [firstLine, ...rest] = output.split("\n");
    let title = firstLine.replace(/^\*+|\*+$/g, "").trim();
    if (!title || title.length > 100) title = "Your AI Story";

    const content = rest.join("\n").trim();

    return res.status(200).json({ title, content });
  } catch (err) {
    console.error("API route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
