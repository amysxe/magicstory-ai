// pages/index.js
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10 min");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateStory = async () => {
    setLoading(true);
    setStory(""); // clear old story

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length }),
      });

      const data = await response.json();

      if (data.story) {
        setStory(data.story);
      } else {
        alert("Error: " + (data.error || "No story generated"));
      }
    } catch (err) {
      alert("Request failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fffdf8] text-[#333] font-serif">
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-[#444]">
          Magic Story with AI ✨
        </h1>

        {/* Form */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <label className="block mb-4">
            <span className="font-semibold">Choose a character category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 block w-full h-12 p-3 border rounded-md"
            >
              <option value="animal">Animal</option>
              <option value="fruit">Fruit</option>
              <option value="person">Person</option>
              <option value="mix">Mix</option>
              <option value="random">Random</option>
            </select>
          </label>

          <label className="block mb-4">
            <span className="font-semibold">Choose story length:</span>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="mt-2 block w-full h-12 p-3 border rounded-md"
            >
              <option value="5-10 min">5–10 min</option>
              <option value="10-15 min">10–15 min</option>
              <option value=">15 min">More than 15 min</option>
            </select>
          </label>

          <button
            onClick={handleGenerateStory}
            disabled={loading}
            className="w-full h-12 bg-[#f28c0f] hover:bg-[#e07a00] text-white font-bold px-6 rounded-lg transition-colors"
          >
            {loading ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {/* Story Output */}
        {story && (
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Your Story</h2>
            <p className="whitespace-pre-line leading-relaxed">{story}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f1ea] text-center py-4 border-t text-sm text-[#666]">
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
