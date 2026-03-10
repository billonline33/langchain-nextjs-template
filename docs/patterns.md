# Key Patterns & Code Examples

---

## 1. LCEL Chain (LangChain Expression Language)

The pipe operator composes chains left-to-right. Each step's output becomes the next step's input.

```ts
// app/api/chat/route.ts
const chain = prompt.pipe(model).pipe(new BytesOutputParser());
const stream = await chain.stream({ input, chat_history });
return new StreamingTextResponse(stream);
```

For more complex chains, use `RunnableSequence`:
```ts
const chain = RunnableSequence.from([
  { context: retriever, question: new RunnablePassthrough() },
  prompt,
  model,
  new StringOutputParser(),
]);
```

---

## 2. Structured Output with Zod

Force the LLM to return a validated JSON object matching a Zod schema:

```ts
// app/api/chat/structured_output/route.ts
const schema = z.object({
  tone: z.enum(["positive", "negative", "neutral"]),
  entity: z.string().describe("The main entity mentioned"),
  word_count: z.number(),
  chat_response: z.string(),
  final_punctuation: z.string(),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const structuredModel = model.withStructuredOutput(schema);
const result = await chain.invoke({ input, chat_history });
// result is fully typed as z.infer<typeof schema>
```

---

## 3. LangGraph ReAct Agent

Create an agent that can call tools iteratively until it has an answer:

```ts
// app/api/chat/agents/route.ts
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const tools = [new SerpAPI(), new Calculator()];
const agent = createReactAgent({ llm: model, tools });

// Stream tokens + events
const eventStream = agent.streamEvents(
  { messages: langChainMessages },
  { version: "v2" }
);

for await (const { event, data } of eventStream) {
  if (event === "on_chat_model_stream" && data.chunk.content) {
    // send token to client
  }
}
```

---

## 4. RAG (Retrieval-Augmented Generation)

Two-step pattern: condense question using history, then retrieve + answer.

```ts
// Condensation step — rephrase question given chat history
const standaloneQuestionChain = RunnableSequence.from([
  condenseQuestionPrompt,
  model,
  new StringOutputParser(),
]);

// Answer step — retrieve docs, inject as context, generate answer
const answerChain = RunnableSequence.from([
  { context: retriever, question: new RunnablePassthrough() },
  answerPrompt,
  model,
  new BytesOutputParser(),
]);

// Combine: if no history, answer directly; otherwise condense first
const conversationalChain = RunnableSequence.from([
  RunnableBranch.from([
    [hasHistory, standaloneQuestionChain.pipe(answerChain)],
    answerChain,
  ]),
]);
```

---

## 5. React Server Components Streaming (AI SDK)

Use server actions with `createStreamableValue` to stream from server to client:

```ts
// app/ai_sdk/agent/action.ts  ("use server")
export async function runAgent(input: string) {
  const streamableValue = createStreamableValue<string>();

  (async () => {
    const eventStream = executor.streamEvents({ input }, { version: "v2" });
    for await (const { event, data } of eventStream) {
      if (event === "on_chat_model_stream") {
        streamableValue.update(data.chunk.content);
      }
    }
    streamableValue.done();
  })();

  return streamableValue.value; // ReadableStream
}

// app/ai_sdk/agent/page.tsx  (client component)
const stream = await runAgent(userInput);
for await (const chunk of readStreamableValue(stream)) {
  setOutput(prev => prev + chunk);
}
```

---

## 6. Document Ingestion Pipeline

Split → Embed → Store:

```ts
// app/api/retrieval/ingest/route.ts
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 256,
  chunkOverlap: 20,
});
const docs = await splitter.createDocuments([text]);

await SupabaseVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings(),
  { client: supabaseClient, tableName: "documents" }
);
```

---

## 7. ChatWindow Component Pattern

All demo pages reuse a single `ChatWindow` component, configured via props:

```tsx
// app/agents/page.tsx
<ChatWindow
  endpoint="api/chat/agents"
  emoji="🦜"
  placeholder="Ask Polly anything..."
  titleText="Polly the Parrot"
  showIngestForm={false}
  showIntermediateStepsToggle={true}
/>
```

Key props:
- `endpoint` — which API route to call
- `showIngestForm` — show document upload modal (retrieval demos only)
- `showIntermediateStepsToggle` — show/hide agent reasoning steps
