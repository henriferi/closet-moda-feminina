import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProductSection } from "@/components/ProductSection";
import { toast } from "@/hooks/use-toast";
import { getApiKey } from "@/helpers/getAuthHeaders";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();

  // --------------------------------------------------
  // 🔥 Buscar produto pelo ID
  // --------------------------------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const headers = await getApiKey();

        const url = `${
          import.meta.env.VITE_SUPABASE_URL
        }/rest/v1/products?id=eq.${id}`;

        const res = await fetch(url, { headers });

        if (!res.ok) throw new Error("Erro ao buscar produto");

        const data = await res.json();

        if (!data.length) {
          setProduct(null);
          return;
        }

        // Mapear para camelCase
        const row = data[0];
        const mappedProduct: Product = {
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
        };

        setProduct(mappedProduct);

        // --------------------------------------------------
        // 🔥 Buscar produtos relacionados pela categoria
        // --------------------------------------------------
        const relRes = await fetch(
          `${
            import.meta.env.VITE_SUPABASE_URL
          }/rest/v1/products?category=eq.${mappedProduct.category}`,
          { headers }
        );

        if (relRes.ok) {
          const relData = await relRes.json();
          const mappedRelated: Product[] = relData
            .filter((p: any) => p.id !== mappedProduct.id)
            .slice(0, 4)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              category: p.category,
              isFeatured: p.is_featured,
              isBestSeller: p.is_best_seller,
              stock: p.stock,
              sizes: p.sizes,
              images: p.images,
              discount: p.discount ?? 0,
            }));

          setRelatedProducts(mappedRelated);
        }
      } catch (err) {
        toast({
          title: "Erro ao carregar produto",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --------------------------------------------------
  // 🔄 Navegação das imagens
  // --------------------------------------------------
  const nextImage = () => {
    if (product && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // --------------------------------------------------
  // 🛒 Adicionar ao carrinho
  // --------------------------------------------------
  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock !== undefined && product.stock <= 0) {
      toast({
        title: "Produto esgotado",
        description: "Este produto não está disponível no momento.",
        variant: "destructive",
      });
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Escolha um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    addItem(product, selectedSize || "Tamanho único");

    toast({
      title: "Produto adicionado!",
      description: `${product.name}${
        selectedSize ? ` (${selectedSize})` : ""
      } foi adicionado ao carrinho.`,
    });
  };

  // --------------------------------------------------
  // ⏳ Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-16">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            Carregando produto...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --------------------------------------------------
  // ❌ Produto não encontrado
  // --------------------------------------------------
  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Produto não encontrado</p>
            <Link to="/produtos" className="inline-block mt-6">
              <Button variant="rose">Voltar para Produtos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --------------------------------------------------
  // ✅ Renderização do produto
  // --------------------------------------------------
  return (
    <>
      <Header />
      <ScrollToTop />
      <main className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/produtos">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Produtos
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Imagens */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Setas */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === product.images.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? "border-primary-rose"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.category}
              </p>

              <h1 className="text-3xl md:text-4xl font-serif font-bold">
                {product.name}
              </h1>

              <p className="text-4xl font-bold text-primary-rose">
                R$ {product.price.toFixed(2)}
              </p>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Tamanhos */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">Selecione o Tamanho</h3>
                {product.sizes?.length ? (
                  <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    className="flex gap-3"
                  >
                    {product.sizes.map((size) => (
                      <div key={size}>
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className="flex items-center justify-center w-12 h-12 border-2 border-border rounded cursor-pointer peer-data-[state=checked]:border-primary-rose"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-muted-foreground text-sm">Tamanho único</p>
                )}
              </div>

              {/* Botão */}
              <Button
                variant="rose"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                Adicionar ao Carrinho
              </Button>

              {/* Badges */}
              <div className="flex gap-2">
                {product.isBestSeller && (
                  <span className="px-3 py-1 text-xs bg-primary-rose/10 text-primary-rose rounded-full">
                    Mais Vendido
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                    Destaque
                  </span>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <ProductSection
              title="Sugestões para Você"
              products={relatedProducts}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
