import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  return (
    <Card
      className={`group overflow-hidden transition-smooth hover:shadow-elegant border-border h-full flex flex-col ${
        featured ? "shadow-card" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted flex-shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-primary-rose text-secondary-foreground text-[9px] sm:text-xs font-semibold rounded-full">
            Mais Vendido
          </div>
        )}
        {product.isFeatured && !product.isBestSeller && (
          <div className="absolute top-2 left-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-secondary text-secondary-foreground text-[9px] sm:text-xs font-semibold rounded-full">
            Destaque
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4 flex flex-col flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1 truncate">
          {product.category}
        </p>
        <h3 className="font-serif text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-primary-rose transition-smooth line-clamp-2 break-words">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 line-clamp-2 break-words">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto min-w-0">
          <span className="text-base sm:text-xl font-bold text-primary-rose flex-shrink-0">
            R$ {product.price.toFixed(2)}
          </span>
          <Link to={`/produto/${product.id}`} className="flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="border-primary-rose text-primary-rose hover:bg-primary-rose hover:text-secondary-foreground transition-smooth text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
            >
              Ver
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};