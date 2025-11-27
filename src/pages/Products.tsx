import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/mockData";
import { Diamond } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[128px] pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Diamond className="w-8 h-8 text-primary-rose" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Nossos Produtos
              </h1>
              <Diamond className="w-8 h-8 text-primary-rose" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa coleção exclusiva de peças elegantes e sofisticadas
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories
                    .filter((c) => c !== "all")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              {sortedProducts.length} {sortedProducts.length === 1 ? "produto" : "produtos"}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Products;