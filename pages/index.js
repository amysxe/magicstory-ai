import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");

  const [story, setStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState(
    "Meaningful story makes memorable moment"
  );

  const storyRef = useRef();
  const audioRef = useRef();

  // Loader text loop
  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Meaningful story makes memorable moment...",
      "Bedtime story will never fail the children...",
      "Worry no more with Magic Story...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoaderMessage(messages[i % messages.length]);
      i++;
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  const generateStory = async () => {
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setLoading(true);
    setStory(null);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });

      if (!res.ok) throw new Error("Failed to generate story");

      const data = await res.json();
      setStory(data);

      // Generate TTS
      const ttsRes = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content.join("\n"), language }),
      });
      const ttsData = await ttsRes.json();
      setAudioUrl(ttsData.audioUrl);

      setLoading(false);

      // Scroll to story title
      storyRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to generate story. Please try again.");
    }
  };

  return (
    <div style={{ fontFamily: "Helvetica Neue", padding: "20px", background: "#f6f6f6", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "5px" }}>Magic Story With AI</h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>Generate fun and meaningful stories for kids!</p>

      {/* Fields container */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", background: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ flex: "1 1 45%" }}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={fieldStyle}>
            <option>Animal</option>
            <option>Fruit</option>
            <option>Person</option>
            <option>Mix & Random</option>
          </select>
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <label>Length</label>
          <select value={length} onChange={(e) => setLength(e.target.value)} style={fieldStyle}>
            <option>5-10 min</option>
            <option>10-15 min</option>
            <option>&gt;15 min</option>
          </select>
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={fieldStyle}>
            <option>English</option>
            <option>Bahasa</option>
            <option>German</option>
          </select>
        </div>

        <div style={{ flex: "1 1 45%" }}>
          <label>Moral</label>
          <select value={moral} onChange={(e) => setMoral(e.target.value)} style={fieldStyle}>
            <option>Kindness</option>
            <option>Friendship</option>
            <option>Honesty</option>
            <option>Perseverance</option>
          </select>
        </div>
      </div>

      {/* Generate button */}
      <div style={{ maxWidth: "900px", margin: "20px auto 0 auto" }}>
        <button style={buttonStyle} onClick={generateStory}>Generate Story</button>
      </div>

      {/* Overlay loader */}
      {loading && (
        <div style={overlayStyle}>
          <div style={{ textAlign: "center", color: "#333", fontSize: "18px" }}>{loaderMessage}</div>
        </div>
      )}

      {/* Story result */}
      {story && (
        <div ref={storyRef} style={{ background: "#fff", maxWidth: "900px", margin: "30px auto", padding: "20px", borderRadius: "10px" }}>
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>{story.title}</h2>

          {audioUrl && (
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <audio controls src={audioUrl} ref={audioRef} style={{ width: "80%" }} />
            </div>
          )}

          {story.content.map((p, i) => (
            <p key={i} style={{ textAlign: "justify", margin: "15px 0", lineHeight: "1.6" }}>{p}</p>
          ))}
        </div>
      )}

      {/* Scroll to top */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#ffdace",
          color: "#ff7043",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          cursor: "pointer"
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Top
      </button>

      <footer style={{ textAlign: "center", marginTop: "50px" }}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}

// Styling
const fieldStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  fontFamily: "Helvetica Neue",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#ff7043",
  color: "#fff",
  fontFamily: "Helvetica Neue",
  fontSize: "14px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
