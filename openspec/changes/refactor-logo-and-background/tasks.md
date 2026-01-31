# Tasks: refactor-logo-and-background

## Checklist

### 1. Ajustar cor de background do app
- [x] 1.1 Alterar `--background` em `globals.css` para `#f8f6f0` (tom creme similar ao logo)
- [x] 1.2 Verificar contraste com elementos existentes (textos, borders)

### 2. Refatorar componente Logo
- [x] 2.1 Remover `bg-white` do container
- [x] 2.2 Aplicar `rounded-2xl` e `overflow-hidden` diretamente no container
- [x] 2.3 Manter padding adequado para espaçamento
- [x] 2.4 Adicionar `rounded-xl` na imagem para bordas arredondadas

### 3. Validar em todos os contextos
- [x] 3.1 Header principal (`header.tsx`) - usa componente Logo
- [x] 3.2 Landing page - header e footer usam componente Logo
- [x] 3.3 Auth layout - desktop e mobile usam componente Logo
- [x] 3.4 Página 404 - usa componente Logo

### 4. Favicon e PWA
- [x] 4.1 Criar `icon.tsx` para gerar favicon dinamicamente (64x64)
- [x] 4.2 Criar `apple-icon.tsx` para ícone Apple (180x180)
- [x] 4.3 Remover `favicon.ico` antigo (padrão Next.js)
- [x] 4.4 Atualizar `layout.tsx` para usar favicons gerados
- [x] 4.5 Atualizar `site.webmanifest` com cores corretas

### 5. Testes e validação
- [x] 5.1 Executar lint - sem erros
