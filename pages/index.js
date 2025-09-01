import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [category, setCategory] = useState("Animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [moral, setMoral] = useState("Kindness");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState(
    "Meaningful story makes memorable moment"
  );
  const audioRef = useRef(null);
  const storyTitleRef = useRef(null);

  // Loader text rotation
  useEffect(() => {
    if (!loading) return;
    const texts = [
      "Meaningful story makes memorable moment",
      "Bedtime story will never fail the children",
      "Worry no more with Magic Story",
    ];
    let index = 0;
    const interval = setInterval(() => {
      setLoaderText(texts[index]);
      index = (index + 1) % texts.length;
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  const generateStory = async () => {
    // Stop any playing audio
    if (audioRef.current) {
      speechSynthesis.cancel();
      audioRef.current = null;
    }

    setStory(null);
    setLoading(true);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language, moral }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStory(data);
      setLoading(false);

      // Auto-scroll to story title
      setTimeout(() => {
        storyTitleRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to generate story. Please try again.");
    }
  };

  const speakStory = () => {
    if (!story) return;
    if (audioRef.current) speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(story.paragraphs.join(". "));
    utterance.lang =
      language === "English"
        ? "en-US"
        : language === "Bahasa"
        ? "id-ID"
        : "de-DE";
    speechSynthesis.speak(utterance);
    audioRef.current = utterance;
  };

  const pauseStory = () => speechSynthesis.pause();
  const resumeStory = () => speechSynthesis.resume();
  const stopStory = () => speechSynthesis.cancel();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div style={{ fontFamily: "Helvetica Neue", padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <title>Magic Story With AI</title>
      <h1>Magic Story With AI</h1>
      <p>Generate fun and meaningful stories for kids!</p>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 45%" }}>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Animal</option>
              <option>Fruit</option>
              <option>Person</option>
              <option>Mix & Random</option>
            </select>
          </div>
          <div style={{ flex: "1 1 45%" }}>
            <label>Length</label>
            <select value={length} onChange={(e) => setLength(e.target.value)}>
              <option>5-10 min</option>
              <option>10-15 min</option>
              <option>&gt;15 min</option>
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
              <option>Bravery</option>
              <option>Honesty</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateStory}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#ff7043",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Generate Story
        </button>
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            textAlign: "center",
            zIndex: 9999
          }}
        >
          {loaderText}
        </div>
      )}

      {story && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
          ref={storyTitleRef}
        >
          <h2 style={{ fontWeight: "bold", textAlign: "center" }}>{story.title}</h2>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <button
              onClick={speakStory}
              style={{
                backgroundColor: "#ffdace",
                color: "#ff7043",
                fontSize: "14px",
                padding: "5px 10px",
                borderRadius: "8px",
                marginRight: "5px",
              }}
            >
              🔊 Play with audio
            </button>
            <button onClick={pauseStory} style={{ marginRight: "5px" }}>⏸ Pause</button>
            <button onClick={resumeStory} style={{ marginRight: "5px" }}>▶ Resume</button>
            <button onClick={stopStory}>⏹ Stop</button>
          </div>
          {story.paragraphs.map((p, idx) => (
            <p key={idx} style={{ marginBottom: "15px", lineHeight: "1.6" }}>{p}</p>
          ))}
        </div>
      )}

      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "80px",
          padding: "5px 10px",
          borderRadius: "8px",
          backgroundColor: "#ffdace",
          color: "#ff7043",
          cursor: "pointer",
        }}
      >
        ⬆ Top
      </button>

      <footer style={{ textAlign: "center", marginTop: "60px" }}>
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
