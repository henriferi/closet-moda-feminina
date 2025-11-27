import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { coupons } from "@/data/coupons";
import { useToast } from "@/hooks/use-toast";

export const CartDrawer = () => {
  const {
    items,
    appliedCoupon,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const { toast } = useToast();

  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim().toUpperCase();
    const coupon = coupons.find(
      (c) => c.codigo.toUpperCase() === trimmedCode && c.ativo
    );

    if (coupon) {
      applyCoupon(coupon);
      setCouponCode("");
      toast({
        title: "Cupom aplicado!",
        description: `Desconto de ${coupon.desconto}% aplicado com sucesso.`,
      });
    } else {
      toast({
        title: "Cupom inválido",
        description: "O cupom informado não existe ou está expirado.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido do carrinho.",
    });
  };

  const formatWhatsAppMessage = () => {
    const message = items
      .map(
        (item) =>
          `*${item.product.name}*\n` +
          `Tamanho: ${item.size}\n` +
          `Quantidade: ${item.quantity}\n` +
          `Preço unitário: R$ ${item.product.price.toFixed(2)}\n` +
          `Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}`
      )
      .join("\n\n");

    let totalMessage = `\n\n*Subtotal: R$ ${getSubtotal().toFixed(2)}*`;
    
    if (appliedCoupon) {
      totalMessage += `\n*Desconto (${appliedCoupon.desconto}%): -R$ ${getDiscount().toFixed(2)}*`;
    }
    
    totalMessage += `\n\n*TOTAL: R$ ${getTotal().toFixed(2)}*`;
    
    const greeting = "Olá! Gostaria de finalizar meu pedido:\n\n";

    return encodeURIComponent(greeting + message + totalMessage);
  };

  const handleWhatsAppCheckout = () => {
    const phone = "5511999999999"; // Substitua pelo número real do WhatsApp
    const message = formatWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    clearCart();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-rose text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getItemCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-rose" />
            Meu Carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <Link to="/produtos">
                <Button variant="rose" className="mt-4">
                  Ver Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.size}-${index}`}
                    className="flex gap-4 p-4 border border-border rounded-lg"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Tamanho: {item.size}
                      </p>
                      <p className="text-primary-rose font-bold">
                        R$ {item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 ml-auto text-destructive"
                          onClick={() => removeItem(item.product.id, item.size)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-4">
                {/* Cupom de desconto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary-rose" />
                    Cupom de desconto
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center gap-2 p-3 bg-primary-rose/10 border border-primary-rose/20 rounded-lg">
                      <Tag className="h-4 w-4 text-primary-rose" />
                      <span className="text-sm font-medium flex-1">
                        {appliedCoupon.codigo} ({appliedCoupon.desconto}% OFF)
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={handleRemoveCoupon}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleApplyCoupon();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                      >
                        Aplicar
                      </Button>
                    </div>
                  )}
                </div>

                {/* Resumo de valores */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {getSubtotal().toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-primary-rose">
                      <span>Desconto ({appliedCoupon.desconto}%):</span>
                      <span>-R$ {getDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary-rose">
                      R$ {getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/produtos" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Continuar Comprando
                    </Button>
                  </Link>
                  <Button
                    variant="rose"
                    className="flex-1 w-full"
                    onClick={handleWhatsAppCheckout}
                  >
                    Finalizar no WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
