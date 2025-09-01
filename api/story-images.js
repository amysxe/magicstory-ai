import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { paragraphs } = req.body;
    try {
      const urls = [];
      for (const p of paragraphs) {
        const result = await openai.images.generate({
          prompt: `Illustration for the following story paragraph: "${p}"`,
          size: "256x256",
        });
        urls.push(result.data[0].url);
      }
      res.status(200).json(urls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate images" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
