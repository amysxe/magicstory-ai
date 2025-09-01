import { useState, useRef, useEffect } from "react";

export default function Story({ data, language, onGenerateMore }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const storyRef = useRef(null);
  const utteranceRef = useRef(null);

  // Scroll to story on mount
  useEffect(() => {
    if (storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  // Play audio
  const playStory = () => {
    if (!data) return;
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support Text-to-Speech.");
      return;
    }

    // Cancel any existing speech
    window.speechSynthesis.cancel();
    setPaused(false);

    const utterance = new SpeechSynthesisUtterance(data.content);
    utterance.lang =
      language === "Bahasa"
        ? "id-ID"
        : language === "German"
        ? "de-DE"
        : "en-US";

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Pause / Resume / Stop
  const pauseStory = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const resumeStory = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };

  const stopStory = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  if (!data) return null;

  return (
    <div className="story-result" ref={storyRef}>
      <h2 className="story-title">{data.title}</h2>

      <div className="audio-controls">
        {!speaking && (
          <button onClick={playStory} className="button audio-button">
            🔊 Play with audio
          </button>
        )}
        {speaking && !paused && (
          <button onClick={pauseStory} className="button audio-button">
            ⏸ Pause
          </button>
        )}
        {paused && (
          <button onClick={resumeStory} className="button audio-button">
            ▶ Resume
          </button>
        )}
        {speaking && (
          <button onClick={stopStory} className="button audio-button">
            ⏹ Stop
          </button>
        )}
      </div>

      <div className="story-content">
        {data.content.split(/\n+/).map((para, idx) => (
          <p key={idx} className="story-paragraph">
            {para}
          </p>
        ))}
      </div>

      <div className="story-images">
        {data.images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Story illustration ${idx + 1}`}
            className="story-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/256x256?text=Image+not+found";
            }}
          />
        ))}
      </div>

      <div className="story-buttons">
        <button onClick={onGenerateMore} className="button">
          Find More Story
        </button>
      </div>

      <style jsx>{`
        .story-result {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }
        .story-title {
          font-size: 28px;
          margin-bottom: 12px;
          text-align: center;
          color: #4b2e2e;
        }
        .audio-controls {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .audio-button {
          padding: 10px 16px;
          font-size: 14px;
        }
        .story-content {
          font-size: 18px;
          line-height: 1.8;
          color: #333;
          margin-bottom: 30px;
        }
        .story-paragraph {
          margin-bottom: 16px;
        }
        .story-images {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
          justify-content: center;
        }
        .story-image {
          width: 240px;
          height: 240px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .story-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .button {
          padding: 14px;
          background: #ff7043;
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .button:hover {
          background: #f4511e;
        }
        @media (max-width: 600px) {
          .story-image {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}
