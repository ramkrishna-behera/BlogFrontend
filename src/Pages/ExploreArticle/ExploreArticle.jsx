
import  { useEffect, useState, useRef, useMemo } from "react";
import { Search, Filter } from "lucide-react";

import BlogCard from "../../Components/BlogCard/BlogCard";
import FilterSideBar from "../../Components/FilterSideBar/FilterSideBar";
import WriteButton from "../../Components/WriteButton/WriteButton";

/**
 * ExploreArticles - page container
 * - fetches /api/blogs
 * - manages local filters & infinite-scroll
 * - uses FilterSideBar, BlogCard, WriteButton components
 */

// fixed category list per your requirement
const ALL_CATEGORIES = ["Technology", "Lifestyle", "Education", "Travel", "Food", "Other"];

export default function ExploreArticles() {

  // All blog data from API
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filtering & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    date: "newest", // newest | oldest
    likes: "", // most | least | ""
    views: "", // most | least | ""
  });

  // Pagination / infinite scroll
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);

  // Mobile filter drawer
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch blogs on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blogs`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setAllBlogs(data || []);
          setFetchError(null);
        }
      } catch (err) {
        console.error("Fetch blogs error:", err);
        if (isMounted) setFetchError(err.message || "Failed to fetch");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // derive authors from data (for dropdown)
  const authors = useMemo(
    () =>
      Array.from(new Set(allBlogs.map((b) => (b.author && b.author.name) || "Unknown"))),
    [allBlogs]
  );

  // Apply search + filters + sort (client-side)
  const filteredAndSorted = useMemo(() => {
    let list = [...allBlogs];

    // search in title + content (case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.content && b.content.toLowerCase().includes(q))
      );
    }

    // category filter
    if (filters.category) {
      list = list.filter((b) => b.category === filters.category);
    }

    // author filter
    if (filters.author) {
      list = list.filter((b) => (b.author?.name || "Unknown") === filters.author);
    }

    // sort: date
    if (filters.date === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.date === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // sort by likes/views override (if specified)
    if (filters.likes === "most") {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (filters.likes === "least") {
      list.sort((a, b) => (a.likes || 0) - (b.likes || 0));
    }

    if (filters.views === "most") {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filters.views === "least") {
      list.sort((a, b) => (a.views || 0) - (b.views || 0));
    }

    return list;
  }, [allBlogs, searchQuery, filters]);

  // visible slice for infinite-scroll
  const visibleList = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  // IntersectionObserver to load more
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, filteredAndSorted.length));
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef, hasMore, filteredAndSorted.length]);

  // When filters/search change, reset visibleCount to first page
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, filters]);

  // helpers
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setFilters({ category: "", author: "", date: "newest", likes: "", views: "" });
    setSearchQuery("");
  };

  // UI
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Articles</h1>
            <p className="text-gray-600 mt-1">Discover curated stories across categories.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-3 py-1 shadow-sm">
              <Search className="w-4 h-4 text-gray-600 mr-2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title or content..."
                className="bg-transparent outline-none px-2 py-1 text-sm w-60 placeholder-gray-500"
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="sm:hidden inline-flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT: Filters (sticky) */}
          <aside className="order-2 lg:order-1 lg:col-span-1">
            <div className="hidden lg:block sticky top-28">
              <FilterSideBar
                categories={ALL_CATEGORIES}
                authors={authors}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                isMobileOpen={false}
                onCloseMobile={() => {}}
              />
            </div>
          </aside>

          {/* RIGHT: Cards grid */}
          <main className="order-1 lg:order-2 lg:col-span-3">
            <section>
              

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse h-80" />
                  ))}
                </div>
              ) : fetchError ? (
                <div className="text-center text-red-500">Failed to load blogs: {fetchError}</div>
              ) : filteredAndSorted.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-3xl mb-3">No blogs yet</div>
                  <div className="text-gray-500">Try resetting filters or come back later.</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {visibleList.map((post) => (
                      <BlogCard key={post._id} post={post} />
                    ))}
                  </div>

                  {/* load more sentinel */}
                  <div ref={loadMoreRef} className="mt-8 flex justify-center">
                    {hasMore ? (
                      <div className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/30">
                        Loading more...
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No more articles</div>
                    )}
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Floating New Article button */}
      <WriteButton />

        {/* Mobile filter drawer */}
        <div className="lg:hidden">
            <FilterSideBar
                categories={ALL_CATEGORIES}
                authors={authors}
                filters={filters}
                onChange={handleFilterChange}
                onReset={() => {
                handleReset();
                setIsMobileFiltersOpen(false);
                }}
                isMobileOpen={isMobileFiltersOpen}
                onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
        </div>

    </div>
  );
}
