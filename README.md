# CheapGPT

---

<p align="center">
   <img src="ui/public/cheapGPT-logos/cheapgpt_logo_dark.webp" alt="CheapGPT Logo" width="120"/>
</p>

<p align="center">
   <b>A full-stack AI chat application powered by multiple LLMs — fast, cheap, and surprisingly good.</b><br>
   <i>Real-time streaming responses, multiple models, and a clean ChatGPT-style interface.</i>
</p>

---

### Features

- **Multi-model support** — Switch between Groq Llama, OpenAI-compatible, and compound models
- **Real-time streaming** — Token-by-token responses via SSE, no waiting for full replies
- **Response styles** — Concise, Balanced, or In-depth — injected directly into the system prompt
- **Markdown rendering** — Tables, code blocks with syntax highlighting, lists, and more
- **Auth** — GitHub and Google OAuth2, local sessions via Passport
- **Persistent chat history** — Chats saved per user with auto-generated titles

---

### Screenshots

<div align="center">

**New Chat**

<!-- Add screenshot here -->

</div>

<div align="center">

**Chat in Progress**

<!-- Add screenshot here -->

</div>

---

# Overview

CheapGPT is a monorepo AI chat app built on the MEAN stack. It exposes multiple LLM providers through a single clean interface, streams responses in real time, and persists chat history per user.

> **Why?**
>
> - Access frontier and open-source models in one place at a fraction of the cost
> - Real-time streaming UX with no cold-start lag
> - Built for real deployments, not just local demos

---

## Technology Stack

**Backend (API):**

- Node.js, TypeScript, Express
- MongoDB (Mongoose)
- LangChain (`@langchain/groq`, `@langchain/langgraph`)
- Passport (GitHub, Google, Local)
- Server-Sent Events (SSE) for streaming

**Frontend (UI):**

- Angular 18, RxJS
- Tailwind CSS, DaisyUI
- `marked` + `highlight.js` for markdown rendering
- Lucide icons

**Infrastructure:**

- Azure App Service (API)
- Azure Static Web Apps (UI)
- GitHub Actions (CI/CD)

---

# Quick Start

## Prerequisites

- Node.js 20+
- NPM 9+
- MongoDB (local or cloud)
- Groq API key ([console.groq.com](https://console.groq.com))

## Clone & Install

```bash
git clone https://github.com/EthanE96/CheapGPT.git
cd CheapGPT
# Install API dependencies
cd api && npm i
# Install UI dependencies
cd ../ui && npm i
```

## Environment Variables

Create `api/.env`:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=cheapgpt
GROQ_API_KEY=your_groq_api_key
SESSION_SECRET=your_session_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Run Locally

### API

```bash
cd api
npm run watch
# API: http://localhost:3000/api
```

### UI

```bash
cd ui
npm run watch
# UI: http://localhost:4200/
```

---

## Monorepo Structure

| Folder | Description                                          |
| ------ | ---------------------------------------------------- |
| `api/` | Node.js/TypeScript API, LangChain, MongoDB, Passport |
| `ui/`  | Angular SPA, Tailwind, DaisyUI, marked               |

---

## CI/CD & GitHub Workflows

- **API:** Deployed to Azure App Service on push to `main` ([main_cheapgpt.yml](.github/workflows/main_cheapgpt.yml))
- **UI:** Deployed to Azure Static Web Apps on push/PR

---

## Deployment

### API

```bash
cd api
npm run build
```

### UI

```bash
cd ui
# Development
npm run deploy:dev

# Production
npm run deploy:prod
```

---

## OAuth2 Configuration

- [Google OAuth2 Console](https://console.cloud.google.com)
- [GitHub OAuth Apps](https://github.com/settings/developers)

---

## License

MIT License

Copyright (c) 2025 Ethan Edwards <EthanAEdwards5@outlook.com>

---
