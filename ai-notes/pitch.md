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
1. **Dashboard** abre direto. "Isto é o que o gestor vê: quanto da equipe já está nivelada e quem precisa de atenção."
2. **Biblioteca** (o que alimenta as jornadas). Mostre a faixa "Como o conteúdo chega ao colaborador" (IA · Produtos Nivela · Empresa) e o bloco
   **Produtos Nivela**: "Sem material? A Nivela já vem com 12 módulos para qualquer setor — os mais citados na nossa pesquisa."
3. **Jornadas** → abra **Onboarding Atendimento** (montador). "A Biblioteca alimenta; a jornada é o que o colaborador percorre." Leia o topo: "Esta jornada substitui ~23h de repasse por novato, ≈ R$ 920
   por contratação." À direita: "é exatamente o que o colaborador vê". Adicione um produto Nivela e mostre o valor mudar.
4. Volte à **Biblioteca** → **+ Novo conteúdo** → "Enviar material → a IA cria as lições" → "Usar o arquivo de exemplo" → **Criar lições com IA**.
5. **Revisar lições**: "À esquerda o manual, à direita o que o funcionário vai ver. Nada vai para a equipe sem a minha
   aprovação." (Atalho: `/management/lesson_reviews/8` → "Aprovar e escolher quem recebe".)
6. **Publicar**: "Setor Atendimento" e "Novatos" já marcados → **Publicar**.
7. (Se perguntarem da meta) aba **Meta do setor**: "Começa num nível de mercado — Fácil, Médio, Difícil — e eu ajusto
   por competência; a marca cinza é a referência dos meus veteranos."

### Fatia 1: o novo funcionário chega (`novo@nivela.com` / `12345678`, celular ou janela estreita)
5. Boas-vindas → **Começar** → responda as 4 perguntas do diagnóstico → **Ver meu resultado**.
   "Em 2 minutos sabemos o que ele já sabe e montamos uma jornada só com o que falta."

### Fatia 2: a jornada (`colab@nivela.com` / `12345678`)
6. **Minha jornada** → **Continuar aula** → vídeo → explicação → erre de propósito (dica) → acerte → **Parabéns + selo**.
   "5 minutos por dia, sem depender de ninguém para explicar."

### Volta ao admin: Pessoas e Dashboard
8. **Pessoas**: "Uma linha por pessoa: progresso, nota contra a meta, quando estudou e a previsão de quando nivela —
   quem está atrasado aparece na hora."
9. **Dashboard** → período **Últimos 30 dias**. "O gestor acompanha a evolução sem perguntar a ninguém."

## 4. Modelo e pedido (45s)
- Tração: **16 empresas responderam a pesquisa e 11 aceitaram conversar** — é a fila de pilotos.
- SaaS B2B: assinatura por colaborador ativo/mês.
- Próximo passo: **empresas piloto** com alta contratação operacional (atendimento, logística, varejo).
- "Se a sua empresa repete o mesmo treinamento todo mês, fale comigo hoje."

## Preparação (10 min antes)
- `cd ~/projects/startup_weekend/app && make dev` (http://localhost:3000) e `bin/rails db:seed`.
- `bin/demo_check` — tem que terminar com "Tudo pronto para a demo."
- Janela 1 (admin) logada no Dashboard; janela 2 estreita (novo@) na tela de login; janela 3 (colab@) na Minha jornada.
- Zoom do navegador em 110–125% se o projetor for pequeno.
- Vídeo aberto no QuickTime, em tela cheia, pausado no início.

## Plano B
- Se o app travar: o vídeo já mostra as 3 fatias e o dashboard — siga a fala em cima dele.
- Se o login falhar: `bin/rails db:seed` recria os usuários.
- Se o diagnóstico do `novo@` já tiver sido feito (sessão marcada): saia e entre de novo (a sessão é zerada no logout).
