# Cloud Services & External APIs

---

## OpenAI (Required)

Used for: Chat completions (all demos), embeddings (retrieval demos)

**Models used:**
- `gpt-4o-mini` — default chat model (fast, cheap)
- `text-embedding-3-small` — document and query embeddings

**Setup:** Get an API key at platform.openai.com, set `OPENAI_API_KEY`.

---

## Supabase (Required for `/retrieval` and `/retrieval_agents`)

Used for: pgvector vector store — stores document chunks and their embeddings.

**Setup:**
1. Create a Supabase project at supabase.com
2. Enable the `pgvector` extension:
   ```sql
   create extension if not exists vector;
   ```
3. Create the `documents` table:
   ```sql
   create table documents (
     id bigserial primary key,
     content text,
     metadata jsonb,
     embedding vector(1536)
   );
   ```
4. Create the similarity search function:
   ```sql
   create or replace function match_documents (
     query_embedding vector(1536),
     match_count int default null,
     filter jsonb default '{}'
   ) returns table (
     id bigint,
     content text,
     metadata jsonb,
     similarity float
   )
   language plpgsql
   as $$
   begin
     return query
     select
       id,
       content,
       metadata,
       1 - (documents.embedding <=> query_embedding) as similarity
     from documents
     where metadata @> filter
     order by documents.embedding <=> query_embedding
     limit match_count;
   end;
   $$;
   ```
5. Set `SUPABASE_URL` and `SUPABASE_PRIVATE_KEY` (service role key) in `.env.local`

> Use the **service role** key (not anon key) — the ingest endpoint needs write access.

---

## SerpAPI (Required for `/agents`)

Used for: Web search tool inside the LangGraph ReAct agent.

**Setup:** Sign up at serpapi.com, set `SERPAPI_API_KEY`.

**Alternative:** Replace with `TavilySearchResults` from `@langchain/tavily` if you prefer.

---

## Tavily Search (Required for `/ai_sdk/agent`)

Used for: Web search tool in the AI SDK server action agent example.

**Setup:** Sign up at tavily.com, set `TAVILY_API_KEY`.

---

## LangGraph Server (Required for `/langgraph` page)

The `/langgraph` demo connects to a **locally running LangGraph development server**, not a hosted service.

**Start the server:**
```bash
cd app/langgraph/agent
npx @langchain/langgraph-cli dev
# Server runs at http://localhost:2024
```

The graph definition lives in [app/langgraph/agent/agent.ts](../app/langgraph/agent/agent.ts).

For production, deploy to [LangGraph Cloud](https://langchain-ai.github.io/langgraph/cloud/) and update the client URL.

---

## LangSmith (Optional — Tracing)

Used for: Observability — trace LLM calls, tool invocations, chain execution, and latency.

**Setup:**
1. Create account at smith.langchain.com
2. Create a project
3. Add to `.env.local`:
   ```env
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_API_KEY=ls__...
   LANGCHAIN_PROJECT=nextjs-starter
   ```

Traces will appear automatically for all LangChain calls.

---

## LangChain Hub (Used internally by `/ai_sdk/agent`)

The AI SDK agent example pulls a pre-built prompt template from LangChain Hub:
```ts
const prompt = await pull("hwchase17/openai-tools-agent");
```

This requires no additional setup but does make a network call on first request. The prompt is a standard OpenAI tools agent system prompt.
