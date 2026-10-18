# Proposta do negócio

> Fonte de verdade do negócio: decisões de produto e de código devem ser coerentes com ele.
> Tarefas ficam em `ai-notes/todo.md`.

**Nome:** Nivela (provisório)
**Pitch em uma frase:** Ajudamos empresas a levar cada colaborador ao nível de quem já faz bem o trabalho ali dentro, por meio de jornadas de microlições medidas contra uma régua tirada dos próprios veteranos.
**Última atualização:** 2026-10-17

## Time

| Nome | Papel | Foco no fim de semana |
| --- | --- | --- |
| JV | Dev / produto | App (Rails + React) e pitch |

## Problema

- Diploma não garante base: na nossa pesquisa (16 empresas), metade teve funcionário com dificuldade em tarefa básica no último ano, e em 62% o problema aparece toda semana ou todo mês (ver `pesquisa-validacao.md`).
- A formação não ensina as soft skills que o trabalho cobra (comunicação, postura, trabalho em equipe).
- Hoje o nivelamento é improvisado: o veterano ensina o novato do jeito dele, a cultura se perde e ninguém mede se funcionou.

## Público-alvo

- **Cliente (quem paga):** RH de pequenas e médias empresas.
- **Usuário (quem usa):** colaboradores (muitos com baixa escolaridade e pouca intimidade com tecnologia), gestores de setor e RH.
- **Early adopters:** empresas com alto volume de contratação operacional (atendimento, logística, varejo).

## Solução

Plataforma web com uma **jornada** de módulos em 3 trechos:
1. **Base** (biblioteca da plataforma): soft skills, raciocínio lógico, matemática básica, português e escrita.
2. **Empresa**: cultura, valores e processos. A empresa envia os materiais dela e a IA gera microlições em linguagem simples. Nada é publicado sem aprovação do RH.
3. **Setor**: módulos customizados por setor/cargo.

O colaborador faz um diagnóstico, recebe uma jornada só com o que falta, aprende em microlições de 5 min e ganha o selo "Nivelado" ao atingir a **meta do setor**.

## Proposta de valor

O padrão da sua empresa em cada colaborador, com prova de que ele chegou lá.

## Concorrentes e alternativas

| Alternativa | O que faz bem | Onde falha | Nosso diferencial |
| --- | --- | --- | --- |
| Veterano ensinando o novato | Conhecimento real da empresa | Não escala, não mede, depende de quem ensina | Captura o padrão dos veteranos e mede todos contra ele |
| LMS corporativos | Distribuir cursos | Complexos, genéricos, sem nivelamento da base | Diagnóstico + jornada personalizada + linguagem simples |
| Cursos genéricos (EAD) | Conteúdo pronto | Não conhecem a cultura nem o processo da empresa | Camadas Empresa e Setor geradas do material do cliente |

## Modelo de receita

- Quem paga, quanto e com que frequência: SaaS B2B, assinatura mensal por colaborador ativo (valor a definir).
- Custos principais: IA para gerar conteúdo, hospedagem e produção da biblioteca base.

## Hipóteses a validar

| # | Hipótese | Como validar | Resultado |
| --- | --- | --- | --- |
| 1 | O RH quer medir o nivelamento, não só distribuir treinamento | Entrevistas com RH durante o evento | |
| 2 | Uma régua tirada dos veteranos é mais confiável para o RH que uma prova genérica | Mostrar a tela "Meta do setor" para os entrevistados | |
| 3 | O colaborador de baixa escolaridade completa microlições de 5 min sem ajuda | Teste de usabilidade da jornada | |

## Validação

| Data | Com quem | O que aprendemos |
| --- | --- | --- |
| 2026-10-17 | 16 empresas (formulário) | Metade teve o problema no último ano; 62% veem toda semana/mês; retrabalho em 56%; gestor corrige na hora; ninguém mede o custo; 11 de 16 topam conversar. Detalhes em `pesquisa-validacao.md` |

