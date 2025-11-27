export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // Array of 1-4 image URLs
  category: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  sizes?: string[];
  discount?: number;
  stock?: number; // Quantidade disponível em estoque
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface LoopingText {
  id: string;
  text: string;
}