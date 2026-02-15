export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
  content: string; // Markdown content
  tags: string[];
}

export const guides: Guide[] = [
  {
    slug: "como-funciona-tabela-fipe",
    title: "Entenda a Tabela FIPE e como ela valoriza seu veículo",
    excerpt: "Descubra como a Tabela FIPE é calculada e por que ela é a principal referência de preços no mercado automotivo brasileiro.",
    coverImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop",
    date: "14 de Fevereiro, 2026",
    readTime: "5 min de leitura",
    tags: ["Mercado", "Dicas", "Preço"],
    content: `
## O que é a Tabela FIPE?

A Tabela FIPE (Fundação Instituto de Pesquisas Econômicas) é o principal índice de preços de veículos no Brasil. Ela expressa a média de preços de veículos no mercado nacional, servindo apenas como um parâmetro para negociações e avaliações.

Os preços efetivamente praticados variam em função da região, conservação, cor, acessórios ou qualquer outro fator que possa influenciar as condições de oferta e procura por um veículo específico.

## Como o cálculo é feito?

A FIPE coleta preços de veículos usados, seminovos e novos no mercado nacional. Após a coleta, são descartados os valores muito altos ou muito baixos (outliers) para evitar distorções. O restante forma a média que vemos mensalmente.

## Por que usar a FIPE na negociação?

1. **Referência Justa:** Evita que você pague muito caro ou venda muito barato.
2. **Seguros e IPVA:** A maioria das seguradoras e o governo utilizam a FIPE como base para indenizações e impostos.
3. **Ponto de Partida:** No TeAchei, incentivamos o uso da FIPE como ponto de partida. Se seu carro tem muitos acessórios ou está impecável, é justo pedir um valor acima da tabela.

## Dicas para Valorizar seu Carro

*   **Documentação em dia:** IPVA e licenciamento pagos valorizam o veículo.
*   **Histórico de Revisões:** Guarde notas fiscais de manutenções.
*   **Limpeza e Estética:** Um polimento e higienização podem aumentar o valor percebido em até 10%.
    `
  },
  {
    slug: "dicas-seguranca-compra-venda",
    title: "Dicas de segurança essenciais para comprar ou vender carros online",
    excerpt: "Proteja-se de golpes e garanta uma negociação tranquila com estas práticas recomendadas de segurança.",
    coverImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=1000&auto=format&fit=crop",
    date: "12 de Fevereiro, 2026",
    readTime: "4 min de leitura",
    tags: ["Segurança", "Negociação"],
    content: `
## Segurança em Primeiro Lugar

Negociar carros online é prático, mas exige cuidados. O TeAchei conecta as pontas, mas a negociação final acontece entre os usuários. Confira como se proteger.

## Para Vendedores

1. **Nunca entregue o documento de transferência em branco:** Só preencha e assine o DUT (Documento Único de Transferência) após confirmar o recebimento do dinheiro na sua conta.
2. **Cuidado com comprovantes falsos:** Sempre verifique seu extrato bancário pelo aplicativo ou site do banco antes de liberar o veículo. Não confie apenas na foto do comprovante enviado.
3. **Encontros em locais públicos:** Marque para mostrar o carro em shoppings, supermercados ou postos policiais durante o dia.

## Para Compradores

1. **Desconfie de preços muito baixos:** Se a oferta parece boa demais para ser verdade, provavelmente é golpe ou o carro tem problemas graves.
2. **Vistorie o veículo pessoalmente:** Nunca faça pagamentos antecipados "para segurar a compra" sem ver o carro.
3. **Cheque a procedência:** Consulte multas, restrições judiciais e se o veículo tem passagem por leilão.
4. **Laudo Cautelar:** Exija ou pague por um laudo cautelar. É um investimento pequeno perto da segurança que oferece.

## O Golpe do Intermediário

Fique atento se alguém pedir para não comentar o valor com a outra parte ou inventar histórias de que está comprando para quitar dívida de terceiros. **Negocie sempre diretamente com o dono do veículo.**
    `
  },
  {
    slug: "check-list-compra-usado",
    title: "O Checklist definitivo para avaliar um carro usado",
    excerpt: "Não sabe por onde começar? Use este checklist para não deixar passar nenhum detalhe na hora de avaliar um veículo.",
    coverImage: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop",
    date: "10 de Fevereiro, 2026",
    readTime: "7 min de leitura",
    tags: ["Mecânica", "Avaliação"],
    content: `
## Avaliação Externa

*   [ ] **Pintura:** Procure por diferenças de tonalidade, ondulações ou falhas no verniz.
*   [ ] **Alinhamento:** Verifique se as portas, capô e porta-malas fecham suavemente e se os vãos entre as peças são uniformes.
*   [ ] **Pneus:** Devem ter desgaste uniforme. Desgaste irregular indica problemas de suspensão ou alinhamento.
*   [ ] **Vidros:** Confira se todos têm a logomarca da montadora ou fabricante original.

## Avaliação Interna

*   [ ] **Odores:** Cheiro de mofo pode indicar infiltração ou enchente.
*   [ ] **Desgaste:** Volante, pedais e câmbio muito gastos em carros com baixa quilometragem podem indicar adulteração no odômetro.
*   [ ] **Elétrica:** Teste vidros, travas, ar-condicionado, som, luzes internas e externas.
*   [ ] **Luzes do Painel:** Ao girar a chave, todas as luzes devem acender e depois apagar. Se a luz do airbag ou injeção nunca acende, pode ter sido desativada para esconder falhas.

## Test Drive (Obrigatório)

*   [ ] **Motor:** Ligue o carro frio. Ouça se há barulhos metálicos ("tec tec").
*   [ ] **Fumaça:** Peça para alguém acelerar e olhe o escapamento. Fumaça azul (queima de óleo) ou preta (excesso de combustível) são maus sinais.
*   [ ] **Suspensão:** Passe em ruas irregulares. Barulhos secos indicam buchas ou amortecedores ruins.
*   [ ] **Freios:** O carro não deve puxar para os lados ao frear.

## Dica de Ouro

Leve sempre o carro ao **seu** mecânico de confiança antes de fechar negócio.
    `
  }
];
