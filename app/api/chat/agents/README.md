# Agent Route — `POST /api/chat/agents`

## Overview

This is a **ReAct agent** endpoint powered by LangGraph. It can use tools to answer questions and responds in character as a talking parrot named "Polly".

---

## Tools Available to the Agent

| Tool | Purpose | Requirement |
|------|---------|-------------|
| `Calculator` | Evaluates math expressions | None |
| `SerpAPI` | Performs web searches | `SERPAPI_API_KEY` env var |

---

## System Persona

```
You are a talking parrot named Polly. All final responses must be how a talking parrot would respond. Squawk often!
```

---

## Two Response Modes

Controlled by `body.show_intermediate_steps` in the request body:

| `show_intermediate_steps` | Mode | Behavior |
|---------------------------|------|----------|
| `false` (default) | **Streaming** | Streams only the final text tokens back to the client as they are generated, skipping tool call chunks |
| `true` | **Full result** | Waits for the agent to finish, then returns the complete message history including intermediate tool calls as JSON |

---

## Message Flow

1. Request arrives with a `messages[]` array in Vercel chat format
2. Filters out any non-`user`/`assistant` messages (e.g. system messages used for UI display)
3. Converts messages to LangChain format (`HumanMessage`, `AIMessage`, etc.)
4. Agent enters the ReAct loop — decides whether to call a tool or respond directly
5. Response is either **streamed** or returned as **JSON** depending on the mode

---

## Streaming Detail

In streaming mode, the route listens to LangGraph's `streamEvents` and filters for `on_chat_model_stream` events that contain actual text content:

```ts
if (event === "on_chat_model_stream") {
  if (!!data.chunk.content) {
    controller.enqueue(textEncoder.encode(data.chunk.content));
  }
}
```

This skips intermediate tool-invocation tokens and only forwards the final natural language response to the client.

---

## Related Files

- [`route.ts`](./route.ts) — the route implementation
- [`../../agents/page.tsx`](../../agents/page.tsx) — the frontend page that calls this route
- [LangGraph ReAct agent docs](https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/)
