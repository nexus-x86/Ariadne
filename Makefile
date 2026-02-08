
.PHONY: install build install-frontend install-backend build-frontend build-backend

# Install dependencies for both frontend and backend
install: install-frontend install-backend

install-frontend:
	cd frontend && \
	if [ -f package-lock.json ] || [ -f pnpm-lock.yaml ]; then npm ci; else npm install; fi

install-backend:
	python3 -m venv backend/.venv || true
	backend/.venv/bin/python -m pip install --upgrade pip
	if [ -f backend/requirements.txt ]; then backend/.venv/bin/pip install -r backend/requirements.txt; fi

# Build steps (assumes `make install` already run)
build: build-frontend build-backend

build-frontend:
	cd frontend && npm run build

build-backend:
	@echo "No compile/build step for backend. Use `make install` to prepare the backend virtualenv and deps."
