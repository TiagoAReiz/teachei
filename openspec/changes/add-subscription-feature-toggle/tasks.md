## 1. Backend - Bypass subscription check

- [x] 1.1 Em `AnuncioController.java`, comentar lógica de `ocultarContato` e forçar `false`
- [x] 1.2 Adicionar TODO: "Para cobrar assinatura, descomentar verificação"
- [x] 1.3 Testar que API retorna contato completo (whatsapp, instagram)

## 2. Frontend - Usar flag do backend consistentemente

- [x] 2.1 Substituir `{false && (...)}` por `{intention.contatoOculto && (...)}`
- [x] 2.2 Substituir `{true && (...)}` por `{!intention.contatoOculto && (...)}`
- [x] 2.3 Remover TODOs obsoletos
- [x] 2.4 Testar que contato está visível e CTA mostra "Enviar proposta"
