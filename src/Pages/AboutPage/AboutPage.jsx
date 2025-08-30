// src/pages/AboutPage.jsx
import { useState } from "react";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";

export default function AboutPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Call backend (dummy for now)
  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      // 🔹 Dummy request to backend
      const res = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      // 🔹 Temporary mock response (since backend not ready)
      if (!res.ok) {
        throw new Error("Backend not responding");
      }

      const data = await res.json();
      setAnswer(data.answer || "🤖 AI is still warming up... (dummy response).");
    } catch (err) {
      console.error(err);
      setAnswer("❌ Could not fetch AI response. Backend might be offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-800">About Us</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Welcome to our platform — a place where technology meets simplicity.
            Crafted with care, inspired by modern design, and powered by
            cutting-edge tools.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-800">About the Blog App</h2>
          <p>
            This blog platform was built to create a space where readers and
            writers can share ideas, stories, and knowledge seamlessly. Designed
            with simplicity in mind, it provides a clean and intuitive
            experience while ensuring performance, security, and scalability.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">About Me</h2>
          <p>
            Hi, I’m <span className="font-medium">Ram Krishna Behera</span>, a
            B.Tech graduate in Computer Science from BPUT, Odisha. I am a
            software developer passionate about building user-friendly, reliable,
            and scalable web applications. My expertise lies in the{" "}
            <span className="font-medium">MERN stack</span>, with experience as a
            Front-End Developer.
          </p>
        </div>

        {/* AI Assistant Section */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <h2 className="text-xl font-medium text-gray-800 text-center">
            Ask Our AI Anything About Us
          </h2>
          <form onSubmit={handleAskAI} className="space-y-4">
            <Input
              type="text"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-12 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:bg-white focus:border-blue-500 transition-all"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </Button>
          </form>

          {answer && (
            <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">
              {answer}
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}
