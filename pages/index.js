import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");

  const [story, setStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Your story is being generated...");

  const audioRef = useRef(null);
  let longTimer;

  const generateStory = async () => {
    setLoading(true);
    setStory(null);
    setAudioUrl(null);
    setLoaderMessage("Your story is being generated...");

    // Show longer message if takes >5s
    longTimer = setTimeout(() => {
      setLoaderMessage("This takes longer than usual. Please wait");
    }, 5000);

    try {
      // 1. Generate story
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });
      const data = await res.json();
      setStory(data);

      // 2. Generate TTS
      const ttsResp = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content.join("\n"), language }),
      });
      const ttsData = await ttsResp.json();
      setAudioUrl(ttsData.audio_url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate story or audio");
    } finally {
      clearTimeout(longTimer);
      setLoading(false); // loader gone only when both story + audio ready
    }
  };

  const handlePlay = () => {
    if (audioRef.current) audioRef.current.play();
  };

  const handlePause = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div style={{ fontFamily: "Helvetica Neue", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>Magic Story With AI</h1>
      <p>Generate fun and meaningful stories for kids!</p>

      {/* Form Fields */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 45%" }}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Animal</option>
            <option>Fruit</option>
            <option>Person</option>
            <option>Mix</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Length</label>
          <select value={length} onChange={(e) => setLength(e.target.value)}>
            <option>5-10 min</option>
            <option>10-15 min</option>
            <option>>15 min</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Bahasa</option>
            <option>German</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Moral</label>
          <select value={moral} onChange={(e) => setMoral(e.target.value)}>
            <option>Kindness</option>
            <option>Honesty</option>
            <option>Patience</option>
            <option>Generosity</option>
          </select>
        </div>
      </div>

      <button
        onClick={generateStory}
        style={{
          marginTop: "20px",
          backgroundColor: "#ff7043",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Generate Story
      </button>

      {/* Loader Overlay */}
      {loading && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(255,255,255,0.95)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9999, flexDirection: "column", textAlign: "center"
        }}>
          <img src="/spinner.gif" alt="Loading..." style={{ width: "80px", height: "80px", marginBottom: "20px" }} />
          <p style={{ fontSize: "18px", color: "#333" }}>{loaderMessage}</p>
        </div>
      )}

      {/* Generated Story */}
      {story && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>{story.title}</h2>
          {story.image && (
            <img src={story.image} alt={story.title} style={{ width: "100%", maxHeight: "300px", objectFit: "cover", marginBottom: "20px" }} />
          )}
          {story.content.map((p, idx) => (
            <p key={idx} style={{ margin: "16px 0" }}>{p}</p>
          ))}

          {/* Audio Player */}
          {audioUrl && (
            <div style={{ marginTop: "20px" }}>
              <audio ref={audioRef} src={audioUrl} />
              <button onClick={handlePlay} style={{ marginRight: "10px", backgroundColor: "#ffdace", color: "#ff7043", padding: "8px 12px", borderRadius: "12px", fontSize: "14px" }}>
                ▶ Play with audio
              </button>
              <button onClick={handlePause} style={{ marginRight: "10px", backgroundColor: "#ffdace", color: "#ff7043", padding: "8px 12px", borderRadius: "12px", fontSize: "14px" }}>
                ⏸ Pause
              </button>
              <button onClick={handleStop} style={{ backgroundColor: "#ffdace", color: "#ff7043", padding: "8px 12px", borderRadius: "12px", fontSize: "14px" }}>
                ⏹ Stop
              </button>
            </div>
          )}
        </div>
      )}

      <footer style={{ textAlign: "center", marginTop: "60px", padding: "20px 0" }}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
