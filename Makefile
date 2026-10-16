.PHONY: help setup dev dev-web dev-workers console test test-rb test-js lint lint-rb lint-js lint-fix typecheck security doctor db-migrate db-rollback db-reset annotate ci deploy deploy-setup logs

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

setup: ## Install dependencies, prepare .env and database
	bin/setup

dev: ## Start full dev stack (web, vite, sidekiq, clock)
	bin/dev

dev-web: ## Start Rails server only
	bin/dev-web

dev-workers: ## Start Sidekiq only
	bin/dev-workers

console: ## Open Rails console
	bin/rails console

test: test-rb test-js ## Run all tests

test-rb: ## Run RSpec
	bundle exec rspec

test-js: ## Run Vitest
	yarn test

lint: lint-rb lint-js typecheck ## Run all linters and type checks

lint-rb: ## Run StandardRB
	bundle exec standardrb

lint-js: ## Run ESLint and Prettier check
	yarn lint
	yarn format:check

lint-fix: ## Auto-fix lint issues (Ruby and JS)
	bundle exec standardrb --fix
	yarn lint:fix
	yarn format

typecheck: ## Run TypeScript type checks
	yarn typecheck

security: ## Run Brakeman
	bundle exec brakeman --no-pager --quiet

doctor: ## Run local health checks
	bin/doctor

db-migrate: ## Run pending migrations
	bin/rails db:migrate

db-rollback: ## Roll back last migration
	bin/rails db:rollback

db-reset: ## Drop, recreate and seed database (destructive!)
	bin/reset_db

annotate: ## Annotate models with schema info
	bundle exec annotaterb models

ci: lint security test ## Everything CI runs

deploy-setup: ## First deploy with Kamal (provisions accessories)
	bundle exec kamal setup

deploy: ## Deploy with Kamal
	bundle exec kamal deploy

logs: ## Tail production logs
	bundle exec kamal app logs -f
