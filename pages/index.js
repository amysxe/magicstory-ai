import { useState, useRef } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Meaningful story makes memorable moment");
  const [audio, setAudio] = useState(null);

  const storyRef = useRef(null);

  // Looping loader text
  const loaderMessages = [
    "Meaningful story makes memorable moment",
    "Bedtime story will never fail the children",
    "Worry no more with Magic Story",
  ];

  const handleGenerate = async () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    setLoading(true);
    setStory(null);

    let index = 0;
    const loaderInterval = setInterval(() => {
      setLoaderText(loaderMessages[index]);
      index = (index + 1) % loaderMessages.length;
    }, 5000);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });

      const data = await res.json();

      setStory(data);
      clearInterval(loaderInterval);
      setLoading(false);

      // Scroll to story
      setTimeout(() => {
        storyRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Create audio narration
      const utterance = new SpeechSynthesisUtterance(
        [data.title, ...data.paragraphs].join(". ")
      );
      utterance.lang = language === "English" ? "en-US" : language === "Bahasa" ? "id-ID" : "de-DE";
      utterance.rate = 1;
      const synth = window.speechSynthesis;
      synth.speak(utterance);
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
    <div style={{ fontFamily: "Helvetica Neue", padding: "20px", background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center" }}>Magic Story With AI</h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Generate fun and meaningful stories for kids!
      </p>

      {/* Fields container */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        background: "#fff",
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        borderRadius: "8px",
        gap: "20px",
        marginBottom: "20px"
      }}>
        <div style={{ flex: "1 1 45%" }}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>Animal</option>
            <option>Fruit</option>
            <option>Person</option>
            <option>Mix & Random</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Length</label>
          <select value={length} onChange={(e) => setLength(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>5-10 min</option>
            <option>10-15 min</option>
            <option>&gt;15 min</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>English</option>
            <option>Bahasa</option>
            <option>German</option>
          </select>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Moral</label>
          <select value={moral} onChange={(e) => setMoral(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>Kindness</option>
            <option>Friendship</option>
            <option>Honesty</option>
            <option>Patience</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 20px",
            background: "#ff7043",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
            cursor: "pointer",
            flex: "1 1 100%"
          }}
        >
          Generate Story
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div style={{ textAlign: "center", margin: "20px", fontSize: "18px", color: "#555" }}>
          {loaderText}
        </div>
      )}

      {/* Story result */}
      {story && (
        <div ref={storyRef} style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px"
        }}>
          <h2 style={{ fontWeight: "bold", textAlign: "center" }}>{story.title}</h2>
          {story.imageUrl && (
            <img
              src={story.imageUrl}
              alt="Story illustration"
              style={{ display: "block", margin: "10px auto", height: "250px", objectFit: "cover", borderRadius: "8px" }}
            />
          )}
          {story.paragraphs.map((p, i) => (
            <p key={i} style={{ textAlign: "center", lineHeight: "1.6", marginBottom: "15px" }}>{p}</p>
          ))}

          {/* Audio controls */}
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
