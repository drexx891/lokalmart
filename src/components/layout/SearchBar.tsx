"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

export default function SearchBar({ categories }: { categories: Category[] }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    // Construct search URL
    const query = new URLSearchParams();
    query.set("q", keyword);
    if (category !== "all") {
      query.set("cat", category);
    }
    
    router.push(`/search?${query.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="flex w-full bg-white border-2 border-[#1A3C6E] rounded-full overflow-hidden focus-within:shadow-[0_0_0_2px_rgba(227,24,55,0.2)] transition-shadow"
    >
      {/* Dropdown Kategori */}
      <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-transparent text-[#1F2937] px-4 py-3 outline-none border-r border-[#E5E7EB] text-sm cursor-pointer hidden sm:block max-w-[160px] truncate"
      >
        <option value="all">Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </option>
        ))}
      </select>
      
      {/* Input Search */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Saya sedang mencari..."
        className="flex-1 bg-transparent text-[#1F2937] px-4 py-3 outline-none placeholder:text-[#9CA3AF]"
      />
      
      {/* Tombol Search */}
      <button type="submit" className="bg-[#1A3C6E] text-white px-8 font-bold hover:bg-[#2A5FA0] transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Cari
      </button>
    </form>
  );
}
