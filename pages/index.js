// pages/index.js
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("animal");
  const [length, setLength] = useState("5-10 min");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, language }),
      });

      const data = await res.json();
      if (data.story) {
        setStory(data.story);
      } else {
        setStory("Something went wrong. Please try again.");
      }
    } catch (err) {
      setStory("Error generating story.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#333] font-serif">
      {/* Header */}
      <header className="bg-[#ffefef] shadow-md py-6 text-center">
        <h1 className="text-4xl font-bold text-[#444]">Magic Story with AI</h1>
        <p className="mt-2 text-lg text-[#666]">
          Create bedtime stories with characters your kids love
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto max-w-3xl p-6">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Category */}
            <div>
              <label className="block font-semibold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg p-3"
              >
                <option value="fruit">Fruit</option>
                <option value="animal">Animal</option>
                <option value="person">Person</option>
                <option value="mix">Mix</option>
                <option value="random">Random</option>
              </select>
            </div>

            {/* Length */}
            <div>
              <label className="block font-semibold mb-2">Story Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full border rounded-lg p-3"
              >
                <option value="5-10 min">5–10 min</option>
                <option value="10-15 min">10–15 min</option>
                <option value=">15 min">&gt; 15 min</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block font-semibold mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border rounded-lg p-3"
              >
                <option value="English">English</option>
                <option value="Bahasa">Bahasa</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateStory}
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {loading ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {/* Story Result */}
        {story && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#444]">
              {story.split("\n")[0]}
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-lg text-[#555]">
              {story.split("\n").slice(1).join("\n")}
            </p>

            <div className="mt-6 text-center">
              <button
                onClick={generateStory}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
              >
                {loading ? "Generating..." : "Find More Story"}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#ffefef] text-center text-[#666] text-sm py-4 mt-auto">
        Copyright &copy; 2025 by Laniakea Digital
      </footer>
    </div>
  );
}
