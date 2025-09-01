import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("fruit");
  const [length, setLength] = useState("5-10");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory("");
    setTitle("");
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || "Your Story");
        setStory(data.content || "");
      } else {
        setTitle("Error");
        setStory(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setTitle("Error");
      setStory("Server error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#faf8f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ textAlign: "center", padding: "30px 20px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#444" }}>Magic Story with AI</h1>
        <p style={{ fontSize: "1.1rem", color: "#777" }}>Create bedtime stories with images in seconds</p>
      </header>

      {/* Main Content */}
      <main style={{ flex: "1", padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        {/* Form */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Category */}
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}>
              <option value="fruit">Fruit</option>
              <option value="animal">Animal</option>
              <option value="person">Person</option>
              <option value="mix">Mix</option>
              <option value="random">Random</option>
            </select>

            {/* Length */}
            <select value={length} onChange={(e) => setLength(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}>
              <option value="5-10">5 - 10 min</option>
              <option value="10-15">10 - 15 min</option>
              <option value="15+">More than 15 min</option>
            </select>

            {/* Language */}
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}>
              <option value="English">English</option>
              <option value="Bahasa">Bahasa</option>
              <option value="German">German</option>
            </select>

            {/* Button */}
            <button
              onClick={generateStory}
              disabled={loading}
              style={{
                background: "#ff914d",
                color: "#fff",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                transition: "0.3s",
              }}
            >
              {loading ? "Generating..." : "Generate Story"}
            </button>
          </div>
        </div>

        {/* Result */}
        {title && (
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "25px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "15px", color: "#333" }}>{title}</h2>
            <div style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "#444", whiteSpace: "pre-line" }}>
              {story}
            </div>

            {/* Find More Story */}
            <button
              onClick={generateStory}
              disabled={loading}
              style={{
                marginTop: "20px",
                background: "#ff914d",
                color: "#fff",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              {loading ? "Loading..." : "Find More Story"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px", marginTop: "auto", marginBottom: "60px", fontSize: "0.9rem", color: "#777" }}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
