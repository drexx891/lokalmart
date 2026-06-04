import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/types";
import AddToCartButton from "@/components/AddToCartButton";
import CategoryGrid from "./CategoryGrid";
import ProductGrid from "./ProductGrid";

interface ProductSectionProps {
  categories: (Category & { icon?: string | null; slug?: string | null; imageUrl?: string | null })[];
  products: Product[];
  recommendedProducts?: Product[];
}

export default function ProductSection({ categories, products, recommendedProducts }: ProductSectionProps) {
  return (
    <div className="bg-[#F7F8FA] pb-20">
        
        {/* Kategori Pilihan - Menggunakan Client Component */}
        <CategoryGrid categories={categories} />

        {/* Produk Unggulan - Menggunakan Client Component */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                Produk Unggulan
                <span className="bg-[#F5A623] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">Pilihan</span>
            </h2>

            <ProductGrid products={products} initialItems={8} showSeeAllButton={true} />
        </div>

        {/* Produk Rekomendasi */}
        {recommendedProducts && recommendedProducts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <h2 className="text-xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                    Produk Rekomendasi
                    <span className="bg-[#2ECC8B] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">Spesial</span>
                </h2>

                <ProductGrid products={recommendedProducts} initialItems={24} showSeeAllButton={false} />
        </div>
        )}

    </div>
  );
}
