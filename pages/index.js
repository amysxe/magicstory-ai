// pages/index.js
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10");
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [running, setRunning] = useState(false);

  async function generate() {
    setRunning(true);
    setStory("");
    setImageUrl("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Generation failed");
      setStory(j.story || "");
      setImageUrl(j.image || "");
    } catch (e) {
      setStory("Sorry — could not generate story. Check server logs.");
      console.error(e);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>MagicStory AI</h1>
      <div style={{ margin: "1rem 0" }}>
        <label>Category:{" "}
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="animal">Animal</option>
            <option value="fruit">Fruit</option>
            <option value="person">Person</option>
            <option value="mix">Mix</option>
            <option value="random">Random</option>
          </select>
        </label>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <label>Length:{" "}
          <select value={length} onChange={(e)=>setLength(e.target.value)}>
            <option value="5-10">5–10 min</option>
            <option value="10-15">10–15 min</option>
            <option value="15+">15+ min</option>
          </select>
        </label>
      </div>

      <button onClick={generate} disabled={running} style={{ padding: "8px 14px" }}>
        {running ? "Creating..." : "Generate Story"}
      </button>

      {story && (
        <div style={{ marginTop: 20, padding: 12, borderRadius: 8, background: "#fff" }}>
          <h2>Your Story</h2>
          <p style={{ whiteSpace: "pre-line" }}>{story}</p>
          {imageUrl && <img src={imageUrl} alt="illustration" style={{ width: "100%", borderRadius: 8, marginTop: 12 }} />}
        </div>
      )}
    </div>
  );
}
