# Change: Adicionar Opcionais Específicos para Motos e Caminhões

## Why

Atualmente, o sistema possui opcionais focados exclusivamente em carros (ar condicionado, teto solar, vidros elétricos, etc.). Para atender compradores de motos e caminhões de forma adequada, é necessário adicionar opcionais específicos para cada tipo de veículo, melhorando a qualidade das intenções de compra e facilitando o matching com vendedores.

## What Changes

### Mudanças Estruturais

- **BREAKING**: Refatorar enum `OpcionalVeiculo` para incluir associação com tipo de veículo
- Adicionar campo `tiposVeiculo` no enum para indicar quais tipos suportam cada opcional
- Adicionar 17 novos opcionais específicos para MOTO
- Adicionar 12 novos opcionais específicos para CAMINHAO
- Atualizar frontend (mobile e web) para filtrar opcionais por tipo de veículo selecionado

### Mudanças de UX

- **Criação de Intenção**: Seção de opcionais só aparece APÓS selecionar tipo de veículo
- **Filtros do Feed**: Filtro de opcionais só aparece APÓS selecionar tipo de veículo
- Isso evita carregar todos os opcionais de uma vez e melhora a experiência do usuário

### Novos Opcionais - MOTO

| Código | Label PT-BR | Descrição |
|--------|-------------|-----------|
| PARTIDA_ELETRICA | Partida Elétrica | Sistema de ignição elétrica |
| INJECAO_ELETRONICA | Injeção Eletrônica | Sistema PGM-FI ou equivalente |
| FREIO_DISCO_DIANTEIRO | Freio a Disco Dianteiro | Disco na roda dianteira |
| FREIO_DISCO_TRASEIRO | Freio a Disco Traseiro | Disco na roda traseira |
| CBS | Freio Combinado CBS | Combined Brake System |
| CONTROLE_TRACAO | Controle de Tração | HSTC ou equivalente |
| PAINEL_DIGITAL | Painel Digital | Instrumentação digital/TFT |
| FAROL_LED | Farol LED | Iluminação full-LED |
| PORTA_USB | Porta USB | Carregador USB integrado |
| BAU_TRASEIRO | Baú Traseiro | Top case/baú |
| PROTETOR_MOTOR | Protetor de Motor | Proteção contra impactos |
| SLIDER | Slider de Proteção | Proteção de carenagem |
| BAGAGEIRO | Bagageiro | Suporte para bagagem |
| PARABRISA | Para-brisa | Defletor de vento |
| QUICKSHIFTER | Quick Shifter | Troca de marcha sem embreagem |
| MODOS_PILOTAGEM | Modos de Pilotagem | Riding modes selecionáveis |
| GPS_NAVEGACAO | GPS/Navegação | Sistema de navegação integrado |

### Novos Opcionais - CAMINHÃO

| Código | Label PT-BR | Descrição |
|--------|-------------|-----------|
| DIRECAO_ELETROHIDRAULICA | Direção Eletro-hidráulica | Assistência eletro-hidráulica |
| ASR | Controle de Aderência (ASR) | Anti-Slip Regulation |
| ESC | Controle de Estabilidade (ESC) | Electronic Stability Control |
| SUSPENSAO_PNEUMATICA | Suspensão Pneumática | Air suspension |
| CABINE_LEITO | Cabine Leito | Cabine com área de descanso |
| TOMADA_FORCA | Tomada de Força (PTO) | Power Take-Off |
| BLOQUEIO_DIFERENCIAL | Bloqueio de Diferencial | Differential lock |
| RETARDER | Freio Retarder | Freio auxiliar hidrodinâmico |
| TACOGRAFO_DIGITAL | Tacógrafo Digital | Registrador de jornada digital |
| SENSOR_FADIGA | Sensor de Fadiga | Sistema DSM de monitoramento |
| RASTREADOR | GPS/Rastreador | Sistema de rastreamento |
| AR_CONDICIONADO_TETO | Ar Condicionado de Teto | AC independente na cabine |

### Opcionais Universais (todos os tipos)

Mantidos: ABS, ALARME

### Opcionais Compartilhados CARRO + CAMINHÃO

- AR_CONDICIONADO
- DIRECAO_HIDRAULICA
- DIRECAO_ELETRICA
- CAMERA_RE
- MULTIMIDIA
- BLUETOOTH

### Opcionais Exclusivos CARRO

- VIDRO_ELETRICO
- TETO_SOLAR
- BANCOS_COURO
- SENSOR_ESTACIONAMENTO
- AIRBAG
- RODAS_LIGA
- PILOTO_AUTOMATICO

## Impact

- **Affected specs**: vehicle-optionals (novo), intention-creation, mobile-intention-creation, web-intention-creation
- **Affected code**:
  - `TeAchei/src/main/java/com/teachei/api/domain/model/OpcionalVeiculo.java`
  - `TeAchei/src/main/java/com/teachei/api/adapter/in/web/dto/response/FiltrosDisponiveisResponse.java`
  - `teachei-mobile/components/OptionalSelector.tsx` (se existir)
  - `teachei-web/components/OptionalSelector.tsx` (se existir)
- **Migration**: Nenhuma migração de dados necessária - opcionais existentes continuam válidos

## Referências da Pesquisa

### Fontes Consultadas
- Webmotors.com.br - Filtros e fichas técnicas de motos
- Sites especializados em caminhões (Foton, Mercedes-Benz Accelo)
- Fichas técnicas Honda (CB 500X, Hornet 750, PCX CBS)
- Documentação técnica de implementos rodoviários

### Opcionais mais buscados

**Motos:**
1. ABS / CBS (segurança)
2. Partida Elétrica
3. Injeção Eletrônica
4. Farol LED
5. Painel Digital
6. Baú Traseiro

**Caminhões:**
1. Ar Condicionado
2. Direção Hidráulica
3. Cabine Leito
4. ABS + ESC
5. Rastreador
6. Tacógrafo Digital
