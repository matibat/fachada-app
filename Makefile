.PHONY: help install dev build test test-watch test-ui test-e2e test-e2e-ui preview clean validate ci build-minimalista build-modern-tech build-profesional build-vaporwave

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@yarn install

dev: ## Start development server
	@yarn dev

build: ## Build for production (uses profile.config.ts settings)
	@yarn build

build-minimalista: ## Build with Minimalista theme
	@yarn build:minimalista

build-modern-tech: ## Build with Modern Tech theme
	@yarn build:modern-tech

build-profesional: ## Build with Profesional theme
	@yarn build:profesional

build-vaporwave: ## Build with Vaporwave theme
	@yarn build:vaporwave

test: ## Run unit and integration tests
	@yarn test

test-watch: ## Run tests in watch mode
	@yarn test:watch

test-ui: ## Open Vitest UI
	@yarn test:ui

test-e2e: ## Run E2E tests (headless)
	@yarn test:e2e

test-e2e-ui: ## Run E2E tests with interactive UI
	@yarn test:e2e:ui

preview: ## Preview production build locally
	@yarn preview

clean: ## Clean build artifacts
	@rm -rf dist .astro

validate: test test-e2e build ## Run tests, E2E, and build (pre-deploy validation)
	@echo "✅ Full validation complete! All tests and build passed."

ci: install test test-e2e build ## Complete CI pipeline (install, test, E2E, build)
	@echo "✅ CI pipeline complete!"
