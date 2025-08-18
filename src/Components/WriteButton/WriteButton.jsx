"use client";

import React from "react";
import { Link } from "react-router-dom";
import { PenSquare } from "lucide-react";

/**
 * WriteButton - floating New Article button
 */
export default function WriteButton() {
  return (
    <Link
      to="/write"
      className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-2xl flex items-center gap-2 hover:scale-[1.03] transition-transform z-50"
    >
      <PenSquare className="w-4 h-4" /> New Article
    </Link>
  );
}
