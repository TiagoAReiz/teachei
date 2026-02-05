## 1. Atualizar Funções de Formatação

- [x] 1.1 Modificar `formatBrazilianPhoneInput` em `teachei-web/lib/utils.ts`:
  - Remover adição automática de "+55" quando usuário digita dígitos
  - Manter formatação visual apenas para números que já contêm +55
  - Se entrada não começa com +55, retornar entrada com formatação básica (apenas espaços/traços)

- [x] 1.2 Modificar `stripPhoneFormatting` em `teachei-web/lib/utils.ts`:
  - Não adicionar +55 automaticamente se não estava presente
  - Preservar o formato original do usuário (com ou sem +55)

- [x] 1.3 Revisar `isValidBrazilianPhone` e `getBrazilianPhoneError`:
  - Manter exigência de +55 na validação
  - Mensagem de erro deve guiar usuário a incluir o código do país

## 2. Verificar Páginas Afetadas

- [x] 2.1 Testar `settings/page.tsx`:
  - Campo WhatsApp não deve adicionar +55 automaticamente
  - Ao digitar "11999998888", deve aparecer "11999998888" (não "+55 (11) 99999-8888")
  - Validação deve exigir +55 ao salvar

- [x] 2.2 Testar `create/review/page.tsx`:
  - Campo telefone de contato não deve adicionar +55 automaticamente
  - Usuário deve digitar número completo incluindo +55

## 3. Ajustar Placeholder e Mensagens

- [x] 3.1 Atualizar placeholder do campo WhatsApp para indicar formato esperado
- [x] 3.2 Adicionar texto de ajuda claro sobre formato "+5511999998888"

## 4. Validação Final

- [x] 4.1 Testar fluxo completo de edição de perfil
- [x] 4.2 Testar fluxo completo de criação de intenção
- [x] 4.3 Verificar que números já salvos com +55 continuam funcionando
