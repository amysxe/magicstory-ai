import { useState } from "react";
import Story from "/components/story";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Friendship");
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // stop previous audio
      }

      setLoading(true);
      setStoryData(null);

      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });

      if (!res.ok) throw new Error("Failed to generate story");

      const data = await res.json();
      setStoryData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate story. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Magic Story with AI</h1>
      <p>Generate fun and meaningful stories for kids!</p>

      <div className="form-box">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Fruit</option>
          <option>Animal</option>
          <option>Person</option>
          <option>Mix</option>
          <option>Random</option>
        </select>

        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option>5-10 min</option>
          <option>10-15 min</option>
          <option>&gt;15 min</option>
        </select>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Bahasa</option>
          <option>German</option>
        </select>

        <select value={moral} onChange={(e) => setMoral(e.target.value)}>
          <option>Friendship</option>
          <option>Honesty</option>
          <option>Kindness</option>
          <option>Sharing</option>
        </select>

        <button onClick={generateStory} disabled={loading}>
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </div>

      {storyData && (
        <Story
          key={storyData.title}
          data={storyData}
          language={language}
          onGenerateMore={generateStory}
        />
      )}

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          font-family: "Helvetica Neue", sans-serif;
          text-align: center;
        }
        .form-box {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          background: #fdf6e3;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }
        select,
        button {
          padding: 12px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        button {
          background: #ff7043;
          color: white;
          cursor: pointer;
          grid-column: span 2;
          transition: background 0.3s;
        }
        button:hover {
          background: #f4511e;
        }
        @media (max-width: 600px) {
          .form-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
