import ProductCard from "./ProductCard";
import { Sprout } from "lucide-react";

export default function ProductGrid({ products, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card aspect-square animate-pulse bg-sage-100" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
        <Sprout size={38} className="text-leaf/40" />
        <p className="font-bangla text-sm text-ink/60">
          {emptyMessage || "এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
