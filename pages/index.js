import { useState, useEffect } from "react";
import Story from "../components/Story";

export default function Home() {
  const [category, setCategory] = useState("Fruit");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Friendship");
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const generateStory = async () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setLoading(true);
    setStoryData(null);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });
      if (!res.ok) throw new Error("Failed to generate story");
      const data = await res.json();

      // remove "Title:" prefix if present
      if (data.title.startsWith("Title:")) data.title = data.title.replace(/^Title:\s*/, "");

      setStoryData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate story. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
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
      </div>

      {showScroll && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑ Top
        </button>
      )}

      <footer>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          font-family: "Helvetica Neue", sans-serif;
          text-align: center;
          flex: 1;
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
        .scroll-top {
          position: fixed;
          bottom: 40px;
          right: 30px;
          padding: 12px 16px;
          background: #ffdace;
          color: #ff7043;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
          z-index: 100;
        }
        .scroll-top:hover {
          background: #ffcfb8;
        }
        footer {
          text-align: center;
          padding: 20px 0;
          margin-top: auto;
          background: #fdf6e3;
          color: #555;
          font-size: 16px;
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
