# Configuration Overview

This document explains how environment variables are wired through the Docker based local development setup and how the backend and frontend read them at runtime.

## Environment Variable Flow

### 1. Top-level `.env`
- `docker-compose.yml` loads the root `.env` file and forwards its content to the backend container via the [`env_file` directive](../docker-compose.yml). The compose file also overrides/extends specific values in the [`environment` block](../docker-compose.yml#L17-L39) so the container always receives a full set of defaults.
- Variables defined here are available to every service at runtime. For example, the backend reads `EMBEDDING_MODEL`, `OPENAI_API_KEY`, and `OPENAI_EMBEDDING_MODEL` from the process environment.

### 2. Backend service
- `load_embedding_model` inspects `EMBEDDING_MODEL` and, when set to `openai`, uses `OPENAI_EMBEDDING_MODEL` to select the exact model to load.
- The chat model is picked dynamically. `get_llm` expects variables of the form `LLM_MODEL_CONFIG_<model_key>` (for example `LLM_MODEL_CONFIG_openai_gpt_5_mini`) to discover the provider, model id, and credentials.
- Defaults for these variables are provided in `example.env`, which mirrors the expected contents of your real `.env` file.

### 3. Frontend service
- When Docker builds the frontend image it injects Vite build-time variables using build arguments in `frontend/Dockerfile`. These map directly to `VITE_*` variables referenced throughout the React codebase.
- The running development container also receives a `frontend/.env` file so that `yarn dev` (or Vite preview) shares the same configuration as the built assets.
- Inside the app, the `VITE_LLM_MODELS` family of variables control which models appear in the UI by populating arrays such as `llms` and `prodllms`.

### 4. Why variables appear in multiple places
- The `.env` files act as documentation-friendly templates and local overrides that are easy to edit without touching the compose file.
- `docker-compose.yml` must duplicate selected variables to supply container defaults and to ensure new installs work even if a key is absent from `.env` (Compose cannot read comments or defaults from `example.env`).
- Frontend variables need to be available both at build time (to bake values into the static bundle) and at runtime for the dev server, hence they exist as Docker build args and as entries in `frontend/.env`.

## Key Variables for the OpenAI-Only Setup
- `EMBEDDING_MODEL=openai` together with `OPENAI_EMBEDDING_MODEL=text-embedding-3-small` switches embeddings to OpenAI's **text-embedding-3-small** model.
- `LLM_MODEL_CONFIG_openai_gpt_5_mini` defines the credentials for the **gpt-5-mini** chat model and is consumed by the backend at runtime.
- `VITE_LLM_MODELS` / `VITE_LLM_MODELS_PROD` expose `openai_gpt_5_mini` in the UI dropdown so you can pick it for graph generation and chat.

With these variables in place you can start the stack using `docker-compose up --build` and interact with the application at http://localhost:8080.