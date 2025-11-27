import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { products } from "@/data/mockData";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProductSection } from "@/components/ProductSection";
import { toast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
    
    const foundProduct = products.find((p) => p.id === id);
    setProduct(foundProduct || null);

    if (foundProduct) {
      const related = products
        .filter(
          (p) => p.category === foundProduct.category && p.id !== foundProduct.id
        )
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [id]);

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

  const handleAddToCart = () => {
    if (!product || (product.stock !== undefined && product.stock <= 0)) {
      toast({
        title: "Produto esgotado",
        description: "Este produto não está disponível no momento.",
        variant: "destructive",
      });
      return;
    }

    // Só valida tamanho se o produto tiver tamanhos disponíveis
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, escolha um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      addItem(product, selectedSize || "Tamanho único");
      toast({
        title: "Produto adicionado!",
        description: `${product.name}${selectedSize ? ` (${selectedSize})` : ''} foi adicionado ao carrinho.`,
      });
    }
  };

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Produto não encontrado</p>
            <div className="text-center mt-6">
              <Link to="/produtos">
                <Button variant="rose">Voltar para Produtos</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ScrollToTop />
      <main className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/produtos">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Produtos
            </Button>
          </Link>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border">
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === product.images.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 text-sm font-medium">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-smooth ${
                        index === currentImageIndex
                          ? "border-primary-rose"
                          : "border-border hover:border-primary-rose/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-4xl font-bold text-primary-rose">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">Selecione o Tamanho</h3>
                {product.sizes && product.sizes.length > 0 ? (
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
                          className="flex items-center justify-center w-12 h-12 border-2 border-border rounded cursor-pointer peer-data-[state=checked]:border-primary-rose peer-data-[state=checked]:bg-primary-rose/10 hover:border-primary-rose/50 transition-smooth"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-sm text-muted-foreground">Tamanho único</p>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="rose"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock !== undefined && product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock !== undefined && product.stock <= 0 ? "Esgotado" : "Adicionar ao Carrinho"}
              </Button>

              {/* Product Badges */}
              <div className="flex gap-2 pt-4">
                {product.isBestSeller && (
                  <span className="px-3 py-1 bg-primary-rose/10 text-primary-rose text-xs font-semibold rounded-full">
                    Mais Vendido
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                    Destaque
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
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
