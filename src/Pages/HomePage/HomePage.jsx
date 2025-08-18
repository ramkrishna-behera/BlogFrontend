"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Eye, TrendingUp } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import BlogCard from "../../Components/BlogCard/BlogCard";

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs/")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);

        // Featured article
        const featured = data.find((b) => b._id === "689a03ad2a07ad189d6586db");
        setFeaturedArticle(featured);

        // Popular posts (top 4 by views)
        const popular = [...data]
          .sort((a, b) => b.views - a.views)
          .slice(0, 4);
        setPopularPosts(popular);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const trendingTopics = [
    { name: "AI Design", posts: 24 },
    { name: "Sustainability", posts: 18 },
    { name: "Remote Work", posts: 15 },
    { name: "Web3", posts: 12 },
    { name: "Minimalism", posts: 9 },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            {featuredArticle && (
              <section className="mb-16">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <div className="absolute inset-0">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="object-cover w-full h-full opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  <div className="relative p-8 sm:p-12 lg:p-16">
                    <div className="max-w-3xl">
                      <div className="flex items-center space-x-4 mb-6">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                          {featuredArticle.category}
                        </span>
                        <span className="text-white/80 text-sm">Featured Article</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-xl text-white/90 mb-8 leading-relaxed">
                        {featuredArticle.content}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4 text-white/80">
                          <span className="font-medium">{featuredArticle.author?.name}</span>
                          <span>•</span>
                          <span>{new Date(featuredArticle.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {featuredArticle.readTime || "Read"}
                          </span>
                        </div>

                        <Link to={`/post/${featuredArticle._id}`}>
                          <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                            Read Article
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Latest Posts Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
                <Link to="/explore">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {blogs.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Popular Posts */}
            <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Popular Posts
              </h3>
              <div className="space-y-2">
                {popularPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="group cursor-pointer p-3 rounded-xl hover:bg-gray-100/50 transition-colors duration-200 block h-[90px] flex flex-col justify-center"
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views} views
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime || "Read"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>


            {/* Trending Topics */}
            <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer flex items-center justify-between p-3 rounded-xl hover:bg-gray-100/50 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors duration-200">
                      #{topic.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {topic.posts} posts
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
              <p className="text-blue-100 text-sm mb-4">Get the latest articles delivered to your inbox weekly.</p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/20 border-white/30 text-white placeholder-white/70 rounded-xl focus:bg-white/30 focus:ring-2 focus:ring-white/50"
                />
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                  Subscribe
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
