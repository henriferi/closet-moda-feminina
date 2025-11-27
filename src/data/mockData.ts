import { Product, HeroSlide, LoopingText } from "@/types/product";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

// Future integration: This data will come from Supabase
// Tables: products, hero_slides, looping_texts

export const loopingTexts: LoopingText[] = [
  { id: "1", text: "✨ Frete Grátis em Compras Acima de R$ 200" },
  { id: "2", text: "💎 Nova Coleção: Primavera/Verão 2025" },
  { id: "3", text: "🌸 Desconto de 15% na Primeira Compra" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    image: hero1,
    title: "Nova Coleção Primavera/Verão",
    subtitle: "Descubra as últimas tendências em moda feminina",
    buttonText: "Ver Coleção",
    buttonLink: "/produtos",
  },
  {
    id: "2",
    image: hero2,
    title: "Elegância Atemporal",
    subtitle: "Peças sofisticadas para todas as ocasiões",
    buttonText: "Compre Agora",
    buttonLink: "/produtos",
  },
  {
    id: "3",
    image: hero3,
    title: "Estilo Único",
    subtitle: "Expresse sua personalidade com nossas peças exclusivas",
    buttonText: "Explorar",
    buttonLink: "/produtos",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Vestido Floral Elegante",
    description: "Vestido midi com estampa floral delicada",
    price: 289.90,
    images: [product1, product2, product3],
    category: "Vestidos",
    isFeatured: true,
    isBestSeller: true,
    stock: 15,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "2",
    name: "Blusa de Seda Premium",
    description: "Blusa em seda pura com caimento perfeito",
    price: 219.90,
    images: [product2, product4],
    category: "Blusas",
    isFeatured: true,
    isBestSeller: true,
    stock: 20,
    sizes: ["P", "M", "G"],
  },
  {
    id: "3",
    name: "Calça Alfaiataria Clássica",
    description: "Calça de alfaiataria com corte moderno",
    price: 329.90,
    images: [product3, product5, product6, product7],
    category: "Calças",
    isFeatured: false,
    isBestSeller: true,
    stock: 8,
    sizes: ["M", "G", "GG"],
  },
  {
    id: "4",
    name: "Saia Plissada Rosa",
    description: "Saia plissada midi em tons de rosa",
    price: 189.90,
    images: [product4, product8],
    category: "Saias",
    isFeatured: true,
    isBestSeller: false,
    stock: 0,
    sizes: ["P", "M", "G"],
  },
  {
    id: "5",
    name: "Blazer Estruturado",
    description: "Blazer estruturado em tecido premium",
    price: 419.90,
    images: [product5, product1, product2],
    category: "Blazers",
    isFeatured: true,
    isBestSeller: true,
    stock: 12,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "6",
    name: "Conjunto Tricot Sofisticado",
    description: "Conjunto de tricot para dias frescos",
    price: 359.90,
    images: [product6, product3],
    category: "Conjuntos",
    isFeatured: false,
    isBestSeller: true,
    stock: 5,
    sizes: ["M", "G"],
  },
  {
    id: "7",
    name: "Vestido de Festa Rosê",
    description: "Vestido longo para ocasiões especiais",
    price: 549.90,
    images: [product7, product4, product5],
    category: "Vestidos",
    isFeatured: true,
    isBestSeller: false,
    stock: 3,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "8",
    name: "Top Cropped Delicado",
    description: "Top cropped com detalhes em renda",
    price: 129.90,
    images: [product8],
    category: "Blusas",
    isFeatured: true,
    isBestSeller: true,
    stock: 25,
    sizes: ["P", "M"],
  },
];