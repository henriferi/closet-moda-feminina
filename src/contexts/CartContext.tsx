import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";
import { Coupon } from "@/types/coupon";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("closet-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const savedCoupon = localStorage.getItem("closet-coupon");
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  useEffect(() => {
    localStorage.setItem("closet-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("closet-coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("closet-coupon");
    }
  }, [appliedCoupon]);

  const addItem = (product: Product, size: string, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, size, quantity }];
    });
  };

  const removeItem = (productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    return (getSubtotal() * appliedCoupon.desconto) / 100;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getSubtotal,
        getDiscount,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
