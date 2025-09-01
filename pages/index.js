import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("fruit");
  const [length, setLength] = useState("5-10");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory("");
    setImages([]);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language }),
      });
      const data = await response.json();
      setStory(data.story);
      setImages(data.images || []);
    } catch (err) {
      console.error("Error generating story:", err);
      setStory("Sorry, something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Magic Story with AI</h1>

      <div style={styles.form}>
        <label style={styles.label}>Choose Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="fruit">Fruit</option>
          <option value="animal">Animal</option>
          <option value="person">Person</option>
          <option value="mix">Mix</option>
          <option value="random">Random</option>
        </select>

        <label style={styles.label}>Story Length:</label>
        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          style={styles.select}
        >
          <option value="5-10">5 - 10 min</option>
          <option value="10-15">10 - 15 min</option>
          <option value="15+">&gt; 15 min</option>
        </select>

        <label style={styles.label}>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
        >
          <option value="English">English</option>
          <option value="Bahasa">Bahasa</option>
          <option value="German">German</option>
        </select>

        <button
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.button.backgroundColor)
          }
          onClick={generateStory}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </div>

      {story && (
        <div style={styles.storyBox}>
          <h2 style={styles.storyTitle}>
            {story.split("\n")[0].trim()}
          </h2>
          <p style={styles.storyText}>
            {story
              .split("\n")
              .slice(1)
              .map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                  <br />
                </span>
              ))}
          </p>
          <div style={styles.imageBox}>
            {images.map((img, idx) => (
              <img key={idx} src={img} alt="Story visual" style={styles.image} />
            ))}
          </div>

          <button
            style={{ ...styles.button, marginTop: "20px" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
            onClick={generateStory}
          >
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
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f9f6f1",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    position: "relative",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#4a2c2a",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "480px",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    fontWeight: "500",
    marginBottom: "6px",
    color: "#333",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    marginBottom: "12px",
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
    transition: "background 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#e65c00",
  },
  storyBox: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "720px",
    marginBottom: "40px",
  },
  storyTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#4a2c2a",
    textAlign: "center",
  },
  storyText: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#333",
    textAlign: "justify",
    whiteSpace: "pre-line",
  },
  imageBox: {
    marginTop: "20px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  image: {
    width: "160px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  footer: {
    textAlign: "center",
    color: "#777",
    fontSize: "0.9rem",
    marginTop: "auto",
    paddingBottom: "60px",
  },
};
