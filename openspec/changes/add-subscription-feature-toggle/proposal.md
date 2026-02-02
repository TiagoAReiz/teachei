# Change: Bypass Subscription Check for Free Mode

## Why
O app está gratuito por agora. O frontend tem bypasses hardcoded, mas o **backend ainda oculta os dados de contato** (whatsapp, instagram = null) para usuários não-autenticados ou sem assinatura. Forçar `contatoOculto = false` no frontend não resolve pois os dados não vêm na resposta.

## What Changes

### Backend (fonte dos dados)
- Comentar a verificação de assinatura em `AnuncioController.java`
- Forçar `ocultarContato = false` sempre (com TODO para reverter)
- Contato sempre retornado completo na API

### Frontend (consistência visual)
- Usar `intention.contatoOculto` normalmente (vai ser `false` do backend)
- Remover os valores hardcoded `false` e `true` espalhados
- O CTA fixo vai funcionar corretamente

## Impact
- Affected specs: `subscription-toggle`
- Affected code: 
  - `TeAchei/src/main/java/com/teachei/api/adapter/in/web/controller/AnuncioController.java`
  - `teachei-web/app/intention/[id]/client.tsx`
