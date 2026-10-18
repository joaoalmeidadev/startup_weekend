# Tarefas

## Context
Projeto do Startup Weekend. O boilerplate técnico está pronto (Rails 7.2 + Inertia/React,
Devise, Sidekiq, Kamal). O negócio ainda não foi definido: veja `ai-notes/business.md`.
Este arquivo guarda só tarefas. Decisões e contexto de negócio ficam em `business.md`.

Estados: `- [ ]` pendente · `- [/]` em andamento · `- [x]` concluída
Detalhes de cada tarefa vão indentados com 4 espaços logo abaixo dela.

## Tasks

### Infra (antes do evento)

- [ ] Configurar o deploy no servidor
    Trocar todos os `CHANGE_ME` em `config/deploy.yml` (IP, domínio, registry).
    Exportar `KAMAL_REGISTRY_PASSWORD` e `POSTGRES_PASSWORD` e rodar `make deploy-setup`.
    Pronto quando o domínio abrir a home com HTTPS.

- [ ] Configurar e-mail de produção
    Ajustar `MAILER_SENDER` e o SMTP via ENV (adicionar em `App::Boot::EnvVars` e `deploy.yml`).

- [x] Traduzir as mensagens do Devise para pt-BR
    `rails-i18n` + `devise-i18n`, `config.i18n.default_locale = :"pt-BR"`.

### Negócio

- [x] Preencher `business.md`: problema, público e proposta de valor

- [x] Definir o escopo do MVP
    Listar em `business.md` (seção MVP) as 3 a 5 funcionalidades que provam a hipótese principal.
    Criar uma tarefa por funcionalidade em "MVP" abaixo.
    Feito: escopo na seção MVP do `business.md`; tarefas abaixo.

- [ ] Validar com clientes
    Registrar as entrevistas e os aprendizados em `business.md` (seção Validação).

### MVP

- [x] Perfis de usuário
    `User#role` (enum string): collaborator, hr, manager, platform_admin. `admin` continua só para o `/sidekiq`.
    Factory traits + model spec. Seeds: colaborador@, rh@, gestor@, admin@nivela.dev / password123.
    Feito: coluna `role` not null default "collaborator" + índice; traits :hr, :manager, :platform_admin.

- [x] Redirecionar pelo perfil depois do login
    `Users::HomePathResolver` (role → path) + spec; `after_sign_in_path_for`.
    Desligar o cadastro público (B2B por convite) e ajustar `devise_routes_spec`.
    Feito: colaborador → /collaborator/journey; RH/gestor/admin → /management/people (até existir o Início do RH).
    `/` manda visitante para o login e logado para a sua área; logout volta para o login.
    Guardas `Collaborator::BaseController` / `Management::BaseController`; páginas provisórias.

- [x] Design tokens do Stitch + layouts
    Feito: tokens do "Clareza Acolhedora" no `@theme` (fontes importadas em layer(base) para os ícones aceitarem tamanho), `Icon`,
    `CollaboratorLayout` (sidebar no desktop, navegação inferior no celular), `MockNoticeProvider`/`useMockNotice`, `Modal`.
    `ManagementLayout` + tema `.theme-management` (mesmos nomes de token, valores do "Functional Clarity").
    Escala única: `html { font-size: 87.5% }` (tudo em rem).
    A gestão usa outra paleta ("Functional Clarity"): sobrescrever as variáveis numa classe `.theme-management`.
    Portar o `tailwind.config` do export do Stitch para o `@theme` em `application.css`; fontes Plus Jakarta Sans + Material Symbols.
    `CollaboratorLayout` (nav: Jornada, Progresso, Perfil), `ManagementLayout` (sidebar + seletor de papel), `MockButton` ("Em breve").
    Guarda por perfil (`require_role`) nos controllers base `Collaborator::` e `Management::`.

- [x] Tela de login com o visual do Stitch
    Substituir `pages/users/sessions/new.tsx`. System spec: cada perfil cai na sua área; colaborador em `/management` é redirecionado.
    Feito no estilo da Minha jornada (card branco, botão tátil, mini-caminho Base → Empresa → Setor → Selo). Vitest + system spec.

