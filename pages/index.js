// pages/index.js
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10 min");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateStory = async () => {
    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Generation failed");
      }

      // data.story expected as plain text
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setStory("Sorry — something went wrong. Please check server logs.");
    } finally {
      setLoading(false);
    }
  };

  // split story into paragraphs (double newlines) and keep single-newline as <br/>
  const paragraphs = story
    ? story
        .split(/\r?\n\s*\r?\n/) // split on empty line(s)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <Head>
        <title>Magic Story with AI</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="site">
        <main className="main">
          <div className="container">
            <h1 className="title">Magic Story with AI ✨</h1>
            <p className="subtitle">Personalized bedtime stories with gentle illustrations (coming soon).</p>

            <div className="card controls">
              <label className="field">
                <span className="label">Choose a character category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select"
                >
                  <option value="animal">Animal</option>
                  <option value="fruit">Fruit</option>
                  <option value="person">Person</option>
                  <option value="mix">Mix</option>
                  <option value="random">Random</option>
                </select>
              </label>

              <label className="field">
                <span className="label">Choose story length</span>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="select"
                >
                  <option value="5-10 min">5–10 min</option>
                  <option value="10-15 min">10–15 min</option>
                  <option value=">15 min">More than 15 min</option>
                </select>
              </label>

              <button
                onClick={handleGenerateStory}
                className="cta"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Generating…" : "Generate Story"}
              </button>
            </div>

            {story && (
              <div className="card story">
                <h2 className="story-title">Your Story</h2>
                <div className="story-content" aria-live="polite">
                  {paragraphs.map((p, i) => (
                    <p key={i}>
                      {p.split(/\r?\n/).map((line, j) => (
                        // keep single newline as <br/>
                        <span key={j}>
                          {line}
                          {j < p.split(/\r?\n/).length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="footer">
          Copyright © 2025 by Laniakea Digital
        </footer>
      </div>

      <style jsx>{`
        /* Layout */
        .site {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fffaf2;
          color: #333;
          font-family: "Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        .main {
          flex: 1 0 auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px;
          /* reserve space so content won't touch footer (60px) */
          padding-bottom: 60px;
        }
        .container {
          width: 100%;
          max-width: 880px;
        }

        /* Typography */
        .title {
          font-family: "Libre Baskerville", serif;
          font-size: 36px;
          color: #5d4037;
          text-align: center;
          margin: 0 0 8px 0;
        }
        .subtitle {
          text-align: center;
          color: #6d4c41;
          margin: 0 0 24px 0;
          font-weight: 400;
        }

        /* Card */
        .card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(22, 22, 22, 0.04);
          padding: 20px;
          border: 1px solid #eee;
        }

        .controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: end;
        }

        /* Labels & fields */
        .field {
          display: flex;
          flex-direction: column;
        }
        .label {
          font-weight: 600;
          color: #5d4037;
          margin-bottom: 8px;
          font-size: 14px;
        }

        /* Uniform field height: selects and button */
        .select {
          height: 48px; /* uniform height */
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d8d8d8;
          background: #fffdf8;
          font-size: 15px;
          outline: none;
        }
        .select:focus {
          box-shadow: 0 0 0 4px rgba(242, 140, 15, 0.08);
          border-color: #f28c0f;
        }

        .cta {
          height: 48px; /* same height */
          background: #f28c0f;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 15px;
          padding: 0 18px;
          transition: background 160ms ease;
        }
        .cta:hover:not(:disabled) {
          background: #e07a00;
        }
        .cta:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* make button span both columns on wide screens */
        @media (min-width: 720px) {
          .controls .cta {
            grid-column: 1 / 3;
          }
        }
        @media (max-width: 719px) {
          .controls {
            grid-template-columns: 1fr;
          }
        }

        /* Story box */
        .story {
          margin-top: 20px;
        }
        .story-title {
          font-family: "Libre Baskerville", serif;
          color: #5d4037;
          margin: 0 0 12px 0;
        }
        .story-content p {
          margin: 0 0 16px 0;
          line-height: 1.7;
          color: #444;
          font-size: 17px;
        }

        /* Footer pinned to bottom, 60px reserved by main padding */
        .footer {
          height: 60px;
          flex-shrink: 0;
          background: #f5f1ea;
          border-top: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
