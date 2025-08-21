
import React from "react";
import { Filter, X } from "lucide-react";

// Simple Neumorphism style utility
const neoButton =
  "px-4 py-2 rounded-xl bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition";

export default function FilterSideBar({
  categories = [],
  authors = [],
  filters,
  onChange,
  onReset,
  isMobileOpen,
  onCloseMobile,
}) {
  // Utility to toggle between Most/Least/None
  const toggleSort = (key, value) => {
    if (filters[key] === value) {
      onChange(key, ""); // deselect if clicked again
    } else {
      onChange(key, value);
    }
  };

  const renderSortButtons = (key) => (
    <div className="flex gap-3">
      <button
        className={`${neoButton} flex-1 ${
          filters[key] === "most" ? "bg-grey-100" : ""
        }`}
        onClick={() => toggleSort(key, "most")}
      >
        Most
      </button>
      <button
        className={`${neoButton} flex-1 ${
          filters[key] === "least" ? "bg-grey-100" : ""
        }`}
        onClick={() => toggleSort(key, "least")}
      >
        Least
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" /> Filters
          </h3>

          {/* Date */}
          <label className="block mb-4">
            <div className="text-xs text-gray-500 mb-2">Date</div>
            <select
              value={filters.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="w-full rounded-xl p-2 bg-white/40 border border-white/30"
            >
              <option value="newest">Newest → Oldest</option>
              <option value="oldest">Oldest → Newest</option>
            </select>
          </label>

          {/* Category */}
          <label className="block mb-4">
            <div className="text-xs text-gray-500 mb-2">Category</div>
            <select
              value={filters.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="w-full rounded-xl p-2 bg-white/40 border border-white/30"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Author */}
          <label className="block mb-4">
            <div className="text-xs text-gray-500 mb-2">Author</div>
            <select
              value={filters.author}
              onChange={(e) => onChange("author", e.target.value)}
              className="w-full rounded-xl p-2 bg-white/40 border border-white/30"
            >
              <option value="">All Authors</option>
              {authors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          {/* Likes */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Likes</div>
            {renderSortButtons("likes")}
          </div>

          {/* Views */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Views</div>
            {renderSortButtons("views")}
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={onReset}
              className={`${neoButton} flex-1 text-gray-700`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <div className="absolute right-0 top-0 bottom-0 w-11/12 max-w-sm bg-white/80 backdrop-blur-lg p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={onCloseMobile} className="p-1 rounded-full">
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <label>
                <div className="text-xs text-gray-500 mb-2">Date</div>
                <select
                  value={filters.date}
                  onChange={(e) => onChange("date", e.target.value)}
                  className="w-full rounded-xl p-2 bg-white/40 border border-white/30"
                >
                  <option value="newest">Newest → Oldest</option>
                  <option value="oldest">Oldest → Newest</option>
                </select>
              </label>

              {/* Category */}
              <label>
                <div className="text-xs text-gray-500 mb-2">Category</div>
                <select
                  value={filters.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  className="w-full rounded-xl p-2 bg-white/40 border border-white/30"
                >
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              {/* Author */}
              <label>
                <div className="text-xs text-gray-500 mb-2">Author</div>
                <select
                  value={filters.author}
                  onChange={(e) => onChange("author", e.target.value)}
                  className="w-full rounded-xl p-2 bg-white/40 border border-white/30"
                >
                  <option value="">All Authors</option>
                  {authors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              {/* Likes */}
              <div>
                <div className="text-xs text-gray-500 mb-2">Likes</div>
                {renderSortButtons("likes")}
              </div>

              {/* Views */}
              <div>
                <div className="text-xs text-gray-500 mb-2">Views</div>
                {renderSortButtons("views")}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    onReset();
                    onCloseMobile();
                  }}
                  className={`${neoButton} flex-1 text-gray-700`}
                >
                  Reset
                </button>
                <button
                  onClick={onCloseMobile}
                  className="flex-1 px-4 py-2 rounded-xl bg-grey-600 text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
