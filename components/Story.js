import { useState, useRef } from "react";

export default function Story({ data }) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const audioRef = useRef(null);

  const playAudio = async () => {
    if (audioRef.current && paused) {
      audioRef.current.play();
      setPaused(false);
      return;
    }

    if (audioRef.current) audioRef.current.pause();
    setPlaying(true);

    try {
      const res = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [data.title, ...data.content].join("\n"),
          language: data.language
        })
      });

      const { audio } = await res.json();

      const audioURL = `data:audio/mp3;base64,${audio}`;
      const audioEl = new Audio(audioURL);
      audioRef.current = audioEl;
      audioEl.play();
      audioEl.onended = () => {
        setPlaying(false);
        setPaused(false);
      };
    } catch (err) {
      console.error(err);
      alert("Failed to play audio");
      setPlaying(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPaused(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      setPaused(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        textAlign: "center",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "Helvetica Neue"
      }}
    >
      <h2 id="story-title">{data.title}</h2>

      {data.image && (
        <img
          src={data.image}
          alt="Story title image"
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
            borderRadius: "12px",
            margin: "20px 0"
          }}
        />
      )}

      <div style={{ margin: "10px" }}>
        {!playing ? (
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
        <p
          key={i}
          style={{
            margin: "20px 0",
            lineHeight: "1.6",
            textAlign: "center"
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
