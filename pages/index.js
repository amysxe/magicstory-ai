import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10");
  const [story, setStory] = useState("");

  const handleGenerate = () => {
    setStory(
      `Once upon a time, a brave ${category} went on an adventure. It lasted about ${length} minutes and was full of fun, friendship, and magic!`
    );
  };

  return (
    <>
      <Head>
        <title>MagicStory AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Head>
      <div className="container">
        <h1>MagicStory AI</h1>
        <p className="subtitle">Create personalized bedtime stories for kids.</p>

        <div className="controls">
          <div>
            <label>Category:
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="animal">Animal</option>
                <option value="fruit">Fruit</option>
                <option value="person">Person</option>
                <option value="mix">Mix</option>
                <option value="random">Random</option>
              </select>
            </label>
          </div>
          <div>
            <label>Length:
              <select value={length} onChange={(e) => setLength(e.target.value)}>
                <option value="5-10">5–10 min</option>
                <option value="10-15">10–15 min</option>
                <option value="15+">15+ min</option>
              </select>
            </label>
          </div>
          <button onClick={handleGenerate}>Generate Story</button>
        </div>

        {story && (
          <div className="story-box">
            <h2>Your Story</h2>
            <p>{story}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #fffaf2;
          border-radius: 12px;
          font-family: 'Open Sans', sans-serif;
        }
        h1 {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.4rem;
          color: #5d4037;
          margin-bottom: 0.2rem;
        }
        .subtitle {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: #6d4c41;
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        label {
          font-weight: 600;
          color: #5d4037;
        }
        select {
          margin-left: 0.5rem;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        button {
          padding: 0.6rem 1.2rem;
          background-color: #8d6e63;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background-color: #795548;
        }
        .story-box {
          background: #fff;
          padding: 1.2rem;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
        }
        .story-box h2 {
          font-family: 'Libre Baskerville', serif;
          margin-bottom: 0.6rem;
          color: #5d4037;
        }
        .story-box p {
          line-height: 1.6;
          color: #444;
        }
      `}</style>
    </>
  );
}
