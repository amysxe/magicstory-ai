import { useState } from "react";

export default function Home() {
  const [story, setStory] = useState("");

  const generateStory = () => {
    // placeholder story (later you can replace with AI API call)
    setStory("Once upon a time, a brave orange and a clever cat went on an adventure...");
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>✨ MagicStory AI ✨</h1>
      <p>Create fun short stories for your kids with one click.</p>

      <button
        onClick={generateStory}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          background: "purple",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Generate Story
      </button>

      {story && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd" }}>
          <h2>Your Story</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}
