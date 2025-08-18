"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Heart, Eye } from "lucide-react";

/**
 * BlogCard - clickable card for each blog post
 * Props:
 *  - post: blog object
 */
export default function BlogCard({ post }) {
  return (
    <Link to={`/post/${post._id}`} className="group">
      <article className="group cursor-pointer bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
        <div className="relative overflow-hidden h-48">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col h-full">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h4>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
            {post.content}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">{post.author?.name || "Unknown"}</span>
            <div className="flex items-center space-x-2">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />{" "}
                {Math.round((Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24)) <= 7
                  ? "New"
                  : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs mt-4 text-gray-600">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" /> {post.likes || 0}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" /> {post.views || 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
