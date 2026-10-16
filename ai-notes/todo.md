# TODO

## Setup
- [ ] Trocar todos os `CHANGE_ME` em `config/deploy.yml` (IP, domínio, registry)
- [ ] Definir `KAMAL_REGISTRY_PASSWORD` e `POSTGRES_PASSWORD` no shell e rodar `make deploy-setup`
- [ ] Ajustar `MAILER_SENDER` e configurar SMTP de produção
- [ ] Recuperação de senha e editar conta: páginas React + specs + SMTP, depois reativar `:recoverable` e as rotas de registrations
- [ ] Checkbox "lembrar de mim" no login (`:rememberable` já está ativo)
- [ ] Traduzir mensagens do Devise (`rails-i18n` + `devise-i18n`) se a UI for pt-BR

## Tech debt
- [ ] Subir para Ruby 3.3+ e Rails 8 (Ruby 3.1 EOL mar/2025, Rails 7.2 EOL ago/2026) e remover `config/brakeman.ignore`

## Features
- [ ] ...
