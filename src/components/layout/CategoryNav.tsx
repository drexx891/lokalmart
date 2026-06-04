import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryNavProps {
  categories: Category[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <div className="bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 py-3 min-w-max">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.id}`}
              className="flex flex-col items-center justify-center gap-2 p-3 w-32 rounded-lg text-[#6B7280] hover:bg-[#EBF2FA] hover:text-[#1A3C6E] transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 relative overflow-hidden rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200">
                {cat.icon ? (
                  <Image 
                    src={cat.icon} 
                    alt={cat.name} 
                    fill 
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
