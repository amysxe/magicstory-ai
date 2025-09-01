import { useState, useRef, useEffect } from "react";

export default function Story({ data }) {
  if (!data) return null; // safety check

  const [playing, setPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState(null);
  const storyRef = useRef();

  // Stop audio when new story is generated
  useEffect(() => {
    return () => {
      if (audioObj) audioObj.pause();
    };
  }, [audioObj]);

  const handlePlayAudio = async () => {
    if (audioObj) audioObj.pause();
    setPlaying(true);
    try {
      const res = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      audio.play();
      setAudioObj(audio);
    } catch (err) {
      console.error(err);
      setPlaying(false);
      alert("Failed to play narration.");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToStory = () => storyRef.current.scrollIntoView({ behavior: "smooth" });

  return (
    <div ref={storyRef} style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>{data.title}</h2>

      <button
        onClick={handlePlayAudio}
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
        {data.content.split("\n").map((p, idx) => (
          <p key={idx} style={{ margin: "15px 0", lineHeight: "1.6", textAlign: "center" }}>
            {p}
          </p>
        ))}

        {data.images &&
          data.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Story image ${idx + 1}`}
              style={{ maxWidth: "100%", margin: "20px 0", borderRadius: "8px", display: "block", marginLeft: "auto", marginRight: "auto" }}
            />
          ))}
      </div>

      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#ffdace",
          color: "#ff7043",
          padding: "8px 20px",
          borderRadius: "12px",
          cursor: "pointer",
          width: "80px",
        }}
      >
        ⬆ Scroll to top
      </button>
    </div>
  );
}
