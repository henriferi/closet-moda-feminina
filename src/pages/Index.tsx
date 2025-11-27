import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductSection } from "@/components/ProductSection";
import { ScrollToTop } from "@/components/ScrollToTop";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const bestSellers = products.filter((p) => p.isBestSeller);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        
        {/* Call to Action - Mobile Focused */}
        <div className="container mx-auto px-4 py-8 lg:hidden">
          <Link to="/produtos" className="block">
            <Button 
              size="lg" 
              variant="rose"
              className="w-full"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <ProductSection
          title="Destaques"
          products={featured}
          featured
        />
        <ProductSection
          title="Mais Vendidos"
          products={bestSellers}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;