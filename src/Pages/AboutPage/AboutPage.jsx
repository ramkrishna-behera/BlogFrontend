// src/pages/AboutPage.jsx
import { useState } from "react";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";

export default function AboutPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated AI answer — in real app, call your backend AI endpoint
  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      // Replace this with actual AI API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnswer(
        `🤖 Here's what I know: This platform was built to make your experience smooth, secure, and delightful. Your question was "${question}".`
      );
    } catch (err) {
      setAnswer("❌ Something went wrong while fetching AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-800">About Us</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Welcome to our platform — a place where technology meets simplicity.
            Crafted with care, inspired by modern design, and powered by cutting-edge tools.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Our mission is to make complex things simple. We blend innovation with 
            aesthetics to provide an intuitive and engaging experience for all users.
          </p>
          <p>
            Every feature you see here was built with performance, security, and
            scalability in mind — so you can focus on what matters most.
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
