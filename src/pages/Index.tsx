import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductSection } from "@/components/ProductSection";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { getApiKey } from "@/helpers/getAuthHeaders";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const headers = await getApiKey();

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/products`,
          { method: "GET", headers }
        );

        if (!res.ok) throw new Error("Erro ao buscar produtos");

        const data = await res.json();

        const mapped: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          isFeatured: row.is_featured,
          isBestSeller: row.is_best_seller,
          stock: row.stock,
          sizes: row.sizes,
          images: row.images,
          discount: row.discount ?? 0,
        }));

        setProducts(mapped);
      } catch (error) {
        toast({
          title: "Erro ao carregar produtos",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const bestSellers = products.filter((p) => p.isBestSeller);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />

        {/* CTA para mobile */}
        <div className="container mx-auto px-4 py-8 lg:hidden">
          <Link to="/produtos" className="block">
            <Button size="lg" variant="rose" className="w-full">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {!loading && (
          <>
            <ProductSection title="Destaques" products={featured} featured />
            <ProductSection title="Mais Vendidos" products={bestSellers} />
          </>
        )}

        {loading && (
          <p className="text-center text-muted-foreground py-10">
            Carregando produtos...
          </p>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