- [ ] Telas do Stitch, uma por zip
    Zip extraído em `ai-notes/stitch/<area>/<nn-tela>/` (só referência, nada é executado).
    Por tela: rota + controller + `app/mocks/<area>/<tela>_mock.rb` (props fixas) + página + request spec + Vitest.
    Botões sem fluxo pronto usam `useMockNotice()` (toast "em breve").
    Mocks ficam em `app/mocks/<area>/` (autoload: reiniciar o servidor ao criar a pasta).
    Feito: colaborador — Minha jornada, Meu progresso, Meu perfil (idênticas ao Stitch; privacidade, lembrete e nome no ranking só em estado local).
    Feito: gestão — Pessoas (busca e filtro por setor), Meta do setor (réguas arrastáveis), Revisar lição da IA
    (`/management/lesson_reviews/:posição`; corrigir texto, aprovar → próxima lição, lição 8 publica o módulo).
    Ainda sem tela no Stitch: Início do RH, visão geral de Jornadas, Configurações, detalhe da pessoa, área do gestor e do admin Nivela.

- [x] Jornadas do lado do admin (mock)
    Jornadas (`/management/journeys`) → detalhe da jornada (trechos fixos, reordenar, adicionar da Biblioteca Nivela)
    → detalhe do módulo (`/management/modules/:id`, lições + avaliação final) → Revisar lição (já existia).
    Mocks em `app/mocks/management/{module,journey}_catalog.rb`. Criar módulo manual/IA e nova jornada são só simulação.

- [x] Lote 1 — ciclo do colaborador (mock)
    Boas-vindas `/collaborator/welcome` → Diagnóstico `/collaborator/diagnostic` → Resultado → Lição `/collaborator/lessons/:id`
    (vídeo → explicação → pergunta com dica → parabéns + selo). `FocusLayout` (X + barra fina). Perfil → "Refazer meu diagnóstico".

- [x] Lote 2 — Início do RH `/management` (RH/gestor/admin entram aqui) + Detalhe da pessoa `/management/people/:id`

- [x] Lote 3 — Criar módulo com IA `/management/modules/new` (3 passos), Configurações `/management/settings`,
    Avaliar colega `/collaborator/peer_review` (card de tarefa extra na Minha jornada)

- [x] Fechar o escopo de telas (mock)
    Colaborador: lista de lições do módulo `/collaborator/modules/:id`; jornada vazia (`?preview=empty`); aviso "Sem conexão" real.
    RH: Primeiros passos `/management/setup`; editor manual `/management/modules/new?mode=manual`;
    Mudar de função e Avaliar em `/management/people/:id/{role_change,review}`; Admin Nivela `/management/{companies,library}`.
    Botões: convidar (modal), exportar CSV real (`/management/people.csv`), trocar setor na Meta, alterar quem recebe.

- [x] Visão Gestor com dashboard (mock)
    "Gestor" no topo → `/management/team`: % nivelada (número principal), engajamento, tempo até nivelar,
    linha de nivelamento x meta, equipe x meta por competência, funil. "Minha equipe" = `/management/people?team=1`.
    Gráficos próprios em `app/frontend/components/charts/` (paleta validada pela skill dataviz; tooltip + "Ver tabela").
    Filtro de período (30 dias / 90 dias / 6 meses) via `?period=`; gestor tem nome próprio (Rafael Costa) e entra direto no dashboard.
    Login de demo: gestor@nivela.com / 12345678.

### Pitch

- [ ] Montar o pitch a partir de `business.md`
- [ ] Preparar a demo: dados de seed realistas e roteiro de cliques
- [ ] Deploy final e teste da demo em produção

### Depois do evento

- [ ] Recuperação de senha e editar conta
    Páginas React + specs + SMTP; depois reativar `:recoverable` e as rotas de registrations.

- [ ] Checkbox "lembrar de mim" no login (`:rememberable` já está ativo)

- [ ] Subir para Ruby 3.3+ e Rails 8
    Ruby 3.1 EOL mar/2025, Rails 7.2 EOL ago/2026. Remover `config/brakeman.ignore` depois.
