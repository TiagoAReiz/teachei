# Change: Remover Prefixo +55 Automático do Campo de Telefone

## Why

A função `formatBrazilianPhoneInput` adiciona automaticamente o prefixo "+55" quando o usuário começa a digitar qualquer dígito (ex: digitar "1" resulta em "+55 (1"). Este comportamento foi adicionado anteriormente mas está causando confusão para os usuários, que esperam digitar o número completo incluindo o código do país se desejarem.

O problema ocorre em dois lugares:
1. **Edição de perfil (Settings)**: Ao editar o WhatsApp, o +55 é adicionado automaticamente
2. **Criação de intenção (Review)**: No input de telefone de contato, o mesmo comportamento ocorre

## What Changes

### Frontend (teachei-web)

1. **lib/utils.ts**:
   - Remover adição automática de "+55" na função `formatBrazilianPhoneInput`
   - Permitir que o usuário digite o número no formato que preferir
   - Manter apenas a formatação visual (espaços, parênteses, traços) para números que JÁ incluem +55
   - Ajustar `stripPhoneFormatting` para não adicionar +55 automaticamente

2. **Validação**:
   - Manter a validação que EXIGE o formato brasileiro (+55...)
   - O erro de validação deve orientar o usuário a incluir o +55 se não incluiu

### Impacto nas páginas

- `app/(main)/settings/page.tsx` - Usa `formatBrazilianPhoneInput` via onChange
- `app/create/review/page.tsx` - Usa `formatBrazilianPhoneInput` no input de telefone

## Impact

- Affected specs: phone-formatting (modifica comportamento existente)
- Affected code:
  - `teachei-web/lib/utils.ts` - formatBrazilianPhoneInput, stripPhoneFormatting
- Migration: Nenhuma - apenas mudança de comportamento de UI