## MVP

**Hipótese principal que o MVP prova:** o RH entende e confia na ideia de "jornada até a meta do setor", e o colaborador consegue percorrer a jornada sozinho.

**Dentro do escopo:**
1. Login único que leva cada perfil (colaborador, RH, gestor, admin Nivela) para a sua área.
2. Jornada do colaborador: diagnóstico → resultado → jornada → módulo → lição → selo.
3. Gestão: início do RH, pessoas, jornadas, revisão de lição gerada por IA, meta do setor.
4. Gestor: minha equipe e detalhe da pessoa.
5. Telas navegáveis com dados de exemplo (botões ainda mockados).

**Fora do escopo** (não fazer neste fim de semana):
- Geração real por IA, upload de arquivos, avaliação 360 real, cobrança.
- Candidatos/pré-contratação, app mobile nativo, WhatsApp.

**Fluxo principal do usuário:**
1. A colaboradora entra, faz o diagnóstico e vê o que já sabe e o que vai aprender.
2. Ela segue a jornada, conclui uma lição e ganha pontos e um selo.
3. A RH entra, vê quem precisa de atenção, revisa uma lição gerada pela IA e ajusta a meta do setor.

## Métricas

- Métrica principal de sucesso: % de colaboradores nivelados por setor.
- Outras métricas: tempo até o nivelamento, sequência diária ativa, taxa de aprovação das lições da IA.

## Pitch

- **Gancho / abertura:** das 16 empresas que ouvimos, em 62% o problema aparece toda semana ou todo mês — e a solução de hoje é o gestor corrigir na hora.
- **Problema:** diploma não garante base, e o nivelamento hoje é improvisado e não é medido.
- **Solução + demo:** jornada Base → Empresa → Setor; demo do colaborador e do RH.
- **Mercado:** PMEs com contratação operacional.
- **Modelo de negócio:** SaaS por colaborador ativo/mês.
- **Tração / validação:** entrevistas do fim de semana.
- **Time:** JV.
- **Pedido / próximos passos:** empresas piloto.

## Decisões

| Data | Decisão | Motivo |
| --- | --- | --- |
| 2026-10-17 | Sem fluxo de candidato; foco do onboarding em diante | Simplifica o escopo e evita LGPD de candidatos |
| 2026-10-17 | Meta do setor = benchmark dos veteranos + ajuste do gestor | É o diferencial: padrão real da empresa, e não uma prova genérica |
| 2026-10-17 | Conteúdo de IA só é publicado com aprovação humana | Evita erro factual sobre a empresa |
| 2026-10-17 | Ranking com opção de anônimo ou oculto | Não expor quem começou atrás |
| 2026-10-17 | Design clean centrado na jornada | Público com pouca intimidade com tecnologia |
| 2026-10-17 | Web (Rails + Inertia/React); dados mockados nos controllers até o MVP | Velocidade no evento; troca por models sem mexer no React |
| 2026-10-17 | Jornada é livre (criada pelo RH), mas os trechos são fixos: Base → Empresa → Setor | Flexível para o RH (onboarding, promoção) sem perder a identidade do produto |
| 2026-10-17 | Jornada chega por setor, por pessoa ou automática para novatos; uma jornada ativa por pessoa | O colaborador vê um caminho só; as outras entram na fila |
| 2026-10-17 | Módulos ficam numa biblioteca e são reutilizáveis; Base = catálogo Nivela (escolhe, não edita) | Corrigir num lugar corrige em todas as jornadas |
| 2026-10-17 | Módulo = lições + avaliação final; cada módulo treina uma competência; cada jornada tem meta e selo | A nota da avaliação alimenta a régua da competência |
| 2026-10-17 | Ordem sequencial; o diagnóstico permite pular módulos | Ninguém refaz o que já domina |
| 2026-10-17 | RH e gestor com as mesmas permissões no MVP | Simplicidade |
