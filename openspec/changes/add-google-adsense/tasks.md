# Tasks: Adicionar Google AdSense

## 1. Configuração do AdSense

- [ ] 1.1 Adicionar variável `NEXT_PUBLIC_ADSENSE_ID` no `.env.example`
- [ ] 1.2 Criar arquivo `ads.txt` em `public/` com publisher ID
- [ ] 1.3 Adicionar Script do AdSense no `layout.tsx` usando `next/script`
- [ ] 1.4 Configurar para carregar apenas em produção

## 2. Validação

- [ ] 2.1 Verificar que o script é carregado corretamente em build de produção
- [ ] 2.2 Confirmar que não carrega em ambiente de desenvolvimento
