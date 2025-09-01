// pages/api/story.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { category, length } = req.body;

  const prompt = `Write a fun bedtime story for kids about a ${category}.
  The story should last about ${length} minutes.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    return res.status(200).json({ story: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
