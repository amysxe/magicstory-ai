import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory(null);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setStory(data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate story.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Helvetica Neue", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Magic Story With AI</h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>Generate fun and meaningful stories for kids!</p>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", display: "flex", flexWrap: "wrap", gap: "15px" }}>
        <div style={{ flex: "1 1 45%" }}>
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px" }}>
            <option>Animal</option>
            <option>Fruit</option>
            <option>Person</option>
            <option>Mix</option>
            <option>Random</option>
          </select>
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <label>Length</label>
          <select value={length} onChange={e => setLength(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px" }}>
            <option>5-10 min</option>
            <option>10-15 min</option>
            <option>&gt;15 min</option>
          </select>
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px" }}>
            <option>English</option>
            <option>Bahasa</option>
            <option>German</option>
          </select>
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <label>Moral</label>
          <select value={moral} onChange={e => setMoral(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px" }}>
            <option>Kindness</option>
            <option>Honesty</option>
            <option>Bravery</option>
            <option>Friendship</option>
            <option>Respect</option>
          </select>
        </div>
      </div>

      <button onClick={generateStory} style={{ background: "#ff7043", color: "#fff", padding: "14px 0", border: "none", borderRadius: "12px", marginTop: "25px", cursor: "pointer", width: "100%", fontWeight: "bold", fontSize: "16px" }}>
        {loading ? "Generating..." : "Generate Story"}
      </button>

      {story && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h2>{story.title}</h2>
          {story.content.split("\n").map((p, i) => (
            <p key={i} style={{ margin: "10px 0", lineHeight: "1.6" }}>{p}</p>
          ))}
        </div>
      )}

      <footer style={{ textAlign: "center", marginTop: "60px" }}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
