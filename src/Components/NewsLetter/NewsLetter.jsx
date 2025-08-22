
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// ✅ Use backend URL from .env
const API_BASE = process.env.REACT_APP_BACKEND_URL || "";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "Something went wrong");
    } catch (err) {
      console.error("Subscribe error:", err);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
      setEmail(""); // clear input
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
      <p className="text-blue-100 text-sm mb-4">
        Get the latest articles delivered to your inbox weekly.
      </p>

      <div className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/20 border-white/30 text-white placeholder-white/70 rounded-xl 
                     focus:bg-white/30 focus:ring-2 focus:ring-white/50"
        />

        <Button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold 
                     transition-all duration-200 hover:scale-105 disabled:opacity-70"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>

        {message && (
          <p className="text-sm mt-2 text-center text-white/90">{message}</p>
        )}
      </div>
    </section>
  );
}
