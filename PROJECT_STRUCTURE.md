# Closet Moda Feminina - Estrutura do Projeto

## 📁 Estrutura de Arquivos

```
src/
├── assets/                    # Imagens e recursos estáticos
│   ├── hero-1.jpg            # Hero banner slide 1
│   ├── hero-2.jpg            # Hero banner slide 2
│   ├── hero-3.jpg            # Hero banner slide 3
│   └── product-*.jpg         # Imagens dos produtos
│
├── components/               # Componentes reutilizáveis
│   ├── ui/                   # Componentes Shadcn UI
│   ├── Footer.tsx            # Rodapé do site
│   ├── Header.tsx            # Cabeçalho com menu
│   ├── HeroBanner.tsx        # Banner principal com slides
│   ├── LoadingSpinner.tsx    # Indicador de carregamento
│   ├── NavLink.tsx           # Link de navegação
│   ├── ProductCard.tsx       # Card de produto individual
│   ├── ProductSection.tsx    # Seção de produtos (grid)
│   └── ScrollToTop.tsx       # Botão voltar ao topo
│
├── data/                     # Dados mockados (temporários)
│   └── mockData.ts           # Produtos, slides, textos em looping
│
├── hooks/                    # Custom React hooks
│   ├── use-mobile.tsx        # Hook para detectar mobile
│   └── use-toast.ts          # Hook para notificações
│
├── lib/                      # Utilitários e configurações
│   ├── utils.ts              # Funções utilitárias (cn)
│   └── README.md             # Instruções para futuras integrações
│
├── pages/                    # Páginas da aplicação
│   ├── About.tsx             # Página Sobre Nós
│   ├── Contact.tsx           # Página de Contato
│   ├── Index.tsx             # Página inicial
│   ├── NotFound.tsx          # Página 404
│   └── Products.tsx          # Catálogo de produtos
│
├── types/                    # TypeScript interfaces
│   └── product.ts            # Interfaces de dados
│
├── App.tsx                   # Componente raiz
├── index.css                 # Design system e estilos globais
└── main.tsx                  # Entry point da aplicação
```

## 🎨 Design System

### Cores Principais

O design system está definido em `src/index.css` usando variáveis CSS:

- **Primary (Rosa Bebê)**: `--primary`
- **Primary Rose (Rosê)**: `--primary-rose`
- **Primary Rose Dark (Rosê Escuro)**: `--primary-rose-dark`
- **Secondary (Preto Elegante)**: `--secondary`
- **Background**: `--background`
- **Foreground**: `--foreground`
- **Muted**: `--muted`

### Gradientes

```css
--gradient-primary: Rosa bebê → Rosê
--gradient-rose: Rosê → Rosê escuro
--gradient-subtle: Branco → Rosa muito claro
```

### Tipografia

- **Títulos**: Playfair Display (serif)
- **Corpo**: Inter (sans-serif)

### Componentes Personalizados

#### Button Variants
- `default`: Estilo padrão
- `rose`: Com gradiente rosê
- `elegant`: Rosa elegante com sombra
- `outline`: Apenas borda
- `ghost`: Sem fundo

#### Classes Utilitárias
- `.gradient-primary`
- `.gradient-rose`
- `.gradient-subtle`
- `.shadow-elegant`
- `.shadow-card`
- `.transition-smooth`
- `.diamond-icon`

## 📄 Páginas

### Index (`/`)
- Hero banner com 3 slides automáticos
- Seção "Mais Vendidos"
- Seção "Destaques"

### Products (`/produtos`)
- Catálogo completo de produtos
- Filtros por categoria
- Ordenação por preço e nome
- Grid responsivo

### About (`/sobre`)
- História da marca
- Valores da empresa
- Missão e visão

### Contact (`/contato`)
- Formulário de contato
- Informações de contato
- Horário de atendimento

## 🔄 Dados Mockados

Atualmente, o site usa dados fictícios definidos em `src/data/mockData.ts`:

```typescript
- products: Array<Product>         // 8 produtos de exemplo
- heroSlides: Array<HeroSlide>     // 3 slides do banner
- loopingTexts: Array<LoopingText> // 3 textos promocionais
```

## 🚀 Próximos Passos (Integração Supabase)

Consulte o arquivo `INTEGRATION.md` para instruções detalhadas sobre como integrar com Supabase/Lovable Cloud.

### Principais Mudanças Necessárias:

1. **Instalar dependências**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Criar tabelas no Supabase**:
   - `products`
   - `hero_slides`
   - `looping_texts`

3. **Criar serviços de API**:
   - `src/services/productsService.ts`
   - `src/services/heroService.ts`
   - `src/services/loopingTextsService.ts`

4. **Atualizar componentes**:
   - Substituir imports de `mockData` por chamadas de API
   - Usar React Query para gerenciar estado

5. **Implementar painel admin**:
   - Criar páginas admin protegidas
   - Formulários CRUD para produtos e slides
   - Upload de imagens para Supabase Storage

## 🎯 Funcionalidades Atuais

✅ Design system completo com tons rosa/rosê
✅ Header fixo com menu responsivo e texto em looping
✅ Hero banner com slides automáticos
✅ Catálogo de produtos com filtros
✅ Cards de produtos elegantes com hover
✅ Páginas institucionais (Sobre, Contato)
✅ Formulário de contato funcional
✅ Totalmente responsivo
✅ Scroll suave e botão voltar ao topo
✅ Ícones de diamante para luxo
✅ Animações e transições suaves
✅ Toast notifications
✅ Página 404 customizada

## 🎨 Customização

### Alterar Cores
Edite as variáveis CSS em `src/index.css`:

```css
:root {
  --primary: [nova cor HSL];
  --primary-rose: [nova cor HSL];
  /* ... */
}
```

### Adicionar Nova Variante de Botão
Edite `src/components/ui/button.tsx`:

```typescript
variant: {
  // ... variantes existentes
  minhaVariante: "classes tailwind aqui",
}
```

### Adicionar Novo Produto (Mock)
Edite `src/data/mockData.ts`:

```typescript
{
  id: "9",
  name: "Nome do Produto",
  description: "Descrição",
  price: 199.90,
  image: product9,
  category: "Categoria",
  isFeatured: false,
  isBestSeller: false,
}
```

## 📦 Tecnologias Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes base
- **React Router** - Roteamento
- **React Query** - State management (pronto para API)
- **Lucide Icons** - Ícones
- **Radix UI** - Componentes acessíveis

## 🔐 Segurança

- ✅ Validação de formulários client-side
- ✅ TypeScript para type safety
- ✅ Preparado para autenticação futura
- ⏳ Validação server-side (quando integrar Supabase)
- ⏳ RLS policies (quando integrar Supabase)

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎭 Acessibilidade

- Semântica HTML correta
- Labels em inputs
- Alt text em imagens
- Aria labels em botões
- Contrast ratio adequado

