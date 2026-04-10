.PHONY: help install dev build test test-watch test-ui preview clean validate ci firebase-init firebase-deploy firebase-preview

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@yarn install

dev: ## Start development server
	@yarn dev

build: ## Build for production
	@yarn build

test: ## Run all tests
	@yarn test

test-watch: ## Run tests in watch mode
	@yarn test:watch

test-ui: ## Open Vitest UI
	@yarn test:ui

preview: ## Preview production build locally
	@yarn preview

clean: ## Clean build artifacts
	@rm -rf dist .astro

validate: test build ## Run tests and build (pre-deploy validation)
	@echo "✅ Validation complete! All tests passed and build successful."

ci: install test build ## Complete CI pipeline (install, test, build)
	@echo "✅ CI pipeline complete!"

firebase-init: ## Initialize Firebase project (interactive)
	@yarn firebase init

firebase-deploy: ## Deploy to Firebase Hosting
	@yarn firebase deploy --only hosting

firebase-preview: ## Create Firebase preview channel
	@yarn firebase hosting:channel:deploy preview
