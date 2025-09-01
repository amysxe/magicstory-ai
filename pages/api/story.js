import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setStory(null);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language }),
      });

      const data = await res.json();

      // clean up ** from titles
      const cleanedTitle = data.title.replace(/\*\*/g, "");

      setStory({
        title: cleanedTitle,
        content: data.content,
      });
    } catch (err) {
      console.error(err);
      alert("Error generating story");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Magic Story with AI</h1>

      <div style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <select
            style={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="fruit">Fruit</option>
            <option value="animal">Animal</option>
            <option value="person">Person</option>
            <option value="mix">Mix</option>
            <option value="random">Random</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Story Length</label>
          <select
            style={styles.select}
            value={length}
            onChange={(e) => setLength(e.target.value)}
          >
            <option value="5-10">5–10 min</option>
            <option value="10-15">10–15 min</option>
            <option value="15+">More than 15 min</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Language</label>
          <select
            style={styles.select}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Bahasa">Bahasa</option>
            <option value="German">German</option>
          </select>
        </div>

        <button
          style={styles.button}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </div>

      {story && (
        <div style={styles.storyBox}>
          <h2 style={styles.storyTitle}>{story.title}</h2>
          <div style={styles.storyText}>
            {story.content.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
          <button style={styles.findMore} onClick={handleRegenerate}>
            Find More Story
          </button>
        </div>
      )}

      <footer style={styles.footer}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Nunito', sans-serif",
    backgroundColor: "#fdf6f0",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    paddingBottom: "80px", // leave space for footer
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "150px",
  },
  button: {
    backgroundColor: "#ff8c42",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    alignSelf: "flex-end",
    transition: "background 0.3s",
  },
  storyBox: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "700px",
    width: "100%",
    textAlign: "left",
    marginBottom: "40px",
  },
  storyTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#222",
  },
  storyText: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#333",
    whiteSpace: "pre-line",
  },
  findMore: {
    marginTop: "20px",
    backgroundColor: "#ff8c42",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: "0",
    marginBottom: "60px",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#555",
  },
};
