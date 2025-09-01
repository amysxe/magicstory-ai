import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [characters, setCharacters] = useState("");
  const [moral, setMoral] = useState("");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic || !characters || !moral) {
      alert("Please fill in all fields!");
      return;
    }
    setLoading(true);
    setStory(null);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, characters, moral, language }),
      });

      const data = await res.json();
      if (res.ok) {
        setStory(data);
      } else {
        alert(data.error || "Failed to generate story");
      }
    } catch (err) {
      console.error(err);
      alert("Sorry, something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Magic Story with AI</h1>
      <p className="subtitle">
        Create wonderful children’s stories with AI — choose your topic,
        characters, and moral lesson.
      </p>

      <div className="form">
        <input
          type="text"
          placeholder="Story Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Characters"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Moral Lesson"
          value={moral}
          onChange={(e) => setMoral(e.target.value)}
          className="input"
        />
        <select
          className="input"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Bahasa</option>
          <option>German</option>
        </select>

        <button onClick={handleGenerate} disabled={loading} className="button">
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </div>

      {story && (
        <div className="story-result">
          <h2 className="story-title">{story.title}</h2>
          <div
            className="story-content"
            dangerouslySetInnerHTML={{
              __html: story.content.replace(/\n/g, "<br/><br/>"),
            }}
          />

          {/* Render images if available */}
          {story.images && story.images.length > 0 && (
            <div className="story-images">
              {story.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Story illustration ${idx + 1}`}
                  className="story-image"
                />
              ))}
            </div>
          )}

          <button className="button" onClick={handleGenerate}>
            Find More Story
          </button>
        </div>
      )}

      <footer className="footer">
        Copyright &copy; 2025 by Laniakea Digital
      </footer>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px 100px; /* extra padding for footer */
          font-family: "Georgia", serif;
          background: #faf6f1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .title {
          font-size: 36px;
          text-align: center;
          margin-bottom: 10px;
          color: #4b2e2e;
        }
        .subtitle {
          text-align: center;
          margin-bottom: 40px;
          color: #6d4c41;
          font-size: 18px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }
        .input {
          padding: 14px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        .button {
          padding: 14px;
          background: #ff7043;
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .button:hover {
          background: #f4511e;
        }
        .story-result {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }
        .story-title {
          font-size: 28px;
          margin-bottom: 20px;
          text-align: center;
          color: #4b2e2e;
        }
        .story-content {
          font-size: 18px;
          line-height: 1.8;
          color: #333;
          margin-bottom: 30px;
        }
        .story-images {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
          justify-content: center;
        }
        .story-image {
          width: 240px;
          height: 240px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .footer {
          margin-top: auto;
          text-align: center;
          font-size: 14px;
          color: #666;
          padding: 20px 0;
          margin-bottom: 60px;
        }
      `}</style>
    </div>
  );
}
