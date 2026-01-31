# Design: improve-logo-consistency

## Análise do Problema

A logo atual é uma imagem PNG com fundo creme/bege claro. Isso cria desafios em diferentes contextos:

| Contexto | Fundo | Problema |
|----------|-------|----------|
| Header principal | `bg-surface` (escuro em dark mode) | Logo com `rounded bg-white` destoa |
| Auth layout desktop | Imagem + overlay azul | Logo pode não contrastar |
| Auth layout mobile | Container branco | OK |
| Landing page | `bg-surface` | Sem tratamento |
| 404 page | `bg-background` | Usa logo antigo |
| Favicon | Guia do navegador | PNG com fundo pode não aparecer bem |

## Decisões de Design

### 1. Header Principal
**Decisão**: Remover o container `rounded bg-white` e deixar a logo direta no header.

**Justificativa**: 
- A logo já tem seu próprio fundo na imagem PNG
- O fundo creme da logo combina melhor diretamente no header
- Tamanho: `sm` no desktop (80x32), `xs` no mobile (60x24)

### 2. Auth Layout
**Decisão**: Manter container apenas no mobile onde já existe tratamento adequado.

**Desktop**: Logo `xl` direta sobre o fundo (o overlay escuro já dá contraste)
**Mobile**: Manter container existente com `bg-surface/90 backdrop-blur-sm`

### 3. Landing Page
**Decisão**: Logo direta sem container adicional.

**Header**: `md` (100x40)
**Footer**: `md` (100x40)

### 4. Página 404
**Decisão**: Substituir Car icon + texto pelo componente `Logo`.

### 5. Favicon
**Manter**: O favicon como está, pois a imagem PNG funciona adequadamente como ícone de guia.

## Tamanhos Padronizados

```
xs: 60x24   - Mobile header
sm: 80x32   - Desktop header
md: 100x40  - Landing page, footer, containers
lg: 140x56  - Destaque médio
xl: 180x72  - Auth layout destaque
```

## Alternativas Consideradas

1. **Criar versão da logo com fundo transparente**: Requer novo asset de design
2. **Adicionar container em todos os lugares**: Cria inconsistência visual
3. **Manter logo antiga em texto**: Inconsistente com a marca

## Riscos

- A logo PNG com fundo creme pode não combinar perfeitamente com todos os temas
- Solução: Se necessário no futuro, criar versão com fundo transparente
