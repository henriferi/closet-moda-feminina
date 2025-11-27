# Bibliotecas e Utilitários

Este diretório contém funções utilitárias e configurações de bibliotecas.

## Arquivos Atuais

- `utils.ts` - Funções utilitárias gerais (cn para classes CSS)

## Futura Integração

Quando conectar ao Supabase via Lovable Cloud, adicione:

- `supabase.ts` - Cliente configurado do Supabase

Exemplo:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```
