# Change: Adicionar Google AdSense para Monetização

## Why
O TeAchei precisa de uma fonte de receita adicional além das assinaturas de vendedores. O Google AdSense permite monetizar o tráfego do site exibindo anúncios contextuais aos visitantes.

## What Changes
- Adicionar script do Google AdSense no `<head>` do layout principal (Next.js)
- Configurar via variável de ambiente para publisher ID
- Adicionar arquivo `ads.txt` para verificação do Google
- Carregar script apenas em produção para não impactar desenvolvimento

## Impact
- Affected specs: web-monetization (nova capability)
- Affected code: 
  - `teachei-web/app/layout.tsx` - adicionar Script do AdSense
  - `teachei-web/public/ads.txt` - arquivo de verificação
  - `teachei-web/.env.example` - documentar variável de ambiente
