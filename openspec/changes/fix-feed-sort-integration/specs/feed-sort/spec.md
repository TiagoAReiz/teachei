# Capability: Feed Sort - Delta

## MODIFIED Requirements

### Requirement: Feed URL Parameter Reading
A pagina do feed SHALL ler todos os parametros de filtro da URL e passa-los para a API.

#### Scenario: Sort parameter is read from URL
- **GIVEN** a URL com `?ordenar=PRECO_ASC`
- **WHEN** a pagina do feed carrega
- **THEN** a requisicao para a API SHALL incluir `ordenar=PRECO_ASC`
- **AND** os resultados SHALL estar ordenados por preco crescente

#### Scenario: Multiple filters are read from URL
- **GIVEN** a URL com `?tipo=CARRO&marca=23&ordenar=ANO_DESC`
- **WHEN** a pagina do feed carrega
- **THEN** a requisicao para a API SHALL incluir todos os parametros
- **AND** os resultados SHALL estar filtrados por tipo e marca
- **AND** os resultados SHALL estar ordenados por ano decrescente

#### Scenario: Filter parameters persist after sort change
- **GIVEN** usuario esta na pagina com filtros ativos `?tipo=CARRO&marca=23`
- **WHEN** usuario seleciona ordenacao por preco
- **THEN** a URL SHALL conter `?tipo=CARRO&marca=23&ordenar=PRECO_ASC`
- **AND** os filtros de tipo e marca SHALL permanecer ativos

#### Scenario: All filter parameters are passed to API
- **GIVEN** a URL com filtros completos:
  - `tipo=CARRO`
  - `marca=23`
  - `modeloCodigo=456`
  - `precoMin=10000`
  - `precoMax=50000`
  - `anoMin=2020`
  - `anoMax=2024`
  - `opcionais=AR_CONDICIONADO,DIRECAO_HIDRAULICA`
  - `ordenar=PRECO_DESC`
- **WHEN** a pagina do feed carrega
- **THEN** todos os parametros SHALL ser passados para a API
- **AND** os resultados SHALL refletir todos os filtros aplicados
