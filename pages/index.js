import { useState, useEffect } from "react";
import Head from "next/head";
import Story from "../components/Story";

export default function Home() {
  const [category, setCategory] = useState("Fruit");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Friendship");
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [audioUtterance, setAudioUtterance] = useState(null);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const stopAudio = () => {
    if (audioUtterance) {
      if (audioUtterance.pause) audioUtterance.pause(); // TTS Audio
      window.speechSynthesis.cancel(); // fallback
      setAudioUtterance(null);
    }
  };

  const generateStory = async () => {
    stopAudio();
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
      <Head>
        <title>Magic Story With AI</title>
      </Head>

      <div className="container">
        <h1>Magic Story with AI</h1>
        <p>Generate fun and meaningful stories for kids!</p>

        <div className="form-box">
          <div className="field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Fruit</option>
              <option>Animal</option>
              <option>Person</option>
              <option>Mix</option>
              <option>Random</option>
            </select>
          </div>

          <div className="field">
            <label>Story Length</label>
            <select value={length} onChange={(e) => setLength(e.target.value)}>
              <option>5-10 min</option>
              <option>10-15 min</option>
              <option>&gt;15 min</option>
            </select>
          </div>

          <div className="field">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Bahasa</option>
              <option>German</option>
            </select>
          </div>

          <div className="field">
            <label>Moral</label>
            <select value={moral} onChange={(e) => setMoral(e.target.value)}>
              <option>Friendship</option>
              <option>Honesty</option>
              <option>Kindness</option>
              <option>Sharing</option>
            </select>
          </div>

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
            stopAudio={stopAudio}
            setAudioUtterance={setAudioUtterance}
          />
        )}
      </div>

      {showScroll && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑ Top
        </button>
      )}

      <footer>Copyright &copy; 2025 by Laniakea Digital.</footer>

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .container {
          max-width: 900px;
          width: 95%;
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
        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .field label {
          font-weight: bold;
          text-align: left;
        }
        select,
        button {
          padding: 12px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
          width: 100%;
          box-sizing: border-box;
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
          width: 80px;
          padding: 12px;
          background: #ffdace;
          color: #ff7043;
          border: none;
          border-radius: 8px;
          font-size: 16px;
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
