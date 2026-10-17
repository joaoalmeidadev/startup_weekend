# CLAUDE.md

Rails 7.2 (Ruby 3.1.7) + Inertia.js + React 19 (TypeScript, Vite, Tailwind 4) + PostgreSQL + Sidekiq/Redis + Devise, deploy com Kamal 2.

## Contexto do projeto
- `ai-notes/business.md` — proposta do negócio (problema, público, MVP, pitch, decisões). Leia antes de implementar features; o código deve servir à hipótese do MVP.
- `ai-notes/todo.md` — só tarefas. Use a skill `working-off-of-todo-files`.

## Comandos
- `make setup` — instala tudo, cria `.env`, prepara o banco
- `make dev` — web (3000) + vite + sidekiq + clockwork
- `make test` — RSpec + Vitest · `make test-rb` / `make test-js`
- `make lint` — StandardRB + ESLint + Prettier + `tsc`
- `make ci` — lint + brakeman + testes (rode antes de commitar)
- `make doctor` — checa Postgres, Redis, ENV
- `make deploy` — Kamal

## Arquitetura
- **Controllers são finos**: params → service → `render inertia:` / `redirect_to`. Controllers de páginas herdam de `InertiaController` (compartilha `current_user` e `flash`).
- **Regras de negócio** em `app/services/` (orquestração com ActiveRecord) ou `lib/app/` (domínio puro, namespace `App::`). Services retornam `App::Result.success(value)` / `App::Result.failure(:code, details)`.
- **Models**: persistência, associações e validações apenas.
- **Páginas Inertia**: o componente é inferido de `controller/action` → `app/frontend/pages/<controller>/<action>.tsx` (ex.: `HomeController#index` → `pages/home/index.tsx`).
- Componentes reutilizáveis em `app/frontend/components/`, layouts em `app/frontend/layouts/`, tipos compartilhados em `app/frontend/types/`.
- Erros de validação: re-renderize a página com 422 (`render inertia: "x/new", props: {errors: record.errors.to_hash}, status: :unprocessable_content`), como em `Users::RegistrationsController`. No React, `useForm` + `form.transform((data) => ({ model: data }))` para que as chaves de erro batam com os atributos.
- Jobs: ActiveJob com adapter Sidekiq; agendamentos em `config/clock.rb` chamando `perform_later`.
- Código usado no boot (initializers, `config/environments`) vive em `lib/app/boot/`, fora do autoload, e é carregado com `require` (o Rails 7 não autoloada em initializers).
- ENV sem default seguro: adicione em `App::Boot::EnvVars::REQUIRED` (`lib/app/boot/env_vars.rb`), `.env.example` e `config/deploy.yml`. Redis: use `App::Boot::RedisConfig#options_for` (nunca concatene o db na URL).
- Autorização admin: coluna `users.admin`; `/sidekiq` só para admins.
- Devise expõe só login, logout e cadastro (rotas limitadas em `config/routes.rb`). Logout limpa o histórico criptografado do Inertia (`clear_history`).

## Testes (TDD obrigatório)
- Escreva o teste antes. Bug fix começa com um teste que falha.
- Request specs com `:inertia` + `expect_inertia.to render_component(...)` / `include_props(...)`.
- System specs: `rack_test` por padrão; `:js` usa Chrome headless.
- Frontend: Vitest + Testing Library, arquivos `*.test.tsx` ao lado do componente; mocke `@inertiajs/react` quando usar `usePage`.

## Convenções
- Identificadores sempre em inglês; textos da UI podem ser pt-BR.
- Métodos pequenos (5–15 linhas), nomes que revelam intenção, instance methods.
- Ruby: StandardRB (sem `.rubocop.yml`). JS/TS: ESLint + Prettier (sem ponto e vírgula, aspas simples).

## Gotchas
- Ruby 3.1 é EOL e trava Rails em 7.2; Sidekiq fixado em `~> 7.3` (8.x exige Ruby 3.2).
- `typescript` fixado em `~5.9` e `eslint` em `^9` (typescript-eslint / eslint-plugin-react ainda não suportam TS 7 / ESLint 10).
- `.standard.yml` sem `parallel` — o fork quebrou no macOS.
- Ruby 3.1 vem com Bundler 2.3, que não entende `ruby file:`; `bin/setup` e o Dockerfile instalam o Bundler do `Gemfile.lock`.
- Devise: `http_authenticatable_on_xhr = false` é necessário para requests Inertia (senão 401 em vez da página de login).
