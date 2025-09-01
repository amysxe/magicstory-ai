import { useState, useRef } from "react";

export default function Story({ data }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const playAudio = async () => {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(true);

    try {
      const res = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: [data.title, ...data.content].join("\n") })
      });
      const { audio } = await res.json();

      const audioBlob = new Blob([audio], { type: "audio/mp3" });
      const audioURL = URL.createObjectURL(audioBlob);

      const audioEl = new Audio(audioURL);
      audioRef.current = audioEl;
      audioEl.play();
      audioEl.onended = () => setPlaying(false);

    } catch (err) {
      console.error(err);
      alert("Failed to play audio");
      setPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
  };

  return (
    <div style={{ textAlign: "center", maxWidth: "900px", margin: "30px auto" }}>
      <h2>{data.title}</h2>
      {data.image && <img src={data.image} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px", margin: "20px 0" }} />}
      
      <div style={{ margin: "10px" }}>
        {!playing ? (
          <button onClick={playAudio} style={{ background: "#ffdace", color: "#ff7043", fontSize: "14px", padding: "8px 12px", borderRadius: "12px", border: "none", cursor: "pointer" }}>
            🔊 Play with audio
          </button>
        ) : (
          <button onClick={stopAudio} style={{ background: "#ffdace", color: "#ff7043", fontSize: "14px", padding: "8px 12px", borderRadius: "12px", border: "none", cursor: "pointer" }}>
            ⏹ Stop
          </button>
        )}
      </div>

      {data.content.map((p, i) => <p key={i} style={{ margin: "20px 0", lineHeight: "1.6" }}>{p}</p>)}
    </div>
  );
}
