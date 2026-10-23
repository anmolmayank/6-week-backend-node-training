# Local AI Chatbot --- Standard Quick Start

This guide records the local startup flow for the existing project:

**React → Node.js/Express → FastAPI → Ollama → local LLM**

Keep each long-running service in its own terminal. Do not commit
`.env`, credentials, or the Python virtual environment.

## 1. Project locations

Backend repository:

``` bash
~/Desktop/Development/Fullstack/6-week-backend-node-training
```

Python AI microservice:

``` bash
~/Desktop/Development/Fullstack/6-week-backend-node-training/ai-microservice
```

Frontend repository:

``` bash
~/Desktop/Development/Fullstack/6-week-frontend-training
```

## 2. Start Ollama and verify the model

Ollama is a separate local service. On macOS, open the Ollama
application if it is not already running.

Check the installation and locally available models:

``` bash
ollama --version
ollama list
```

The microservice configuration shown in this project uses `qwen3:1.7b`
by default (`OLLAMA_MODEL` can override it through the environment).
Confirm that the configured model appears in `ollama list`.

If `qwen3:1.7b` is the configured model and it is not installed:

``` bash
ollama pull qwen3:1.7b
```

Check that Ollama's local API is responding:

``` bash
curl http://127.0.0.1:11434/api/tags
```

Optional interactive model test:

``` bash
ollama run qwen3:1.7b
```

Enter a prompt and confirm a response. Enter `/bye` to exit the
interactive session. The Ollama service must remain running for the
microservice to generate responses.

## 3. Activate the Python virtual environment

Open Terminal 1 for FastAPI:

``` bash
cd ~/Desktop/Development/Fullstack/6-week-backend-node-training/ai-microservice
source .venv/bin/activate
python --version
```

Use the existing `.venv` created for this project. The environment has
been using Python 3.11.

If `.venv` does not exist, create it with Python 3.11 and install the
dependencies listed by this repository:

``` bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Then, only if the project has `requirements.txt`:

``` bash
python -m pip install -r requirements.txt
```

Do not recreate or reinstall a working environment without a reason.

## 4. Check the microservice environment configuration

The FastAPI application reads settings from `ai-microservice/.env`. The
configuration shown in this project requires `MONGODB_URI` and has
defaults for the service port, MongoDB database, Ollama base URL, and
model.

Before starting FastAPI, confirm that the local `.env` file exists and
contains the required MongoDB connection setting. Keep the real
connection string private; do not paste it into documentation, logs, or
Git.

Relevant defaults in the current configuration:

  Setting            Default
  ------------------ --------------------------
  Service port       `8001`
  Ollama base URL    `http://127.0.0.1:11434`
  Ollama model       `qwen3:1.7b`
  MongoDB database   `node_training_activity`

Environment variables can override these defaults. Use the actual values
in your local `.env` when they differ.

## 5. Start FastAPI using the project's actual entry point

The application entry point is `app/main.py`, and the FastAPI instance
is named `app`. From the `ai-microservice` directory with `.venv`
activated, run:

``` bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**Important:** use `app.main:app`, not `main:app`. The project stores
`main.py` inside the `app/` package.

Keep this terminal open.

Verify the health endpoint in another terminal:

``` bash
curl http://127.0.0.1:8001/health
```

Open FastAPI's interactive API documentation:

http://127.0.0.1:8001/docs

The application checks MongoDB during startup. If startup fails at the
database check, verify the `.env` MongoDB setting and network/database
access.

## 6. Start the Node.js backend

Open Terminal 2:

``` bash
cd ~/Desktop/Development/Fullstack/6-week-backend-node-training
npm run dev
```

The Node API is expected at:

``` text
http://127.0.0.1:3000
```

The chat endpoint called by the frontend is:

``` text
POST http://127.0.0.1:3000/api/v1/chat
```

Keep the Node process running. If the Node API cannot call the Python
service, check that FastAPI is listening on port `8001` and verify the
AI-service URL in the Node environment/configuration.

## 7. Start the React frontend

Open Terminal 3:

``` bash
cd ~/Desktop/Development/Fullstack/6-week-frontend-training
npm run dev
```

Open the URL printed by Vite. Sign in if required; the floating AI
widget is intended to appear only for an authenticated session.

The frontend API base URL should point to the Node API, for example:

``` text
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Use the value in the frontend's local environment file if it differs.
Restart Vite after changing environment variables.

## 8. Standard startup order

1.  **Ollama:** application/service running and configured model
    available.
2.  **FastAPI:** activate `.venv`, then run
    `uvicorn app.main:app --reload --host 127.0.0.1 --port 8001`.
3.  **Node.js:** run `npm run dev` in the backend repository root.
4.  **React:** run `npm run dev` in the frontend repository root.

Keep the three development terminals open. Ollama runs separately as a
local service.

## 9. Quick verification checklist

Run these checks in order:

``` bash
# Ollama is reachable and lists local models
curl http://127.0.0.1:11434/api/tags

# FastAPI health endpoint responds
curl http://127.0.0.1:8001/health
```

Then confirm:

-   Node starts on port `3000`.
-   The frontend loads from Vite.
-   You sign in before testing the authenticated floating chat widget.
-   Sending a chat message reaches `POST /api/v1/chat` through Node and
    returns an answer from the configured local model.

Use the browser Network tab and the Node/FastAPI terminal output to
diagnose failures. Avoid logging message content or secrets.

## 10. Troubleshooting

  ----------------------------------------------------------------------------
  Symptom                             Check
  ----------------------------------- ----------------------------------------
  `source .venv/bin/activate` fails   Confirm you are inside `ai-microservice`
                                      and `.venv/bin/activate` exists.

  `uvicorn` is not found              Activate `.venv` and check that the
                                      project's FastAPI dependencies are
                                      installed.

  `Could not import module "main"`    Use `uvicorn app.main:app ...` from the
                                      `ai-microservice` directory.

  FastAPI fails during startup        Check the required `MONGODB_URI` in
                                      `ai-microservice/.env` and database
                                      connectivity.

  Ollama connection error             Check that Ollama is running and
                                      `curl http://127.0.0.1:11434/api/tags`
                                      succeeds.

  Model not found                     Check the configured `OLLAMA_MODEL` and
                                      `ollama list`; pull the exact configured
                                      model if needed.

  Node cannot reach FastAPI           Check FastAPI is running on port `8001`
                                      and verify the Node AI-service URL
                                      configuration.

  Frontend request fails              Check Node on port `3000`,
                                      `VITE_API_BASE_URL`, browser
                                      Network/Console output, and backend
                                      logs.

  Authentication error                Sign in and verify the expected access
                                      token is sent. Token presence in browser
                                      storage alone does not guarantee server
                                      authorization.
  ----------------------------------------------------------------------------

## 11. Stop the services

Press `Ctrl + C` in each terminal running FastAPI, Node, or Vite.

To leave the Python virtual environment after stopping FastAPI:

``` bash
deactivate
```

Deactivation does not stop Ollama. Stop Ollama separately only if you
want to shut down the local model service.

## Reference commands

**Terminal 1 --- FastAPI**

``` bash
cd ~/Desktop/Development/Fullstack/6-week-backend-node-training/ai-microservice
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**Terminal 2 --- Node.js**

``` bash
cd ~/Desktop/Development/Fullstack/6-week-backend-node-training
npm run dev
```

**Terminal 3 --- React**

``` bash
cd ~/Desktop/Development/Fullstack/6-week-frontend-training
npm run dev
```

Ollama should already be running in the background with the configured
model available.
