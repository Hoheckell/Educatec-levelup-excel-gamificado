# Diretrizes de design: EducaTech Planilhas

## 1. Princípios visuais
O design da interface prioriza clareza, leitura confortável e facilidade de navegação para o estudante, sem artifícios visuais desnecessários ou elementos genéricos.

---

## 2. Tipografia e alinhamento
- **Interface e textos gerais**: fonte `Outfit`, escolhida pela boa legibilidade em títulos e instruções.
- **Células da planilha e fórmulas**: fonte `JetBrains Mono` com números tabulares (`tabular-nums`), garantindo alinhamento vertical exato entre linhas e colunas financeiras.
- **Tamanhos e pesos**:
  - Títulos de tela: 24px a 32px, em negrito.
  - Textos de instruções: 14px a 16px, com espaçamento confortável entre linhas.
  - Legendas e rótulos auxiliares: 11px a 12px, exibidos como texto simples com separadores discretos (`·`), sem cápsulas ou pílulas coloridas artificiais.

---

## 3. Cores e significado prático
- **Verde esmeralda (`#0f4a27`, `emerald-600`)**: associado ao ambiente do Excel, células com fórmulas válidas e itens concluídos no checklist.
- **Azul corporativo (`#0f2b48`)**: identidade visual da Canindé Distribuidora, usado na barra superior e no perfil do gerente Juvenildo.
- **Âmbar (`amber-400`, `amber-500`, com texto `text-amber-950`)**: sinaliza a segunda chance, as dicas do Zequinha e as moedas acumuladas. O texto sobre fundo âmbar sempre usa tom escuro para manter o contraste nítido e legível.
- **Indicadores de meta**:
  - Meta atingida: verde escuro (`text-emerald-800 dark:text-emerald-300`).
  - Abaixo da meta: vermelho sóbrio (`text-rose-700 dark:text-rose-300`).

---

## 4. Estrutura e espaçamento
- **Sem abas laterais pesadas**: evitamos bordas grossas unilaterais (`border-l-4`). O destaque de células auditadas usa contorno fino de 1px (`outline-1 outline-emerald-500/60`).
- **Profundidade simples**: apenas um nível de elevação visual por tela, organizando as seções por espaçamento e divisores finos.
- **Controles acessíveis**: botões com área de clique adequada e navegação clara por teclado.

---

## 5. Acessibilidade (WCAG 2.1 AA)
- **Modo alto contraste**: combinação de preto puro (`#000000`) com amarelo (`#ffff00`), facilitando a leitura para pessoas com baixa visão.
- **Anúncios para leitores de tela**: região `aria-live="polite"` que narra cada atualização de célula, inserção de fórmula ou mudança de tela.
- **Legendas na tela**: barra inferior com opções de tamanho de fonte (16px, 20px, 24px) e síntese de voz em português brasileiro.
- **Navegação completa por teclado na grade**: suporte às setas para movimentação, Enter para confirmar ou editar, Tab para avançar colunas e Escape para cancelar.
