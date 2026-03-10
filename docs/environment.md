# Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you need.

---

## Required

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key — needed for all demos |
| `LANGCHAIN_CALLBACKS_BACKGROUND` | Set to `false` for serverless/edge runtime compatibility |

---

## Optional — By Feature

### Agents Demo (`/agents`)

| Variable | Description |
|----------|-------------|
| `SERPAPI_API_KEY` | SerpAPI key for web search tool inside the agent |

### Retrieval Demos (`/retrieval`, `/retrieval_agents`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `SUPABASE_PRIVATE_KEY` | Supabase **service role** key (not the anon key — needs write access) |

### AI SDK Agent Demo (`/ai_sdk/agent`)

| Variable | Description |
|----------|-------------|
| `TAVILY_API_KEY` | Tavily search API key |

### LangSmith Tracing (optional but recommended)

| Variable | Description |
|----------|-------------|
| `LANGCHAIN_TRACING_V2` | Set to `true` to enable tracing |
| `LANGCHAIN_API_KEY` | LangSmith API key |
| `LANGCHAIN_PROJECT` | Project name in LangSmith (default: `nextjs-starter`) |

### Demo / Deployment Mode

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_DEMO` | Set to `true` to disable document ingestion endpoint (for public demos) |

---

## Example `.env.local`

```env
# Required
OPENAI_API_KEY=sk-proj-...
LANGCHAIN_CALLBACKS_BACKGROUND=false

# Retrieval demos
SUPABASE_URL=https://abcdefghij.supabase.co
SUPABASE_PRIVATE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Agents demo
SERPAPI_API_KEY=...

# AI SDK agent
TAVILY_API_KEY=tvly-...

# LangSmith tracing (optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__...
LANGCHAIN_PROJECT=nextjs-starter
```
