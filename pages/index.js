import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [audio, setAudio] = useState(null);

  const storyRef = useRef(null);

  const loaderMessages = [
    "Meaningful story makes memorable moment",
    "Bedtime story will never fail the children",
    "Worry no more with Magic Story",
  ];

  const handleGenerate = async () => {
    if (audio) {
      window.speechSynthesis.cancel();
      setAudio(null);
    }

    setLoading(true);
    setStory(null);

    let index = 0;
    setLoaderText(loaderMessages[index]);
    const loaderInterval = setInterval(() => {
      index = (index + 1) % loaderMessages.length;
      setLoaderText(loaderMessages[index]);
    }, 5000);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });

      const data = await res.json();

      if (!data.title || !data.paragraphs) throw new Error("No story returned");

      setStory(data);
      clearInterval(loaderInterval);
      setLoading(false);

      // Scroll to story
      setTimeout(() => {
        storyRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Audio
      const utterance = new SpeechSynthesisUtterance(
        [data.title, ...data.paragraphs].join(". ")
      );
      utterance.lang = language === "English" ? "en-US" : language === "Bahasa" ? "id-ID" : "de-DE";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
      setAudio(utterance);
    } catch (err) {
      console.error(err);
      clearInterval(loaderInterval);
      setLoading(false);
      alert("Failed to generate story.");
    }
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
    setAudio(null);
  };

  return (
    <div style={{ fontFamily: "Helvetica Neue", background: "#f9f9f9", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Magic Story With AI</h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Generate fun and meaningful stories for kids!
      </p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        maxWidth: "900px",
        margin: "0 auto 20px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px"
      }}>
        <div style={{ flex: "1 1 45%" }}>
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>Animal</option>
            <option>Fruit</option>
            <option>Person</option>
            <option>Mix & Random</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Length</label>
          <select value={length} onChange={e => setLength(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>5-10 min</option>
            <option>10-15 min</option>
            <option>&gt;15 min</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>English</option>
            <option>Bahasa</option>
            <option>German</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Moral</label>
          <select value={moral} onChange={e => setMoral(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>Kindness</option>
            <option>Friendship</option>
            <option>Honesty</option>
            <option>Patience</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          style={{
            flex: "1 1 100%",
            marginTop: "10px",
            padding: "10px",
            background: "#ff7043",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Generate Story
        </button>
      </div>

      {/* Full-page loader overlay */}
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          zIndex: 9999,
          textAlign: "center",
          padding: "20px"
        }}>
          {loaderText}
        </div>
      )}

      {/* Story display */}
      {story && (
        <div ref={storyRef} style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px"
        }}>
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>{story.title}</h2>
          {story.paragraphs.map((p, i) => (
            <p key={i} style={{ textAlign: "center", marginBottom: "15px", lineHeight: "1.6" }}>{p}</p>
          ))}

          <button
            onClick={handleStopAudio}
            style={{
              background: "#ffdace",
              color: "#ff7043",
              border: "none",
              borderRadius: "5px",
              padding: "8px 12px",
              cursor: "pointer",
              display: "block",
              margin: "10px auto"
            }}
          >
            Stop Audio
          </button>
        </div>
      )}

      <footer style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
        &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
