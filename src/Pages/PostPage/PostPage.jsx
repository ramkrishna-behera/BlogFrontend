
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  Eye,
  Heart,
  Calendar,
  Pencil,
  Upload,
  MoreVertical,
  Trash2,
} from "lucide-react";

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("authToken");

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}`;

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch blog");
      const data = await res.json();
      setBlog(data);
      setTitle(data.title || "");
      setContent(data.content || "");
      setCategory(data.category || "");
      setCoverImage(data.image || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [API_URL]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      setCoverImage(data.imageUrl || data.url || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return setError("Not authorized");
    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category, image: coverImage }),
      });
      if (!res.ok) throw new Error("Failed to update blog");
      await fetchBlog();
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return setError("Not authorized");
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );

  if (!blog) return null;

  const categories = [
    "Technology",
    "Design",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
    "Other",
  ];

  return (
    <div className="pt-20 px-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative">
          {isEditing ? (
            <input
              className="text-3xl font-bold w-full border rounded p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h1 className="text-3xl font-bold">{blog.title}</h1>
          )}

          {currentUser?.id === blog.author?._id && !isEditing && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-50 w-full"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex gap-4 text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {blog.views} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" /> {blog.likes} likes
          </span>
          {isEditing ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-2"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          ) : (
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {blog.category}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {blog.author?.name?.[0]}
          </div>
          <div>
            <p className="font-medium">{blog.author?.name}</p>
            <p className="text-sm text-gray-500">{blog.author?.email}</p>
          </div>
        </div>

        {/* Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className={`w-full h-96 object-cover ${
              imageLoading ? "opacity-50" : ""
            }`}
          />
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
          {isEditing && (
            <label className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" /> Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            className="w-full border rounded p-4 min-h-[300px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        )}

        {/* Save / Cancel */}
        {isEditing && (
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(blog.title);
                setContent(blog.content);
                setCategory(blog.category);
                setCoverImage(blog.image);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {!isEditing && (
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ← Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
