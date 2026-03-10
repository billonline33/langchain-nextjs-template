# API Routes

All routes are in `app/api/`. Most use Next.js edge runtime for serverless deployment.

---

## POST `/api/chat`

**File:** [app/api/chat/route.ts](../app/api/chat/route.ts)

Simple streaming chat with a pirate persona.

- **Model:** `gpt-4o-mini` (temperature 0.8)
- **Pattern:** LCEL chain — `prompt → ChatOpenAI → BytesOutputParser`
- **Streaming:** `HttpResponseOutputParser` → `StreamingTextResponse`
- **Input:** `{ messages: [{role, content}] }`

---

## POST `/api/chat/structured_output`

**File:** [app/api/chat/structured_output/route.ts](../app/api/chat/structured_output/route.ts)

Non-streaming chat that returns a Zod-validated JSON object.

- **Model:** `gpt-4o-mini` with OpenAI function calling
- **Pattern:** `.withStructuredOutput(zodSchema)` — guarantees schema compliance
- **Output schema fields:** `tone`, `entity`, `word_count`, `chat_response`, `final_punctuation`
- **Returns:** JSON (not streamed)

---

## POST `/api/chat/agents`

**File:** [app/api/chat/agents/route.ts](../app/api/chat/agents/route.ts)

Streaming ReAct agent with access to web search and math tools.

- **Model:** `gpt-4o-mini`
- **Agent:** LangGraph `createReactAgent`
- **Tools:** `SerpAPI` (web search), `Calculator`
- **Persona:** Parrot (Polly)
- **Streaming:** Token-level streaming via LangGraph `.streamEvents()`
- **Optional:** Pass `show_intermediate_steps: true` to expose tool call steps
- **Requires:** `SERPAPI_API_KEY`

---

## POST `/api/chat/retrieval`

**File:** [app/api/chat/retrieval/route.ts](../app/api/chat/retrieval/route.ts)

RAG (Retrieval-Augmented Generation) chain using Supabase vector store.

- **Model:** `gpt-4o-mini`
- **Vector Store:** Supabase (`documents` table via `match_documents` RPC)
- **Embeddings:** OpenAI `text-embedding-3-small`
- **Pattern (2-step LCEL chain):**
  1. Condense question using chat history
  2. Retrieve top-k docs → answer with context
- **Sources:** Returned in `x-sources` response header (base64-encoded JSON)
- **Persona:** Puppy (Dana) — answers with puns
- **Requires:** `SUPABASE_URL`, `SUPABASE_PRIVATE_KEY`

---

## POST `/api/chat/retrieval_agents`

**File:** [app/api/chat/retrieval_agents/route.ts](../app/api/chat/retrieval_agents/route.ts)

Agent-based RAG: combines LangGraph agent with a vector store retrieval tool.

- **Model:** `gpt-4o-mini`
- **Agent:** LangGraph `createReactAgent`
- **Tool:** Supabase vector store wrapped as a LangChain retriever tool
- **Persona:** Robot (Robbie)
- **Advantage over `/retrieval`:** Agent decides when/how to use retrieval; better for meta-questions
- **Requires:** `SUPABASE_URL`, `SUPABASE_PRIVATE_KEY`

---

## POST `/api/retrieval/ingest`

**File:** [app/api/retrieval/ingest/route.ts](../app/api/retrieval/ingest/route.ts)

Splits, embeds, and stores text documents in Supabase for retrieval.

- **Splitter:** `RecursiveCharacterTextSplitter` — 256-char chunks, 20-char overlap
- **Embeddings:** OpenAI
- **Storage:** Supabase vector store
- **Demo guard:** Disabled when `NEXT_PUBLIC_DEMO=true`
- **Input:** `{ text: string }` (raw document text)

---

## AI SDK Server Actions (`/ai_sdk`)

These use React Server Components (`"use server"`) rather than traditional API routes.

### `/ai_sdk/tools` — Tool Calling with Streaming
**File:** [app/ai_sdk/tools/action.ts](../app/ai_sdk/tools/action.ts)
- Zod-defined tool schema + `createStreamableValue` for streaming tool results to client

### `/ai_sdk/agent` — Web Search Agent
**File:** [app/ai_sdk/agent/action.ts](../app/ai_sdk/agent/action.ts)
- LangChain agent with TavilySearch tool
- Uses `streamEvents()` API to stream intermediate steps + final answer
- Pulls prompt from LangChain Hub (`hwchase17/openai-tools-agent`)
- **Requires:** `TAVILY_API_KEY`

---

## LangGraph Local Server (`/langgraph`)

**File:** [app/langgraph/agent/agent.ts](../app/langgraph/agent/agent.ts)

This page connects to a **locally running LangGraph server** (not a Next.js API route).

- **Server URL:** `http://localhost:2024`
- **Graph:** Simple pirate chat with `StateGraph`, adds message timestamps
- **Features:** Message editing, regeneration, branch navigation (via LangGraph SDK)
- **Start server:** `cd app/langgraph/agent && npx @langchain/langgraph-cli dev`
