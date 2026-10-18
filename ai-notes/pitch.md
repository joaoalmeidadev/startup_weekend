# Pitch Nivela — roteiro

> Pitch de ~5 min: fala (abertura) → vídeo (75s) → demo ao vivo (~2 min) → modelo + pedido.
> Antes de subir: `make dev` rodando, `bin/rails db:seed`, abas abertas já logadas (ver "Preparação").

## 1. Abertura falada (30s)
"Ouvimos 16 empresas na última semana. Em 62% delas, funcionário com dificuldade em coisa básica — interpretar uma
instrução, escrever para o cliente, resolver um problema simples — aparece toda semana ou todo mês. E sabe o que elas
fazem? O gestor para o que está fazendo e corrige. Quem aqui já foi o 'veterano' que teve que explicar tudo de novo para o novato? Toda vez que entra alguém,
alguém para o que está fazendo para ensinar. O mesmo treinamento, repetido de pessoa para pessoa — e o gestor
perde horas nisso todo mês. Pior: cada um aprende de um jeito, e ninguém mede se aprendeu."

## 2. Vídeo (89s) — `~/Desktop/nivela-pitch.mp4`
Pesquisa (16 empresas, 62%, gestor corrige, retrabalho 56%) → repetição de pessoa para pessoa → "Grave uma vez. Nivele
todos." → módulos prontos Nivela → 3 fatias → dashboard ("Agora sabem") → "16 empresas ouvidas · 11 querem testar".
Se usar o vídeo, a abertura falada pode ser mais curta (o vídeo já traz os números).
Fale por cima só se quiser; o vídeo se sustenta sozinho.

## 3. Demo ao vivo (~2 min) — as 3 fatias + dashboard

### Fatia 3 primeiro: o cadastro do conteúdo (Administrador — `admin@nivela.com` / `12345678`)
1. **Dashboard** abre direto. "Isto é a prova de que funciona: a equipe foi de 48 para 79 pontos, nivela em 46 dias em vez
   de ~90." Aponte o card **Quanto a Nivela já devolveu**: "Em 6 meses, R$ 6.365 de treino e R$ 3.120 de retrabalho a
   menos; tirando prêmios e a mensalidade, sobram **R$ 8.005** — cada R$ 1 investido voltou R$ 6,4."
2. **Biblioteca** (o que existe). Clique no filtro **Produtos Nivela**: "Sem material? A Nivela já vem com 12 módulos
   para qualquer setor — os mais citados na nossa pesquisa."
2b. Abra **Atendimento ao Cliente: Fundamentos**: "As lições vêm em vídeo, áudio, infográfico e texto — esta é uma aula
   básica do Sebrae, patrocinador do evento." Abra a lição e mostre o **gabarito** e "% da equipe acerta de primeira".
3. **+ Novo conteúdo**: "Um formulário só: o conteúdo em cima, de onde vem embaixo." "Usar o arquivo de exemplo" →
   **Gerado por IA** já marcado → **Criar lições com IA** → **Revisar lições**: "À esquerda o manual, à direita o que o
   funcionário vai ver. Nada vai para a equipe sem a minha aprovação." (Atalho: `/management/lesson_reviews/8` →
   "Aprovar e salvar na Biblioteca".)
4. **Jornadas** → **+ Nova jornada**: nome, tipo (**Base**, **Empresa** ou **Setor**) e quem recebe (setores e grupos ou
   pessoas específicas) → **Criar e escolher conteúdos**. "A Biblioteca alimenta; a jornada decide quem recebe."
5. No montador (**Atendimento na prática**): à esquerda a Biblioteca, à direita "Como o participante vê". Adicione um
   conteúdo e mostre a **Calculadora da jornada** mudar: "9 h de treino substituídas, R$ 275 economizados" — com a conta
   à vista: cada etapa usa quem daria aquele treino (supervisora R$ 25/h, analista R$ 15/h) + quem aprende. O gestor vê horas e R$; pontos são do colaborador.
   Edite as horas de uma etapa ou digite pontos manuais para mostrar que o admin controla.
