// src/utils/calculateReadTime.js

/**
 * Calculates estimated reading time for given text.
 * @param {string} text - The content of the blog post.
 * @param {number} wordsPerMinute - Average reading speed (default 200 WPM).
 * @returns {string} - Estimated reading time (e.g., "3 min read").
 */
export default function calculateReadTime(text, wordsPerMinute = 200) {
  if (!text || typeof text !== "string") return "0 min read";

  const words = text.trim().split(/\s+/).length; // Count words
  const minutes = Math.ceil(words / wordsPerMinute); // Round up to nearest minute

  return `${minutes} min read`;
}
