import { useState, useRef } from "react";

export default function Story({ data }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  const playAudio = () => {
    if (!synthRef.current) return alert("TTS not supported");
    if (speaking && paused) {
      synthRef.current.resume();
      setPaused(false);
      return;
    }
    synthRef.current.cancel();
    setSpeaking(true);

    const paragraphs = [data.title, ...data.content];
    const voices = synthRef.current.getVoices();
    const humanVoice =
      voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) ||
      voices[0];

    paragraphs.forEach((p) => {
      const utter = new SpeechSynthesisUtterance(p + " ... ");
      if (humanVoice) utter.voice = humanVoice;
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onend = () => setSpeaking(false);
      synthRef.current.speak(utter);
    });
  };

  const pauseAudio = () => {
    synthRef.current.pause();
    setPaused(true);
  };

  const stopAudio = () => {
    synthRef.current.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
      <h2 id="story-title">{data.title}</h2>

      {data.image && (
        <img
          src={data.image}
          alt="Story title image"
          style={{
            width: "100%",
            height: "250px", // fixed height
            objectFit: "cover",
            borderRadius: "12px",
            margin: "20px 0"
          }}
        />
      )}

      <div style={{ margin: "10px" }}>
        {!speaking ? (
          <button
            onClick={playAudio}
            style={{
              background: "#ffdace",
              color: "#ff7043",
              fontSize: "14px",
              padding: "8px 12px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔊 Play with audio
          </button>
        ) : (
          <>
            <button
              onClick={pauseAudio}
              style={{
                background: "#ffdace",
                color: "#ff7043",
                fontSize: "14px",
                padding: "8px 12px",
                borderRadius: "12px",
                marginRight: "10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              ⏸ Pause
            </button>
            <button
              onClick={stopAudio}
              style={{
                background: "#ffdace",
                color: "#ff7043",
                fontSize: "14px",
                padding: "8px 12px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer"
              }}
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>

      {data.content.map((p, i) => (
        <p key={i} style={{ margin: "20px 0", lineHeight: "1.6" }}>
          {p}
        </p>
      ))}
    </div>
  );
}
