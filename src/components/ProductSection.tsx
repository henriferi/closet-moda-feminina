import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Diamond } from "lucide-react";

interface ProductSectionProps {
  title: string;
  products: Product[];
  featured?: boolean;
}

export const ProductSection = ({ title, products, featured = false }: ProductSectionProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Diamond className="w-6 h-6 text-primary-rose" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {title}
            </h2>
            <Diamond className="w-6 h-6 text-primary-rose" />
          </div>
          <div className="w-24 h-1 bg-gradient-rose mx-auto rounded-full" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} featured={featured} />
          ))}
        </div>
      </div>
    </section>
  );
};