import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
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

      if (!res.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await res.json();
      setTitle(data.title || "Untitled Story");
      setStory(data.content || "No story generated.");
    } catch (err) {
      console.error(err);
      setStory("❌ Sorry, something went wrong while generating your story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Magic Story with AI</h1>

      <div className="form">
        <label>Choose a Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="fruit">Fruit</option>
          <option value="animal">Animal</option>
          <option value="person">Person</option>
          <option value="mix">Mix</option>
          <option value="random">Random</option>
        </select>

        <label>Story Length</label>
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="5-10">5–10 min</option>
          <option value="10-15">10–15 min</option>
          <option value="15+">15+ min</option>
        </select>

        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Bahasa">Bahasa</option>
          <option value="German">German</option>
        </select>

        <button className="generate-btn" onClick={generateStory} disabled={loading}>
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </div>

      {story && (
        <div className="story-box">
          <h2 className="story-title">{title}</h2>
          <p className="story-text">
            {story.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
                <br />
              </span>
            ))}
          </p>
          <button className="find-more" onClick={generateStory}>
            🔄 Find More Story
          </button>
        </div>
      )}

      <footer className="footer">
        Copyright &copy; 2025 by Laniakea Digital
      </footer>

      <style jsx>{`
        .container {
          font-family: Georgia, serif;
          background-color: #faf6f1;
          min-height: 100vh;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 20px;
        }
        .form {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        label {
          font-size: 1rem;
          margin-bottom: 4px;
        }
        select {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }
        .generate-btn {
          padding: 12px;
          background-color: #ff7f50;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .generate-btn:hover {
          background-color: #ff6333;
        }
        .story-box {
          margin-top: 30px;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          width: 100%;
        }
        .story-title {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: #444;
        }
        .story-text {
          font-size: 1.1rem;
          line-height: 1.6;
          white-space: pre-line;
        }
        .find-more {
          margin-top: 20px;
          padding: 10px 16px;
          background: #ff7f50;
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }
        .find-more:hover {
          background: #ff6333;
        }
        .footer {
          margin-top: auto;
          text-align: center;
          padding: 20px 0;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 60px;
        }
      `}</style>
    </div>
  );
}
