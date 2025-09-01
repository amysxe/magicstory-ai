import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10");
  const [story, setStory] = useState("");

  const handleGenerate = () => {
    const fakeStory = `Once upon a time, a brave ${category} went on an adventure. 
    The story lasted about ${length} minutes and was full of fun, laughter, and friendship!`;
    setStory(fakeStory);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>✨ MagicStory AI ✨</h1>
      <p>Create fun, personalized bedtime stories for kids!</p>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Choose Category:{" "}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="animal">Animal</option>
            <option value="fruit">Fruit</option>
            <option value="person">Person</option>
            <option value="mix">Mix</option>
            <option value="random">Random</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Story Length:{" "}
          <select value={length} onChange={(e) => setLength(e.target.value)}>
            <option value="5-10">5–10 min</option>
            <option value="10-15">10–15 min</option>
            <option value="15+">15+ min</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleGenerate}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Generate Story
      </button>

      {story && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <h2>Your Story:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}
