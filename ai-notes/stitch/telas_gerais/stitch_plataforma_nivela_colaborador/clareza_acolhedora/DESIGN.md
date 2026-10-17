---
name: Clareza Acolhedora
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3f484a'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6f797a'
  outline-variant: '#bfc8ca'
  surface-tint: '#1f6870'
  primary: '#00454c'
  on-primary: '#ffffff'
  primary-container: '#0f5e66'
  on-primary-container: '#92d5de'
  inverse-primary: '#8fd1da'
  secondary: '#7d5700'
  on-secondary: '#ffffff'
  secondary-container: '#fdbb37'
  on-secondary-container: '#6e4c00'
  tertiary: '#00491c'
  on-tertiary: '#ffffff'
  tertiary-container: '#006328'
  on-tertiary-container: '#66e381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#abeef7'
  primary-fixed-dim: '#8fd1da'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#004f56'
  secondary-fixed: '#ffdea9'
  secondary-fixed-dim: '#fdbb37'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-lg-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

O design system baseia-se no princípio fundamental de **"Entender em 3 segundos"**. Criado especificamente para colaboradores adultos com letramento digital básico ou em desenvolvimento, ele substitui convenções de interfaces abstratas por affordances físicas óbvias, acolhimento visual e eliminação ativa de qualquer elemento decorativo dispensável.

### Pilares de Estilo
- **Acolhimento e Segurança Cognitiva:** Ausência total de microinterações ambíguas, gestos ocultos (swipe para ações críticas) ou sobrecarga sensorial. O usuário deve sentir que o sistema é estável, previsível e incapaz de ser "estragado" por um clique acidental.
- **Tato Visual Aumentado:** Botões e recipientes interativos usam áreas de toque expandidas e contornos perceptíveis que se destacam imediatamente do fundo.
- **Comunicação Direta:** Textos curtos, diretos e livres de jargões técnicos. Ícones nunca existem desacompanhados de texto descritivo correspondente.
- **Movimento e Estrutura:** Sem camadas de profundidade complexas ou efeitos vítreos. Utiliza-se um minimalismo acolhedor e tátil, apoiado em cartões de superfície pura sobre fundo quente e neutro.

## Colors

A paleta é rigorosamente semântica, reservando cores saturadas apenas para sinalizações inequívocas de função, conquista e validação.

### Papéis de Cor e Aplicação
- **Primary (`#0F5E66` - Azul-petróleo):** Destinado exclusivamente a ações afirmativas primárias (botões principais "Continuar", "Confirmar"), estados ativos de navegação e indicadores de fluxo linear/progresso de trilhas. Transmite estabilidade, profissionalismo e foco.
- **Secondary (`#E0A21B` - Âmbar Ouro):** Reservado estritamente para celebrações, conquistas, medalhas, selos e conclusão de etapas. Nunca deve ser usado para avisos de perigo ou alertas comuns.
- **Tertiary (`#16A34A` - Verde Confirmação):** Utilizado para estados de sucesso imediato, etapas completas com validação e ícones de confirmação (check).
- **Fundo da Aplicação (`#F7F8F6`):** Off-white acolhedor e relaxante que reduz a fadiga ocular e define contraste imediato com os blocos de conteúdo.
- **Superfície de Cartões (`#FFFFFF`):** Branco puro para elevar o conteúdo chave acima da base, delimitado com borda sutil de contraste (`#E2E8F0`).
- **Texto Principal (`#1E293B`):** Ardósia ultra-escuro para garantir contraste em conformidade com critérios AAA em todos os tamanhos de texto.
- **Texto Secundário (`#475569`):** Cinza médio-escuro com leitura nítida, preservado para instruções de apoio e legendas contextuais (nunca abaixo da relação 4.5:1).

## Typography

Para assegurar legibilidade instantânea para adultos com letramento digital inicial e variações de acuidade visual, o tamanho mínimo absoluto do corpo de texto neste design system é de **18px**.

### Regras de Composição
- **Fonte Única:** `Plus Jakarta Sans` é empregada em toda a experiência por seus caracteres abertos, diferenciação clara entre glifos (como `I`, `l` e `1`) e formas amigáveis e geométricas.
- **Comprimento de Linha e Parágrafos:** Parágrafos não devem ultrapassar 3 linhas ou 50 caracteres por linha. Evitar quebras de palavras com hífens.
- **Entrelinhamento Acentuado:** Alturas de linha amplas (mínimo de 1.5x) para evitar perda de foco durante a leitura.
- **Pesos Tipográficos Restritos:** Uso limitado aos pesos Regular (400), Semi-bold (600) e Bold (700) para criar hierarquia evidente sem ruído tipográfico.

## Layout & Spacing

A estratégia de layout adota um modelo de **fluxo vertical em coluna única**, priorizando dispositivos móveis e telas sensíveis ao toque.

