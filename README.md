# App

Boilerplate Rails + React (Inertia.js) pronto para começar um produto do zero.

| Camada | Stack |
| --- | --- |
| Backend | Ruby 3.1.7, Rails 7.2, PostgreSQL |
| Frontend | Inertia.js, React 19, TypeScript, Vite, Tailwind CSS 4 |
| Auth | Devise (login/cadastro em React) |
| Jobs | Sidekiq + Redis, Clockwork para agendamentos |
| Testes | RSpec, FactoryBot, Capybara (Chrome headless), Vitest + Testing Library |
| Qualidade | StandardRB, Brakeman, ESLint, Prettier, `tsc` |
| Deploy | Docker + Kamal 2 (kamal-proxy com SSL, Postgres e Redis como accessories) |

> ⚠️ Ruby 3.1 está em fim de vida (sem patches de segurança). Isso também limita o Rails à série 7.2. Planeje subir para Ruby 3.3+ e Rails 8.

## Pré-requisitos

- Ruby 3.1.7 (rbenv), Node 24 + Yarn 1
- PostgreSQL 14+ e Redis 6+ rodando localmente (ex.: `brew services start postgresql@14 redis`)
- Google Chrome (para os system specs `:js`)
- Docker (apenas para build/deploy)

## Setup

```bash
make setup     # gems em vendor/bundle, yarn, .env, banco, bin/doctor
make dev       # http://localhost:3000
```

Usuário de desenvolvimento (admin): `dev@example.com` / `password123` (criado por `bin/rails db:seed`).

## Comandos

`make help` lista tudo. Os principais:

| Comando | O que faz |
| --- | --- |
| `make dev` | web + vite + sidekiq + clockwork (via foreman/overmind) |
| `make test` | RSpec + Vitest |
| `make lint` | StandardRB + ESLint + Prettier + typecheck |
| `make ci` | lint + brakeman + testes |
| `make doctor` | checa arquivos, ENV, Postgres e Redis |
| `make console` | Rails console |
| `make db-reset` | recria o banco (destrutivo) |
| `make annotate` | anota os models com o schema |

Painel do Sidekiq: `/sidekiq` (só usuários com `admin = true`).

## Estrutura

```
app/
├── controllers/          # finos: params → service → render inertia / redirect
│   ├── inertia_controller.rb   # base das páginas, compartilha current_user e flash
│   └── users/            # Devise renderizando páginas React
├── services/             # orquestração de regras de negócio
├── frontend/
│   ├── entrypoints/      # inertia.tsx, application.css (Tailwind)
│   ├── pages/            # <controller>/<action>.tsx (inferido pelo Inertia)
│   ├── layouts/  components/  hooks/  lib/  types/
│   └── test/setup.ts
lib/app/                  # domínio puro (namespace App::), ex.: App::Result
lib/app/boot/             # código de boot (ENV, Redis), carregado via require
config/clock.rb           # agendamentos (Clockwork)
config/deploy.yml         # Kamal
spec/                     # RSpec (models, requests, system, lib)
```

## Variáveis de ambiente

Veja `.env.example`; em desenvolvimento todas têm default. Em produção são obrigatórias `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `REDIS_URL` e `APP_HOST` (`lib/app/boot/env_vars.rb`, validadas no boot e pelo `bin/doctor`).

## Deploy (Kamal 2)

1. Substitua todos os `CHANGE_ME` em `config/deploy.yml` (IP do servidor, domínio, usuário do registry).
2. Exporte os segredos no shell (o arquivo `.kamal/secrets` só referencia variáveis):
   ```bash
   export KAMAL_REGISTRY_PASSWORD=...   # token do GHCR/Docker Hub
   export POSTGRES_PASSWORD=$(openssl rand -hex 32)   # guarde em um cofre de senhas
   ```
3. Primeiro deploy (instala Docker, sobe Postgres/Redis e o kamal-proxy com Let's Encrypt):
   ```bash
   make deploy-setup
   ```
4. Deploys seguintes: `make deploy`. Utilitários: `bin/kamal console`, `bin/kamal logs`, `bin/kamal shell`.

Roles: `web` (Puma atrás do kamal-proxy, healthcheck `/up`), `job` (Sidekiq) e `clock` (Clockwork), todos no mesmo servidor por padrão.

## CI

`.github/workflows/ci.yml` roda StandardRB, Brakeman, ESLint/Prettier/tsc, Vitest e RSpec (com Postgres e Redis como services).
