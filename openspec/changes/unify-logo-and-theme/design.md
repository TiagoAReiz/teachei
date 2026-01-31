# Design: unify-logo-and-theme

## Análise da Cor da Logo

A logo TeAchei tem fundo creme/bege. Cores aproximadas:
- Creme claro: `#f5f5dc` (beige)
- Creme mais quente: `#faf8f5`
- Off-white: `#fffef9`

## Decisões

### 1. Nova cor de background
**Decisão**: Usar `#faf8f5` como cor de fundo do app

**Justificativa**:
- Tom creme muito suave que combina com o fundo da logo
- Não é amarelado demais, mantém aparência profissional
- Contraste adequado com texto escuro

### 2. Container da Logo
**Decisão**: Container com `rounded-2xl`, `bg-white`, `px-4 py-2`, `shadow-sm`

**Especificações**:
```css
.logo-container {
  background: white;
  border-radius: 1rem; /* rounded-2xl */
  padding: 0.5rem 1rem; /* py-2 px-4 */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
```

### 3. Tamanhos mantidos
- Header: `sm` (80x32)
- Mobile header: `xs` (60x24)
- Landing/Footer: `md` (100x40)
- Auth: `lg` ou `xl`

## Cores Atualizadas

```css
:root {
  --background: #faf8f5;  /* Era #f6f7f8 */
  --surface: #ffffff;      /* Mantido */
}

.dark {
  --background: #101922;  /* Mantido */
  --surface: #1e2936;     /* Mantido */
}
```

## Alternativas Consideradas

1. **Usar fundo branco puro**: Muito "frio", não combina com logo creme
2. **Usar tom mais amarelado**: Pode parecer "sujo" ou datado
3. **Remover fundo da logo**: Requer novo asset de design
