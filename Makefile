# retractor — common tasks
# This project has no build step and no runtime dependencies.
# Tests are browser-based (Jasmine); there is no headless/CLI runner yet.
#
# Usage:  make help

.PHONY: help serve test test-setup

PYTHON ?= python3
PORT   ?= 8000

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

serve: ## Start the local web server (then open retractor.html)
	@echo ">> Serving on http://localhost:$(PORT) (Ctrl-C to stop)"
	$(PYTHON) -m http.server $(PORT)

test-setup: ## Show one-time Jasmine setup steps
	@echo ">> Tests are browser-based (Jasmine). One-time setup:"
	@echo "   1. Download Jasmine standalone (verified: 6.0.1): https://jasmine.github.io/"
	@echo "   2. Extract into ./jasmine/  (the 'jasmine' dir is gitignored)"
	@echo "   3. Run 'make serve', then open the test runner below."

test: ## Run the test suite (opens the Jasmine runner in your browser)
	@echo ">> No headless runner is configured."
	@echo ">> Start the server with 'make serve', then open:"
	@echo "   http://localhost:$(PORT)/tests/test.html"
	@command -v xdg-open >/dev/null 2>&1 && xdg-open "http://localhost:$(PORT)/tests/test.html" >/dev/null 2>&1 || \
		command -v open >/dev/null 2>&1 && open "http://localhost:$(PORT)/tests/test.html" >/dev/null 2>&1 || \
		echo "   (open the URL manually in your browser)"
