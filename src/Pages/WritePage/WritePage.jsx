"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Upload, X, Tag, FileText, ImageIcon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import ReactMarkdown from "react-markdown";
import "react-quill/dist/quill.snow.css";

export default function WritePage() {
  const navigate = useNavigate();

  // Core state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  // Two editing modes
  const [activeTab, setActiveTab] = useState("markdown"); // 'markdown' | 'rich'
  const [markdownContent, setMarkdownContent] = useState("");
  const [richContent, setRichContent] = useState(""); // Quill (HTML)

  // App state
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false); // includes AI generation + submit
  const [aiLoading, setAiLoading] = useState(false); // specifically for AI stream loader
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [notLoggedInMsg, setNotLoggedInMsg] = useState(null);

  const API_URL = "http://localhost:5000/api/blogs";
  const AI_URL = "http://localhost:5000/api/ai/stream-blog";
  const token = localStorage.getItem("authToken");

  // Quill toolbar configuration
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      setNotLoggedInMsg("You must be logged in to write an article.");
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  // Image upload handlers
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setCoverImage(e.target?.result);
    reader.readAsDataURL(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageUpload(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const removeCoverImage = () => setCoverImage(null);

  // Minimal Markdown → HTML (basic) so you don't need extra deps
  // Handles headings (#, ##, ###), **bold**, *italic*, bullet lists (- ), paragraphs, and links [text](url)
  const markdownToHtml = (md) => {
    if (!md) return "";

    let html = md;

    // Escape <
    html = html.replace(/</g, "&lt;");

    // Headings
    html = html
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

    // Italic *text*
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

    // Links [text](url)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Unordered lists: lines starting with "- "
    // Convert groups of "- ..." into <ul><li>...</li></ul>
    html = html.replace(
      /(^|\n)- (.*(?:\n(?!\n|- ).+)*)/gim,
      (match) => {
        // Wrap each "- item" line into <li>
        const items = match
          .trim()
          .split("\n")
          .map((line) => line.replace(/^- (.*)/, "<li>$1</li>"))
          .join("");
        return `<ul>${items}</ul>`;
      }
    );

    // New paragraphs for plain lines (that are not inside tags)
    html = html
      .split("\n")
      .map((line) => {
        if (
          !line.trim() ||
          /^<\/?(h1|h2|h3|ul|li|strong|em|a)/.test(line.trim())
        ) {
          return line;
        }
        return `<p>${line}</p>`;
      })
      .join("\n");

    return html;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!category) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }
    if (!coverImage) {
      setError("Please add a cover image.");
      setLoading(false);
      return;
    }

    // Use Markdown content by default (better for portability),
    // or switch to richContent if Rich Text tab is active.
    const finalContent = activeTab === "rich" ? richContent : markdownContent;

    const blogData = {
      title,
      content: finalContent,
      category: category || "Other",
      image: coverImage,
      format: activeTab, // 'markdown' or 'rich' (optional, in case backend wants to know)
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create blog");
      }

      await response.json();
      setSuccessMsg("Blog created successfully!");
      setTitle("");
      setMarkdownContent("");
      setRichContent("");
      setCategory("");
      setCoverImage(null);
      setActiveTab("markdown");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // AI streaming → fills Markdown editor
  const handleAIGenerate = () => {
    if (!title) {
      setError("Please enter a title before generating with AI.");
      return;
    }

    setAiLoading(true);
    setLoading(true); // lock buttons too
    setError(null);
    setActiveTab("markdown");
    setMarkdownContent(""); // clear old content

    const params = new URLSearchParams({ title });
    const eventSource = new EventSource(`${AI_URL}?${params.toString()}`);

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setAiLoading(false);
        setLoading(false);
        return;
      }
      try {
        const chunk = JSON.parse(event.data);
        setMarkdownContent((prev) => prev + chunk);
      } catch (err) {
        console.error("Error parsing chunk:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      setError("Failed to generate content. Please try again.");
      setAiLoading(false);
      setLoading(false);
      eventSource.close();
    };
  };

  // Copy/convert Markdown → Quill (basic)
  const copyMarkdownToQuill = () => {
    const html = markdownToHtml(markdownContent);
    setRichContent(html || "");
    setActiveTab("rich");
  };

  // Not logged in view
  if (!token) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        {notLoggedInMsg && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
            {notLoggedInMsg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Write New Article
          </h1>
          <p className="text-gray-600 text-lg">Share your thoughts with the world</p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{error}</div>
            )}
            {successMsg && (
              <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
                {successMsg}
              </div>
            )}

            {/* Title */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="flex items-center text-lg font-semibold text-gray-800 gap-2"
              >
                <FileText className="w-5 h-5 text-gray-600" />
                Article Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your article title..."
                required
                className="w-full px-6 py-4 text-xl font-medium bg-white/60 border rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-800 gap-2">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                Cover Image
              </label>

              {coverImage ? (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-2xl bg-white/60 border">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer ${
                    isDragging
                      ? "border-blue-500/50 bg-blue-50/50"
                      : "border-gray-300/50 bg-white/40"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your cover image here
                  </p>
                  <p className="text-gray-500">or click to browse files</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-lg font-semibold text-gray-800 gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Content
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={!title || loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow hover:from-green-600 hover:to-blue-600 disabled:opacity-50 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    {aiLoading ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 rounded-xl p-1 bg-white/60 border shadow-inner w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab("markdown")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "markdown"
                      ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow"
                      : "text-gray-700 hover:bg-white"
                  }`}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("rich")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "rich"
                      ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow"
                      : "text-gray-700 hover:bg-white"
                  }`}
                >
                  Rich Text
                </button>
              </div>

              {/* Markdown Editor + Preview */}
              {activeTab === "markdown" && (
                <>
                  <textarea
                    id="markdown"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder="Write in Markdown…"
                    rows={12}
                    className="w-full px-6 py-4 text-base leading-relaxed bg-white/60 border rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-y"
                  />

                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
                    <button
                      type="button"
                      onClick={copyMarkdownToQuill}
                      className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white/70 border hover:bg-white transition"
                    >
                      Use in Rich Editor
                    </button>
                  </div>

                  <div className="relative">
                    {/* Loader overlay while AI streaming */}
                    {aiLoading && (
                      <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="animate-pulse text-gray-700 font-medium">
                          Generating content…
                        </div>
                      </div>
                    )}
                    <div className="prose max-w-none bg-white/60 p-6 rounded-2xl shadow-inner border">
                      {markdownContent.trim() ? (
                        <ReactMarkdown>{markdownContent}</ReactMarkdown>
                      ) : (
                        <p className="text-gray-500">Nothing to preview yet.</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Rich Text (Quill) */}
              {activeTab === "rich" && (
                <div className="relative">
                  <ReactQuill
                    value={richContent}
                    onChange={setRichContent}
                    modules={quillModules}
                    theme="snow"
                    className="
                      bg-white/60 rounded-2xl border shadow-inner
                      [&_.ql-toolbar]:!rounded-t-2xl
                      [&_.ql-toolbar]:!border-0
                      [&_.ql-toolbar]:!bg-white/80
                      [&_.ql-container]:!border-0
                      [&_.ql-container]:!bg-white/60
                      [&_.ql-editor]:min-h-[300px]
                      focus-within:ring-4 focus-within:ring-blue-500/20
                    "
                  />
                  {/* Hint for converting from Markdown if needed */}
                  {!richContent && markdownContent && (
                    <div className="mt-2 text-sm text-gray-500">
                      Tip: Click <span className="font-medium">“Use in Rich Editor”</span> on the Markdown tab to copy/convert your Markdown here.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label
                htmlFor="category"
                className="flex items-center text-base font-semibold text-gray-800 gap-2"
              >
                <Tag className="w-5 h-5 text-gray-600" />
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm bg-white/60 border rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-500">
                Choose one category — required by the backend schema
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                className="flex-1 px-8 py-4 text-gray-700 font-semibold bg-white/60 border rounded-2xl shadow-lg hover:bg-white/80"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? "Working…" : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Subtle Quill theme polish (optional) */}
      <style>{`
        .ql-toolbar.ql-snow .ql-picker-label,
        .ql-toolbar.ql-snow .ql-stroke {
          color: #374151;
          stroke: #374151;
        }
        .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
          color: #111827;
        }
        .ql-snow .ql-tooltip {
          border-radius: 0.75rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
      `}</style>
    </div>
  );
}
