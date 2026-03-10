# CLAUDE.md — LangChain + Next.js Template

A reference template showcasing LangChain.js AI patterns (chat, agents, RAG, structured output) in a Next.js 15 App Router project.

---

## Quick Start

```bash
npm install --legacy-peer-deps
cp .env.example .env.local  # then fill in API keys
npm run dev                  # http://localhost:3000
```

> `--legacy-peer-deps` is required due to a version conflict between `@langchain/community` and `@langchain/core`.

**Minimum required:** `OPENAI_API_KEY` in `.env.local`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript 5 |
| AI Orchestration | LangChain.js 0.3, LangGraph.js 0.2 |
| LLM | OpenAI (gpt-4o-mini default) |
| Streaming | Vercel AI SDK 3 |
| Vector DB | Supabase (pgvector) |
| UI | Tailwind CSS + shadcn/ui (Radix UI) |
| Package Manager | npm (project ships with Yarn 3 config, ignored) |

See [docs/tech-stack.md](docs/tech-stack.md) for full dependency list and purposes.

---

## Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Run production build
npm run lint      # ESLint
npm run format    # Prettier

ANALYZE=true npm run build   # Bundle size analysis
```

---

## Project Structure

```
app/
├── page.tsx                    # Home: Simple streaming chat (pirate persona)
├── structured_output/          # Zod-schema function calling demo
├── agents/                     # ReAct agent with web search + calculator
├── retrieval/                  # RAG chain with Supabase vector store
├── retrieval_agents/           # RAG agent (agent + retrieval combined)
├── ai_sdk/                     # React Server Components AI SDK examples
├── langgraph/                  # LangGraph stateful agent demo
└── api/
    ├── chat/                   # Streaming chat API routes (one per demo)
    └── retrieval/ingest/       # Document ingestion endpoint
components/
├── ChatWindow.tsx              # Main reusable chat UI
├── ChatMessageBubble.tsx       # Message renderer with sources
└── ui/                         # shadcn/ui primitives
```

See [docs/api-routes.md](docs/api-routes.md) for detailed route descriptions.

---

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# For /agents demo
SERPAPI_API_KEY=...

# For /retrieval demos (Supabase vector store)
SUPABASE_URL=https://...
SUPABASE_PRIVATE_KEY=...

# For LangSmith tracing (optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=...
LANGCHAIN_PROJECT=nextjs-starter

# Required for serverless/edge runtime
LANGCHAIN_CALLBACKS_BACKGROUND=false
```

See [docs/environment.md](docs/environment.md) for full variable reference.

---

## External Services

| Service | Required For | Setup |
|---------|-------------|-------|
| OpenAI | All demos | API key only |
| Supabase | `/retrieval`, `/retrieval_agents` | DB + pgvector setup |
| SerpAPI | `/agents` | API key only |
| Tavily | `/ai_sdk/agent` | API key only |
| LangSmith | Tracing (optional) | API key + env vars |
| LangGraph Server | `/langgraph` | Run locally on :2024 |

See [docs/cloud-services.md](docs/cloud-services.md) for setup instructions.

---

## Key Patterns

- **Streaming:** Vercel AI SDK `useChat` hook + `StreamingTextResponse` on server
- **LCEL chains:** `prompt.pipe(model).pipe(parser)` composition pattern
- **Agents:** LangGraph `createReactAgent` with tool arrays
- **RAG:** Supabase vector store → retriever → chain with history condensation
- **Structured output:** Zod schemas + `.withStructuredOutput()` for typed LLM responses
- **RSC streaming:** `"use server"` actions + `createStreamableValue()` for React Server Components

See [docs/patterns.md](docs/patterns.md) for code examples of each pattern.
