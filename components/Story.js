import { useState, useEffect } from "react";

export default function Story({ data }) {
  const [speaking, setSpeaking] = useState(false);
  const [audioElements, setAudioElements] = useState([]);

  // Play human-like TTS via OpenAI
  const playAudio = async () => {
    setSpeaking(true);
    // Stop previous audio
    audioElements.forEach(a => a.pause());
    const paragraphs = [data.title, ...data.content];
    const res = await fetch("/api/story-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paragraphs, language: "English" }),
    });
    const { audioUrls } = await res.json();
    const audios = audioUrls.map(url => new Audio(url));
    setAudioElements(audios);

    // Play sequentially
    for (let audio of audios) {
      await new Promise((resolve) => {
        audio.onended = resolve;
        audio.play();
      });
    }
    setSpeaking(false);
  };

  const stopAudio = () => {
    audioElements.forEach(a => a.pause());
    setSpeaking(false);
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
      <h2 id="story-title">{data.title}</h2>
      <div style={{ margin: "10px" }}>
        {!speaking ? (
          <button onClick={playAudio} style={{
            background: "#ffdace", color: "#ff7043", fontSize: "14px",
            padding: "8px 12px", borderRadius: "12px", marginBottom: "20px", border: "none", cursor: "pointer"
          }}>
            🔊 Play with audio
          </button>
        ) : (
          <button onClick={stopAudio} style={{
            background: "#ffdace", color: "#ff7043", fontSize: "14px",
            padding: "8px 12px", borderRadius: "12px", marginBottom: "20px", border: "none", cursor: "pointer"
          }}>
            ⏹ Stop
          </button>
        )}
      </div>

      {data.content.map((p, i) => (
        <div key={i} style={{ margin: "20px 0", textAlign: "center" }}>
          <p style={{ margin: "10px 0", lineHeight: "1.6" }}>{p}</p>
          {data.images && data.images[i] && (
            <img src={data.images[i]} alt={`Paragraph ${i+1}`} style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "10px" }} />
          )}
        </div>
      ))}
    </div>
  );
}
