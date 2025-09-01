import { useEffect, useRef, useState } from "react";

export default function Story({ data }) {
  const audioRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);

  const playAudio = () => {
    if (!window.speechSynthesis) return alert("TTS not supported");
    window.speechSynthesis.cancel(); // stop previous
    const utter = new SpeechSynthesisUtterance([data.title, ...data.content].join("\n"));
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
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
          <button onClick={playAudio} style={{ background: "#ffdace", color: "#ff7043", fontSize: "14px", padding: "8px 12px", borderRadius: "12px", marginRight: "10px" }}>
            🔊 Play with audio
          </button>
        ) : (
          <button onClick={stopAudio} style={{ background: "#ffdace", color: "#ff7043", fontSize: "14px", padding: "8px 12px", borderRadius: "12px", marginRight: "10px" }}>
            ⏹ Stop
          </button>
        )}
      </div>

      {data.content.map((p, i) => (
        <div key={i} style={{ margin: "15px 0", textAlign: "center" }}>
          <p style={{ margin: "10px 0", lineHeight: "1.6" }}>{p}</p>
          {data.images && data.images[i] && (
            <img src={data.images[i]} alt={`Paragraph ${i+1}`} style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "10px" }} />
          )}
        </div>
      ))}
    </div>
  );
}
