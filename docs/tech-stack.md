# Tech Stack & Dependencies

## Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.4.8 | Framework — App Router, server actions, edge API routes |
| `react` / `react-dom` | ^18.3.1 | UI rendering |
| `typescript` | 5.1.6 | Static typing, strict mode enabled |

## AI / LLM

| Package | Version | Purpose |
|---------|---------|---------|
| `langchain` | ^0.3.19 | Core: agents, chains, tools, document loaders, text splitters |
| `@langchain/core` | ^0.3.43 | Base interfaces: Runnables, LCEL, message types |
| `@langchain/openai` | ^0.4.9 | OpenAI chat models + embeddings |
| `@langchain/langgraph` | ^0.2.57 | Stateful agentic graphs (ReAct agent, state machines) |
| `@langchain/langgraph-sdk` | ^0.0.60 | Client SDK + React hooks for LangGraph server |
| `@langchain/community` | ^1.1.14 | Community integrations: SerpAPI, Calculator, retriever tools |
| `@langchain/tavily` | ^1.2.0 | Tavily web search tool for AI SDK agent example |
| `ai` | ^3.1.12 | Vercel AI SDK: `useChat`, `StreamingTextResponse`, RSC streaming |

## Vector Database

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.97.0 | Client for Supabase (pgvector vector store) |

## Validation & Schema

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | ^3.25.32 | Runtime schema validation for structured LLM outputs |
| `zod-to-json-schema` | ^3.23.2 | Convert Zod schemas → JSON Schema (for OpenAI function calling) |

## UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.3.3 | Utility-first CSS framework |
| `@radix-ui/react-*` | ^1.1.x | Headless UI primitives (checkbox, dialog, popover, slot) |
| `lucide-react` | ^0.473.0 | Icon set |
| `next-themes` | ^0.2.1 | Dark/light mode switching |
| `sonner` | ^1.4.3 | Toast notification system |
| `vaul` | ^0.9.4 | Drawer component |
| `class-variance-authority` | ^0.7.0 | Variant-based component styling |
| `clsx` | ^2.1.1 | Conditional class names utility |
| `tailwind-merge` | ^2.5.5 | Merge Tailwind classes without conflicts |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities |

## State & Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `nuqs` | ^1.19.1 | URL search param state management |
| `use-stick-to-bottom` | ^1.0.7 | Auto-scroll chat to latest message |

## Development

| Package | Purpose |
|---------|---------|
| `eslint` + `eslint-config-next` | Linting with Next.js rules |
| `prettier` | Code formatting |
| `@next/bundle-analyzer` | Interactive bundle size visualization |
| `postcss` + `autoprefixer` | CSS processing |

## Runtime Requirements

- Node.js >= 18 (required for LangChain.js)
- Yarn 3 (Berry) — configured in `.yarnrc.yml`
