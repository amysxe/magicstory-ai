import { useEffect, useRef, useState } from "react";

export default function Story({ data, onGenerateMore, stopAudio, setAudioUtterance }) {
  const storyRef = useRef();
  const [playing, setPlaying] = useState(false);

  const paragraphs = data.content
    .split("\n")
    .filter((p) => p.trim() !== "")
    .slice(0, 5);

  useEffect(() => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handlePlayAudio = async () => {
    stopAudio();
    try {
      setPlaying(true);
      const res = await fetch("/api/story-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content }),
      });
      if (!res.ok) throw new Error("Failed to generate audio");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      audio.play();
      setAudioUtterance(audio);
    } catch (err) {
      console.error(err);
      setPlaying(false);
      alert("Failed to play narration.");
    }
  };

  const handleStopAudio = () => {
    stopAudio();
    setPlaying(false);
  };

  return (
    <div ref={storyRef} className="story-container">
      <h2>{data.title}</h2>

      <div className="audio-controls">
        {!playing ? (
          <button className="play-audio-btn" onClick={handlePlayAudio}>
            🔊 Play with audio
          </button>
        ) : (
          <button className="play-audio-btn" onClick={handleStopAudio}>
            ⏹ Stop
          </button>
        )}
      </div>

      {paragraphs.map((p, i) => (
        <div key={i} className="story-paragraph">
          <p>{p}</p>
        </div>
      ))}

      <button className="generate-more" onClick={onGenerateMore}>
        Find More Story
      </button>

      <style jsx>{`
        .story-container {
          margin-top: 30px;
          text-align: center;
          font-family: "Helvetica Neue", sans-serif;
        }
        h2 {
          font-size: 28px;
          margin-bottom: 12px;
        }
        .story-paragraph {
          margin-bottom: 20px;
        }
        .story-paragraph p {
          line-height: 1.6;
          margin-top: 8px;
          text-align: center;
        }
        .audio-controls {
          margin-bottom: 15px;
        }
        .play-audio-btn {
          background: #ffdace;
          color: #ff7043;
          font-size: 14px;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.3s;
        }
        .play-audio-btn:hover {
          background: #ffcfb8;
        }
        .generate-more {
          margin-top: 20px;
          padding: 12px 16px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          background: #ff7043;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }
        .generate-more:hover {
          background: #f4511e;
        }
        @media (max-width: 600px) {
          .story-container {
            font-size: 16px;
          }
          .play-audio-btn {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
