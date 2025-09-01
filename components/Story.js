import { useState, useEffect } from "react";

export default function Story({ data }) {
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Stop previous audio when new story renders
    if (audio) {
      audio.pause();
      setPlaying(false);
    }
  }, [data]);

  const playAudio = async () => {
    if (audio) {
      audio.pause();
      setPlaying(false);
    }
    try {
      const res = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      newAudio.onended = () => setPlaying(false);
      newAudio.play();
      setAudio(newAudio);
      setPlaying(true);
    } catch (err) {
      console.error(err);
      alert("Failed to play audio");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2 id="story-title">{data.title}</h2>

      <button
        onClick={playAudio}
        style={{
          background: "#ffdace",
          color: "#ff7043",
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "14px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        🔊 Play with audio
      </button>

      <div style={{ marginTop: "20px" }}>
        {data.content.split("\n").map((p, i) => (
          <p key={i} style={{ margin: "15px 0", lineHeight: "1.6", textAlign: "center" }}>
            {p}
          </p>
        ))}
      </div>

      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "80px",
          background: "#ffdace",
          color: "#ff7043",
          padding: "8px 10px",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        ⬆ Top
      </button>
    </div>
  );
}
