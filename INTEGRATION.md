# Guia de Integração com Supabase

Este documento descreve como integrar o site **Closet Moda Feminina** com Supabase para substituir os dados fictícios (mock data) por dados reais vindos do banco de dados.

## Estrutura Atual

### Dados Mock (Temporários)
Atualmente, o site utiliza dados fictícios armazenados em:
- `src/data/mockData.ts` - Contém produtos, slides do hero e textos em looping
- `src/types/product.ts` - Define as interfaces TypeScript

### Estrutura de Dados

#### 1. Produtos (Product)
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
  isBestSeller: boolean;
}
```

#### 2. Hero Slides (HeroSlide)
```typescript
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}
```

#### 3. Textos em Looping (LoopingText)
```typescript
interface LoopingText {
  id: string;
  text: string;
}
```

## Integração com Supabase

### Passo 1: Criar as Tabelas no Supabase

#### Tabela: `products`
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### Tabela: `hero_slides`
```sql
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT NOT NULL,
  button_link TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### Tabela: `looping_texts`
```sql
CREATE TABLE looping_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Passo 2: Configurar o Cliente Supabase

Crie o arquivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Passo 3: Criar Serviços de API

Crie `src/services/productsService.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    isFeatured: item.is_featured,
    isBestSeller: item.is_best_seller,
  }));
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true);

  if (error) throw error;
  return data;
};

export const getBestSellers = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_best_seller', true);

  if (error) throw error;
  return data;
};
```

Crie `src/services/heroService.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import { HeroSlide } from '@/types/product';

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    image: item.image,
    title: item.title,
    subtitle: item.subtitle,
    buttonText: item.button_text,
    buttonLink: item.button_link,
  }));
};
```

Crie `src/services/loopingTextsService.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import { LoopingText } from '@/types/product';

export const getLoopingTexts = async (): Promise<LoopingText[]> => {
  const { data, error } = await supabase
    .from('looping_texts')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    text: item.text,
  }));
};
```

### Passo 4: Atualizar Componentes para Usar React Query

Exemplo para `src/pages/Index.tsx`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productsService";
import { getHeroSlides } from "@/services/heroService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductSection } from "@/components/ProductSection";

const Index = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const bestSellers = products.filter((p) => p.isBestSeller);
  const featured = products.filter((p) => p.isFeatured);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <ProductSection title="Mais Vendidos" products={bestSellers} />
        <ProductSection title="Destaques" products={featured} featured />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
```

### Passo 5: Configurar Variáveis de Ambiente

Crie o arquivo `.env.local`:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Painel Administrativo (Futuro)

Para implementar um painel administrativo, considere:

1. **Autenticação**: Usar Supabase Auth para login de administradores
2. **Rotas Protegidas**: Criar páginas admin protegidas por autenticação
3. **CRUD de Produtos**: Formulários para criar, editar e deletar produtos
4. **Gerenciamento de Slides**: Interface para adicionar/editar slides do hero
5. **Gerenciamento de Textos**: Editor para textos em looping

### Estrutura Sugerida para Admin

```
src/
  pages/
    admin/
      Login.tsx
      Dashboard.tsx
      Products.tsx
      HeroSlides.tsx
      Settings.tsx
```

## Migrações de Dados

Para migrar os dados mockados atuais para o Supabase, você pode usar este script:

```typescript
// scripts/migrateData.ts
import { supabase } from '../src/lib/supabase';
import { products, heroSlides, loopingTexts } from '../src/data/mockData';

async function migrateData() {
  // Migrar produtos
  const { error: productsError } = await supabase
    .from('products')
    .insert(products.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      is_featured: p.isFeatured,
      is_best_seller: p.isBestSeller,
    })));

  if (productsError) console.error('Erro ao migrar produtos:', productsError);

  // Migrar hero slides
  const { error: slidesError } = await supabase
    .from('hero_slides')
    .insert(heroSlides.map((s, index) => ({
      image: s.image,
      title: s.title,
      subtitle: s.subtitle,
      button_text: s.buttonText,
      button_link: s.buttonLink,
      order_index: index,
    })));

  if (slidesError) console.error('Erro ao migrar slides:', slidesError);

  // Migrar textos em looping
  const { error: textsError } = await supabase
    .from('looping_texts')
    .insert(loopingTexts.map((t, index) => ({
      text: t.text,
      order_index: index,
    })));

  if (textsError) console.error('Erro ao migrar textos:', textsError);

  console.log('Migração concluída!');
}

migrateData();
```

## Storage para Imagens

Para fazer upload de imagens de produtos e slides:

1. Crie um bucket no Supabase Storage chamado `product-images`
2. Configure as políticas de acesso público para leitura
3. Implemente upload de imagens no painel admin:

```typescript
async function uploadProductImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

## Dependências Necessárias

Adicione as seguintes dependências ao projeto:

```bash
npm install @supabase/supabase-js
```

## Próximos Passos

1. ✅ Design System implementado
2. ✅ Componentes modulares criados
3. ✅ Mock data estruturado
4. ⏳ Conectar ao Lovable Cloud (Supabase)
5. ⏳ Criar tabelas no banco de dados
6. ⏳ Implementar serviços de API
7. ⏳ Substituir mock data por chamadas reais
8. ⏳ Criar painel administrativo
9. ⏳ Implementar autenticação
10. ⏳ Configurar storage para imagens

---

Este guia fornece uma base sólida para a integração. Adapte conforme necessário para as necessidades específicas do projeto.