6. **Setores** → **Staff** (grupo): "Cada setor tem as suas pessoas e a sua meta. Grupos juntam gente de setores
   diferentes." Meta começa num nível de mercado — Fácil, Médio, Difícil — e ajusto por competência. Se der tempo,
   **+ Novo setor** mostra os 3 blocos: nome, pessoas, meta.
7. **Setores** → **Custo do treino da empresa**: "Eu informo o salário de quem ensina e de quem aprende; 1 h de treino
   custa R$ 30." Em **Recompensas** → **Calcular pontuação**: "Quem estuda ganha a própria hora × 40%: com salário de
   R$ 2.200, 4 pts por hora. 1 ponto = R$ 1." No detalhe da Maria: "8 h estudadas × R$ 9,50/h × 40% = 30 pts".

### Fatia 1: o novo funcionário chega (`novo@nivela.com` / `12345678`, celular ou janela estreita)
5. Boas-vindas → **Começar** → responda as 4 perguntas do diagnóstico → **Ver meu resultado**.
   "Em 2 minutos sabemos o que ele já sabe e montamos uma jornada só com o que falta."

### Fatia 2: o colaborador (`colab@nivela.com` / `12345678`, celular ou janela estreita)
6. **Início**: "38 pts, 3 dias seguidos e a próxima etapa valendo +23 pts." **Continuar** → vídeo → explicação → erre
   de propósito (dica) → acerte → **Parabéns, +23 pontos**. "5 minutos por dia, sem depender de ninguém para explicar."
7. **Jornadas**: "Ela está em três, mas faz uma por vez e escolhe a ordem" → **Começar esta** em Atendimento na prática.
8. **Prêmios**: verde é o que dá para trocar, cinza mostra quanto falta → **Resgatar** a Barra de chocolate →
   "Pedido enviado ao RH" e o saldo baixa.
9. **Compartilhar** → **Propor uma jornada**: "Quem sabe ensina. A Maria propõe uma jornada com o que sabe; se o RH
   aprovar, ela ganha pontos pelas horas de treino que poupou."

### Volta ao admin: Aprovações
10. **Aprovações** (com o contador): abra **Como conferir uma devolução** (Carla): lições com gabarito e
    "3 h × R$ 12/h × 40% = 14 pts" — o gestor ajusta e **Aprovar e criar a jornada**. "O conhecimento que estava só na
    cabeça da veterana vira documentação da empresa."

### Volta ao admin: Setores e Dashboard
8. **Setores** → **Atendimento**: "Cada pessoa do setor numa linha: progresso, nota contra a meta, quando estudou e a
   previsão de quando nivela — filtre por **Atrasados** e quem precisa de ajuda aparece na hora."
9. **Dashboard** → **Na prática**: "E o gestor viu no dia a dia: retrabalho dos novatos caiu 38%." Troque para **Últimos 30 dias** e mostre que os números acompanham o período.

## 4. Modelo e pedido (45s)
- Tração: **16 empresas responderam a pesquisa e 11 aceitaram conversar** — é a fila de pilotos.
- SaaS B2B: assinatura por colaborador ativo/mês.
- Próximo passo: **empresas piloto** com alta contratação operacional (atendimento, logística, varejo).
- "Se a sua empresa repete o mesmo treinamento todo mês, fale comigo hoje."

## Preparação (10 min antes)
- `cd ~/projects/startup_weekend/app && make dev` (http://localhost:3000) e `bin/rails db:seed`.
- `bin/demo_check` — tem que terminar com "Tudo pronto para a demo."
- Janela 1 (admin) logada no Dashboard; janela 2 estreita (novo@) na tela de login; janela 3 (colab@) no Início.
- Zoom do navegador em 110–125% se o projetor for pequeno.
- Vídeo aberto no QuickTime, em tela cheia, pausado no início.

## Plano B
- Se o app travar: o vídeo já mostra as 3 fatias e o dashboard — siga a fala em cima dele.
- Se o login falhar: `bin/rails db:seed` recria os usuários.
- Se o diagnóstico do `novo@` já tiver sido feito (sessão marcada): saia e entre de novo (a sessão é zerada no logout).