### Princípios de Grid e Estrutura
- **Coluna Única Centrada:** Em smartphones e tablets, os fluxos de tarefa utilizam uma única coluna de largura máxima de 540px, evitando divisão de atenção visual ou deslocamentos horizontais de olhar.
- **Respiro entre Tarefas:** Espaçamento vertical generoso (`space-lg` ou `space-xl`) entre blocos de decisão para impedir toques errôneos em telas capacitivas comuns.
- **Margens de Toque Seguras:** As laterais contam com margem fixa de `1.25rem` (20px), garantindo que conteúdos interativos fiquem longe das extremidades físicas do aparelho.
- **Reflow Responsivo:** Em telas amplas (desktops ou totens), o conteúdo nunca se expande horizontalmente de forma elástica; permanece contido em um cartão centralizado para preservar a proporção de leitura.

## Elevation & Depth

A profundidade no sistema é resolvida através de **superfícies contrastantes e contornos nítidos**, e não por sombras escuras ou difusas, que costumam sujar a visão de aparelhos com brilho baixo ou telas de entrada.

### Camadas de Profundidade
1. **Piso Base (`#F7F8F6`):** O plano contínuo sobre o qual tudo repousa.
2. **Superfície Ativa (`#FFFFFF`):** Todos os itens clicáveis, formulários e cartões de instrução são renderizados em branco puro, destacados do piso com uma borda física de `1.5px` ou `2px` em cor `#E2E8F0`.
3. **Sombra Tátil Suave:** Somente nos botões primários e cartões clicáveis ativos, aplica-se uma sombra vertical curta e sólida: `0px 4px 0px #0A4349` (para botões primários) ou `0px 2px 4px rgba(15, 23, 42, 0.05)` (para cartões), conferindo aspecto físico de relevo pressionável.
4. **Camada de Foco:** Estados de seleção nunca dependem apenas de cor: ganham borda adicional de `3px` sólida na cor primária `#0F5E66`.

## Shapes

O sistema utiliza a classe visual **Rounded** com ênfase em cantos generosos (`rounded-2xl` / 16px a 20px) para transmitir proteção, cordialidade e acessibilidade ergonômica.

### Aplicação de Formas
- **Cartões e Módulos:** `16px` (`rounded-2xl`), eliminando arestas duras e reforçando o acolhimento visual.
- **Botões e Campos:** `16px` de raio de curvatura, harmonizando a silhueta externa dos botões com a pegada da mão.
- **Badges e Selos de Conquista:** Formas geométricas simples circulares (`rounded-full`) ou octogonais arredondados, nunca pontiagudos.

## Components

Todos os componentes são estruturados para responder à regra "tocar com certeza", oferecendo feedback visual imediato e rótulos semânticos sem abreviações.

### Botões
- **Altura Generosa:** Altura estrita entre `56px` (h-14) e `64px` (h-16). Área de toque integral em largura de bloco (`w-full`) para telas móveis.
- **Botão Primário:** Fundo `#0F5E66`, texto em `#FFFFFF` no tamanho `label-lg` (18px Semi-bold). Sempre acompanhado de ícone de direção à direita (ex.: seta clara para frente).
- **Botão Secundário:** Fundo `#FFFFFF`, borda de `2px` sólida `#0F5E66`, texto `#0F5E66`.
- **Estados de Pressionado:** Deslocamento vertical de `2px` para simular clique mecânico claro.

### Cartões (Cards)
- **Superfície:** Fundo `#FFFFFF`, borda delimitadora de `1.5px` `#E2E8F0`, padding interno de `space-lg` (1.75rem).
- **Sem Sobrecarga:** Cada cartão aborda estritamente uma ideia ou uma pergunta. Proibido agrupar múltiplos tópicos no mesmo elemento visual.

### Seletores (Checkboxes & Radios Grandes)
- **Tamanho Físico Mínimo:** Caixas de verificação e círculos de seleção medem `28px x 28px`.
- **Área de Seleção:** A linha inteira funciona como gatilho de seleção (mínimo de `64px` de altura de linha).
- **Estado Selecionado:** O cartão de fundo muda para uma tonalidade suave de ativação (`#E6F0F1`) com contorno de `2px` em `#0F5E66`, acompanhado de ícone de check em `#16A34A`.

### Campos de Entrada (Input Fields)
- **Altura e Tipografia:** Altura mínima de `56px`, texto digitado em `18px` (`#1E293B`).
- **Rótulos Externos Permanentes:** Rótulos sempre posicionados acima do campo, nunca flutuantes e nunca substituídos por placeholders transparentes.
- **Instrução de Apoio:** Texto auxiliar abaixo do campo em `#475569` (18px) explicando em termos práticos o dado esperado.

### Conectores e Indicadores de Progresso
- **Linear e Contínuo:** Indicador em trilha única com barras espessas (mínimo `10px` de altura).
- **Etapas Enumeradas:** Passos exibidos como bolhas numéricas legíveis ("Passo 1 de 4") em vez de porcentagens decimais ou barras abstratas.
- **Conexões Concluídas:** Preenchidas integralmente em azul-petróleo `#0F5E66` com ícone de confirmação em `#16A34A`.

### Selos e Conquistas
- **Destaque Festivo:** Medalhas circulares com fundo âmbar `#E0A21B`, ícones simples com alto contraste e mensagem direta ("Parabéns! Módulo concluído").