import { useState, useRef } from "react";
import Story from "../components/Story";
import Head from "next/head";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);

  const generateStory = async () => {
    setLoading(true);
    setStoryData(null);
    window.speechSynthesis.cancel(); // stop previous audio
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setStoryData(data);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      alert("Failed to generate story");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Head>
        <title>Magic Story With AI</title>
      </Head>

      <div ref={topRef} style={{ fontFamily: "Helvetica Neue", padding: "20px", background: "#f9f5f0", minHeight: "100vh" }}>
        <h1 style={{ textAlign: "center" }}>Magic Story with AI</h1>
        <p style={{ textAlign: "center" }}>Generate fun and meaningful stories for kids!</p>

        <div style={{
          background: "#fff5eb",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "900px",
          margin: "20px auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // 2 fields per row
          gap: "10px"
        }}>
          <div>
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "8px" }}>
              <option>Animal</option>
              <option>Fruit</option>
              <option>Person</option>
              <option>Mix</option>
              <option>Random</option>
            </select>
          </div>
          <div>
            <label>Length</label>
            <select value={length} onChange={e => setLength(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "8px" }}>
              <option>5-10 min</option>
              <option>10-15 min</option>
              <option>&gt;15 min</option>
            </select>
          </div>

          <div>
            <label>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "8px" }}>
              <option>English</option>
              <option>Bahasa</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label>Moral</label>
            <select value={moral} onChange={e => setMoral(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "8px" }}>
              <option>Kindness</option>
              <option>Honesty</option>
              <option>Friendship</option>
              <option>Bravery</option>
            </select>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "20px" }}>
          <button
            onClick={generateStory}
            disabled={loading}
            style={{
              background: "#ff7043",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {loading ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {storyData && <Story data={storyData} />}

        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#ffdace",
            color: "#ff7043",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer"
          }}
        >
          ↑ Scroll to top
        </button>

        <footer style={{ textAlign: "center", marginTop: "40px", marginBottom: "60px" }}>
          Copyright &copy; 2025 by Laniakea Digital
        </footer>
      </div>
    </>
  );
}
