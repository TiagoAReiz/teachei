# Change: Corrigir Opcionais Dinâmicos nos Filtros e Formatação de Telefone

## Why

Existem problemas críticos de UX que afetam a qualidade da experiência do usuário:

1. **Opcionais nos filtros (Web)**: O painel de filtros (`filter-panel.tsx`) usa uma lista estática de opcionais (`vehicleOptions`) ao invés de buscar da API baseado no tipo de veículo selecionado. Isso significa que mostra os mesmos opcionais independente se o usuário filtrar por CARRO, MOTO ou CAMINHAO.

2. **Opcionais nos filtros (Mobile)**: O mobile não tem filtro de opcionais - apenas chips de tipo de veículo.

3. **Formatação de telefone**: A função `formatBrazilianPhoneInput` não adiciona separadores visuais (parênteses, traços) conforme o usuário digita. O usuário espera ver `+55 (11) 99999-8888` mas vê apenas `+5511999998888`.

## What Changes

### 1. Web Filter Panel - Opcionais Dinâmicos
- Substituir uso de `vehicleOptions` estático por dados da API `filteredOptions.opcionais`
- Condicionar exibição de opcionais à seleção de um tipo de veículo
- Limpar opcionais selecionados ao trocar tipo de veículo (já implementado em `handleTipoChange`)

### 2. Mobile Feed - Adicionar Filtro de Opcionais
- Criar componente de filtros expandido para mobile (drawer ou modal)
- Incluir seleção de opcionais baseado no tipo de veículo selecionado
- Usar API `vehiclesService.getOpcionais(tipoVeiculo)` já existente

### 3. Formatação de Telefone com Separadores Visuais
- Atualizar `formatBrazilianPhoneInput` para formatar como `+55 (XX) XXXXX-XXXX`
- Progressivamente adicionar separadores conforme usuário digita:
  - `+55` → `+55 (`
  - `+55 (11` → `+55 (11) `
  - `+55 (11) 99999` → `+55 (11) 99999-`
  - `+55 (11) 99999-8888` → formato completo
- Manter validação que ignora separadores (já funciona com regex)
- Implementar no mobile também (`teachei-mobile`)

## Investigação: Problemas com Fotos

O usuário reportou problemas com:
1. **Remoção de foto de perfil**: Revisão do código mostra implementação correta (`removerFoto: true` → backend deleta do Blob e limpa campos)
2. **Upload de fotos de intenção**: Código parece correto - base64 é enviado e backend faz upload para Blob

**Ação**: Verificar logs do backend para identificar se:
- Azure Blob Storage está configurado corretamente
- `blobServiceClient` está sendo inicializado
- Há erros silenciosos no upload/delete

Se problemas forem encontrados, criar proposta separada para corrigir integração com Azure Blob Storage.

## Impact

- **Affected specs**: feed-filters, mobile-filters, phone-formatting
- **Affected code**:
  - `teachei-web/components/layout/filter-panel.tsx` - Substituir vehicleOptions por API
  - `teachei-web/lib/utils.ts` - Atualizar formatBrazilianPhoneInput
  - `teachei-mobile/utils/format.ts` - Adicionar formatBrazilianPhoneInput
  - `teachei-mobile/app/(auth)/register.tsx` - Aplicar formatação
  - `teachei-mobile/components/layout/` - Novo componente de filtros avançados
- **Migration**: Nenhuma - mudanças apenas de UX
