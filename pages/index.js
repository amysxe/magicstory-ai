import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [category, setCategory] = useState("Fruit");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const storyRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const generateStory = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });

      const data = await res.json();
      if (res.ok) {
        setStoryData(data);
      } else {
        alert(data.error || "Failed to generate story");
      }
    } catch (err) {
      console.error(err);
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storyData && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [storyData]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="container">
      <h1 className="title">Magic Story with AI</h1>
      <p className="subtitle">Generate fun and meaningful stories for kids!</p>

      <div className="form-box">
        <div className="form-row">
          <div className="field">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option>Fruit</option>
              <option>Animal</option>
              <option>Person</option>
              <option>Mix</option>
              <option>Random</option>
            </select>
          </div>

          <div className="field">
            <label>Story Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="input"
            >
              <option>5-10 min</option>
              <option>10-15 min</option>
              <option>&gt;15 min</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input"
            >
              <option>English</option>
              <option>Bahasa</option>
              <option>German</option>
            </select>
          </div>

          <div className="field">
            <label>Moral Lesson</label>
            <select
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              className="input"
            >
              <option>Kindness</option>
              <option>Honesty</option>
              <option>Adventure</option>
              <option>Bravery</option>
              <option>Friendship</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateStory}
          disabled={loading}
          className="button"
        >
          {loading ? "Generating..." : "✨ Generate Story"}
        </button>
      </div>

      {storyData && (
        <div className="story-result" ref={storyRef}>
          <h2 className="story-title">{storyData.title}</h2>
          <div className="story-content">
            {storyData.content.split(/\n+/).map((para, idx) => (
              <p key={idx} className="story-paragraph">{para}</p>
            ))}
          </div>

          {storyData.images?.length > 0 && (
            <div className="story-images">
              {storyData.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Story illustration ${idx + 1}`}
                  className="story-image"
                />
              ))}
            </div>
          )}

          <button onClick={generateStory} className="button">
            Find More Story
          </button>
        </div>
      )}

      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          ⬆ Top
        </button>
      )}

      <footer className="footer">
        Copyright &copy; 2025 by Laniakea Digital
      </footer>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px 100px;
          font-family: "Helvetica Neue", sans-serif;
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
        .form-box {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }
        .form-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .field {
          flex: 1;
          display: flex;
          flex-direction: column;
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
        .story-paragraph {
          margin-bottom: 16px;
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
        .scroll-top {
          position: fixed;
          bottom: 40px;
          right: 40px;
          padding: 12px 16px;
          background: #ff7043;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          transition: background 0.3s;
        }
        .scroll-top:hover {
          background: #f4511e;
        }
        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
          }
          .story-image {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}
