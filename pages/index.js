// pages/index.js
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generateStory = async () => {
    setLoading(true);
    setErrorMsg("");
    setTitle("");
    setParagraphs([]);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Generation failed");
      }

      const raw = (data.story || "").trim();
      if (!raw) {
        throw new Error("Empty story returned");
      }

      // Extract first non-empty line as title
      const linesAll = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const extractedTitle = linesAll.length ? linesAll.shift() : "Untitled Story";

      // Remaining text -> paragraphs by double newline
      const remainingText = linesAll.join("\n");
      const paras = remainingText
        ? remainingText.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean)
        : [];

      setTitle(extractedTitle);
      setParagraphs(paras);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate story");
    } finally {
      setLoading(false);
    }
  };

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
        <header className="site-header">
          <div className="center">
            <h1 className="brand">Magic Story with AI ✨</h1>
            <p className="lead">Create gentle bedtime stories in English, Bahasa, or German.</p>
          </div>
        </header>

        <main className="main">
          <div className="center container">
            <section className="card form-card" aria-labelledby="form-heading">
              <h2 id="form-heading" className="sr-only">Story options</h2>

              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Category</label>
                  <select
                    className="field-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Category"
                  >
                    <option value="animal">Animal</option>
                    <option value="fruit">Fruit</option>
                    <option value="person">Person</option>
                    <option value="mix">Mix</option>
                    <option value="random">Random</option>
                  </select>
                </div>

                <div className="field">
                  <label className="field-label">Length</label>
                  <select
                    className="field-control"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    aria-label="Length"
                  >
                    <option value="5-10 min">5–10 min</option>
                    <option value="10-15 min">10–15 min</option>
                    <option value=">15 min">&gt; 15 min</option>
                  </select>
                </div>

                <div className="field">
                  <label className="field-label">Language</label>
                  <select
                    className="field-control"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    aria-label="Language"
                  >
                    <option value="English">English</option>
                    <option value="Bahasa">Bahasa</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn btn-primary"
                  onClick={generateStory}
                  disabled={loading}
                >
                  {loading ? "Generating…" : "Generate Story"}
                </button>
              </div>

              {errorMsg && <div className="error">{errorMsg}</div>}
            </section>

            {/* Story display */}
            {title && (
              <section className="card story-card" aria-live="polite">
                <h3 className="story-title">{title}</h3>

                <div className="story-body">
                  {paragraphs.length ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx}>
                        {p.split(/\r?\n/).map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < p.split(/\r?\n/).length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    ))
                  ) : (
                    <p className="muted">No story body returned.</p>
                  )}
                </div>

                <div className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={generateStory}
                    disabled={loading}
                  >
                    {loading ? "Generating…" : "Find More Story"}
                  </button>
                </div>
              </section>
            )}
          </div>
        </main>

        <footer className="site-footer">
          <div className="center">Copyright © 2025 by Laniakea Digital</div>
        </footer>
      </div>

      <style jsx>{`
        :root{
          --bg:#fffaf2;
          --card:#ffffff;
          --accent:#f28c0f;
          --accent-hover:#e07a00;
          --muted:#6d4c41;
          --text:#333333;
          --shadow: 0 6px 20px rgba(22,22,22,0.04);
        }

        /* layout */
        .site {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--text);
          font-family: "Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        .center { max-width: 880px; margin: 0 auto; padding: 0 20px; }

        .site-header {
          background: #fff6ef;
          border-bottom: 1px solid #f0e6e2;
          padding: 36px 0;
        }
        .brand {
          font-family: "Libre Baskerville", serif;
          font-size: 34px;
          color: #5d4037;
          margin: 0;
          text-align: center;
        }
        .lead {
          margin: 8px 0 0;
          color: var(--muted);
          text-align: center;
          font-size: 15px;
        }

        .main { flex: 1 0 auto; padding: 36px 0; padding-bottom: 60px; }

        .container { display: block; }

        /* card */
        .card {
          background: var(--card);
          border-radius: 14px;
          box-shadow: var(--shadow);
          border: 1px solid #eee;
          padding: 20px;
        }
        .form-card { margin-bottom: 20px; }

        /* form grid */
        .form-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 760px) {
          .form-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        .field { display: flex; flex-direction: column; }
        .field-label {
          font-weight: 600;
          color: #5d4037;
          margin-bottom: 8px;
          font-size: 14px;
        }

        /* uniform controls */
        .field-control {
          height: 48px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d8d8d8;
          background: #fffdf8;
          font-size: 15px;
          outline: none;
        }
        .field-control:focus {
          box-shadow: 0 0 0 5px rgba(242,140,15,0.07);
          border-color: var(--accent);
        }

        .actions { margin-top: 16px; display:flex; gap:12px; align-items:center; }
        .actions .btn { min-width: 160px; height: 48px; border-radius: 10px; font-weight:700; cursor:pointer; border: none; }

        .btn-primary {
          background: var(--accent);
          color: white;
          transition: background .12s ease;
        }
        .btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
        .btn-secondary {
          background: #8d6e63;
          color: white;
        }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .error { margin-top:12px; color:#b00020; font-weight:600; }

        /* story card */
        .story-card { margin-top: 18px; }
        .story-title {
          font-family: "Libre Baskerville", serif;
          font-size: 22px;
          color: #5d4037;
          margin: 0 0 12px 0;
          text-align: center;
        }
        .story-body p {
          margin: 0 0 16px 0;
          line-height: 1.8;
          color: #444;
          font-size: 16.5px;
        }
        .muted { color: #888; }

        /* footer pinned at bottom and fixed height 60px */
        .site-footer {
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

        /* accessibility */
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;}
      `}</style>
    </>
  );
}
