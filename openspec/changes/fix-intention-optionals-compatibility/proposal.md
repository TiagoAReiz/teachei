# Change: Corrigir seleção de opcionais incompatíveis na criação de intenções

## Why
Usuários estão recebendo erro 400 INVALID_INTENTION ao criar intenções porque opcionais incompatíveis (ex.: "Ar Condicionado de Teto" para CARRO) aparecem na criação. O backend valida compatibilidade por tipo e rejeita a intenção, indicando falha na seleção de opcionais no frontend.

## What Changes
- Remover o fallback para opcionais sem tipo quando o tipo já está selecionado na criação (web e mobile)
- Exibir estados de erro/vazio quando a API de opcionais por tipo falhar ou retornar vazio
- Garantir que a seleção de opcionais seja limpa quando a lista disponível não contém mais os itens selecionados

## Impact
- Affected specs: vehicle-optionals
- Affected code: teachei-web/app/create/specs/page.tsx, teachei-mobile/app/create/specs.tsx
