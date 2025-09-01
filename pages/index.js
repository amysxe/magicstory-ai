import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");

  const [story, setStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Meaningful story makes memorable moment");

  const audioRef = useRef(null);
  let loaderInterval;

  const loaderMessages = [
    "Meaningful story makes memorable moment",
    "Bedtime story will never fail the children",
    "Worry no more with Magic Story"
  ];

  const generateStory = async () => {
    setLoading(true);
    setStory(null);
    setAudioUrl(null);
    setLoaderText(loaderMessages[0]);

    let idx = 1;
    loaderInterval = setInterval(() => {
      setLoaderText(loaderMessages[idx % loaderMessages.length]);
      idx++;
    }, 5000);

    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      // Generate story content
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });
      const data = await res.json();
      setStory(data);

      // Generate TTS audio
      const ttsResp = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.paragraphs.join("\n"), language }),
      });
      const ttsData = await ttsResp.json();
      setAudioUrl(ttsData.audio_url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate story or audio");
    } finally {
      clearInterval(loaderInterval);
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Helvetica Neue", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {/* Page Title */}
      <h1 style={{ textAlign: "center" }}>Magic Story With AI</h1>
      <p style={{ textAlign: "center" }}>Generate fun and meaningful stories for kids!</p>

      {/* Fields + Button Container */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginTop: "20px"
      }}>
        {/* Row 1 */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 45%" }}>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px" }}>
              <option>Animal</option>
              <option>Fruit</option>
              <option>Person</option>
              <option>Mix</option>
            </select>
          </div>
          <div style={{ flex: "1 1 45%" }}>
            <label>Length</label>
            <select value={length} onChange={(e) => setLength(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px" }}>
              <option>5-10 min</option>
              <option>10-15 min</option>
              <option>{">15 min"}</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 45%" }}>
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px" }}>
              <option>English</option>
              <option>Bahasa</option>
              <option>German</option>
            </select>
          </div>
          <div style={{ flex: "1 1 45%" }}>
            <label>Moral</label>
            <select value={moral} onChange={(e) => setMoral(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px" }}>
              <option>Kindness</option>
              <option>Honesty</option>
              <option>Patience</option>
              <option>Generosity</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div style={{ marginTop: "20px", alignSelf: "flex-start" }}>
          <button
            onClick={generateStory}
            style={{
              backgroundColor: "#ff7043",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              border: "none",
            }}
          >
            Generate Story
          </button>
        </div>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(255,255,255,0.95)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9999, flexDirection: "column", textAlign: "center"
        }}>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#ff7043" }}>{loaderText}</p>
        </div>
      )}

      {/* Generated Story */}
      {story && (
        <div style={{ marginTop: "40px", background: "#fff", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          {/* Bold Title */}
          <h2 style={{ fontWeight: "bold" }}>{story.title}</h2>

          {/* Optional Representative Image */}
          {story.image && (
            <img src={story.image} alt={story.title} style={{ width: "100%", maxHeight: "300px", objectFit: "cover", margin: "20px 0" }} />
          )}

          {/* Story paragraphs */}
          {story.paragraphs && story.paragraphs.map((p, idx) => (
            <p key={idx} style={{ margin: "16px 0", lineHeight: "1.6", textAlign: "center" }}>{p}</p>
          ))}

          {/* Audio Player */}
          {audioUrl && (
            <div style={{ marginTop: "20px" }}>
              <audio ref={audioRef} src={audioUrl} controls />
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
