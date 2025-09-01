// pages/index.js
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async (isNew = false) => {
    setLoading(true);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language })
      });

      const data = await response.json();

      if (data.story) {
        const lines = data.story.split("\n").filter(l => l.trim() !== "");
        setTitle(lines[0]);
        setStory(lines.slice(1).join("\n\n"));
      } else {
        alert("Error: " + (data.error || "No story generated"));
      }
    } catch (err) {
      alert("Request failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-serif bg-[#fdfcf9] text-gray-800">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-[#333333] mb-8">
          Magic Story with AI
        </h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <label className="block mb-4">
            <span className="font-semibold">Select Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
            >
              <option value="animal">Animal</option>
              <option value="fruit">Fruit</option>
              <option value="person">Person</option>
              <option value="mix">Mix</option>
              <option value="random">Random</option>
            </select>
          </label>

          <label className="block mb-4">
            <span className="font-semibold">Select Length</span>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
            >
              <option value="5-10">5 - 10 minutes</option>
              <option value="10-15">10 - 15 minutes</option>
              <option value="15+">More than 15 minutes</option>
            </select>
          </label>

          <label className="block mb-6">
            <span className="font-semibold">Select Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
            >
              <option value="English">English</option>
              <option value="Bahasa">Bahasa</option>
              <option value="German">German</option>
            </select>
          </label>

          <button
            onClick={() => generateStory()}
            disabled={loading}
            className="w-full bg-[#ff6f61] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#e65b50] transition"
          >
            {loading ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {/* Story Output */}
        {title && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#333333]">
              {title}
            </h2>
            <div className="whitespace-pre-line text-lg leading-relaxed text-gray-700 mb-6">
              {story}
            </div>
            <button
              onClick={() => generateStory(true)}
              disabled={loading}
              className="w-full bg-[#ff6f61] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#e65b50] transition"
            >
              {loading ? "Generating..." : "Find More Story"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 mt-16 mb-[60px]">
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
