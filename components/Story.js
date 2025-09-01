import { useEffect, useRef, useState } from "react";

export default function Story({ data, onGenerateMore }) {
  const storyRef = useRef();
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const paragraphs = data.content
    .split("\n")
    .filter((p) => p.trim() !== "")
    .slice(0, 5); // limit to 5 paragraphs for credit

  // Auto-scroll to story
  useEffect(() => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // Generate AI images
  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      try {
        const res = await fetch("/api/story-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paragraphs }),
        });
        const imgs = await res.json();
        setImages(imgs);
      } catch (err) {
        console.error("Failed to generate images", err);
      } finally {
        setLoadingImages(false);
      }
    };
    fetchImages();
  }, [data]);

  const handlePlayAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      setAudio(null);
    } else {
      const utterance = new SpeechSynthesisUtterance(data.content);
      utterance.lang = "en-US"; // change based on selected language if needed
      utterance.onend = () => setPlaying(false);
      window.speechSynthesis.speak(utterance);
      setAudio(utterance);
      setPlaying(true);
    }
  };

  const handleStopAudio = () => {
    if (audio) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      setAudio(null);
    }
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

      {loadingImages && <p>Loading images...</p>}

      {paragraphs.map((p, i) => (
        <div key={i} className="story-paragraph">
          {images[i] && <img src={images[i]} alt="Story illustration" />}
          <p>{p}</p>
        </div>
      ))}

      <button className="generate-more" onClick={onGenerateMore}>
        Find More Story
      </button>

      <style jsx>{`
        .story-container {
          margin-top: 30px;
          text-align: left;
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
        }
        .story-paragraph img {
          max-width: 100%;
          border-radius: 8px;
          margin-bottom: 8px;
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
