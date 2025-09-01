import { useState } from "react";

export default function Story({ data }) {
  const [speaking, setSpeaking] = useState(false);

  const playAudio = () => {
    if (!window.speechSynthesis) return alert("TTS not supported");
    window.speechSynthesis.cancel();

    const paragraphs = [data.title, ...data.content];
    const voices = window.speechSynthesis.getVoices();
    const humanVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices[0];

    paragraphs.forEach((p) => {
      const utter = new SpeechSynthesisUtterance(p + " ... "); // pause
      if (humanVoice) utter.voice = humanVoice;
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    });

    setSpeaking(true);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
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
            <img src={data.images[i]} alt={`Paragraph ${i + 1}`} style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "10px" }} />
          )}
        </div>
      ))}
    </div>
  );
}
