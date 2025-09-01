// pages/index.js
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("");
  const [length, setLength] = useState("");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    if (!category || !length || !language) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    setStory("");
    setTitle("");

    const response = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, length, language }),
    });

    const data = await response.json();
    if (data.story) {
      const parts = data.story.split("\n");
      const firstLine = parts.shift();
      setTitle(firstLine.trim());
      setStory(parts.join("\n").trim());
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Magic Story with AI</h1>

        <div style={styles.form}>
          <select
            style={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Fruit">Fruit</option>
            <option value="Animal">Animal</option>
            <option value="Person">Person</option>
            <option value="Mix">Mix</option>
            <option value="Random">Random</option>
          </select>

          <select
            style={styles.input}
            value={length}
            onChange={(e) => setLength(e.target.value)}
          >
            <option value="">Select Length</option>
            <option value="5-10">5-10 min</option>
            <option value="10-15">10-15 min</option>
            <option value="15+">15+ min</option>
          </select>

          <select
            style={styles.input}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Bahasa">Bahasa</option>
            <option value="German">German</option>
          </select>

          <button style={styles.button} onClick={generateStory} disabled={loading}>
            {loading ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {title && (
          <div style={styles.storyBox}>
            <h2 style={styles.storyTitle}>{title}</h2>
            <p style={styles.storyText}>
              {story.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                  <br />
                </span>
              ))}
            </p>
            <button style={styles.findMore} onClick={generateStory}>
              Find More Story
            </button>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px",
    flex: "1",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  button: {
    backgroundColor: "#ff6600",
    color: "#fff",
    padding: "14px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  storyBox: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },
  storyTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#333",
    textAlign: "center",
  },
  storyText: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    color: "#444",
    whiteSpace: "pre-line",
  },
  findMore: {
    marginTop: "20px",
    backgroundColor: "#ff6600",
    color: "#fff",
    padding: "12px 18px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    fontSize: "0.9rem",
    color: "#777",
    marginBottom: "60px",
  },
};
