# Project Memory: langchain-nextjs-template

## Overview
LangChain.js + Next.js 15 template demonstrating AI patterns: chat, agents, RAG, structured output.
Package manager: Yarn 3 (Berry). Min Node 18.

## Key Files
- CLAUDE.md — project overview with links to /docs/
- docs/tech-stack.md — full dependency list
- docs/api-routes.md — all API route descriptions
- docs/environment.md — env variable reference
- docs/cloud-services.md — Supabase SQL setup, external service configs
- docs/patterns.md — code examples for each LangChain pattern

## Tech
- Next.js 15 App Router, TypeScript 5, Tailwind CSS, shadcn/ui
- LangChain.js 0.3 + LangGraph.js 0.2 + Vercel AI SDK 3
- OpenAI (gpt-4o-mini default), Supabase (pgvector), SerpAPI, Tavily

## Required env vars
- OPENAI_API_KEY (always)
- LANGCHAIN_CALLBACKS_BACKGROUND=false (always, for edge runtime)
- SUPABASE_URL + SUPABASE_PRIVATE_KEY (retrieval demos)
- SERPAPI_API_KEY (agents demo)
- TAVILY_API_KEY (ai_sdk/agent demo)

## Demo Pages → API Routes
- / → /api/chat (simple streaming, pirate persona)
- /structured_output → /api/chat/structured_output (Zod + function calling)
- /agents → /api/chat/agents (LangGraph ReAct, SerpAPI + Calculator)
- /retrieval → /api/chat/retrieval (RAG chain, Supabase)
- /retrieval_agents → /api/chat/retrieval_agents (RAG + agent)
- /ai_sdk → RSC server actions (tools + Tavily agent)
- /langgraph → local LangGraph server at :2024

## Commands
- Uses npm (not yarn — yarn not installed)
- npm install --legacy-peer-deps (required — peer dep conflict between @langchain/community and @langchain/core)
- npm run dev / npm run build / npm run start / npm run lint / npm run format
- ANALYZE=true npm run build (bundle analysis)
