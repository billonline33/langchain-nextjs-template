import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /* Parse incoming messages
        The request body contains the full chat history as an array. It splits that into:

        All previous messages (everything except the last) → formatted as "role: content" strings
        The current/latest user message → extracted as plain text
    */
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    console.log("---001---Formatted previous messages:", formattedPreviousMessages);
    console.log("---002---Current message content:", currentMessageContent);
    
    /*
       Building the propmpt
       The PromptTemplate injects the chat history and the current message. 
       This gives the LLM context of the whole conversation so far.
    */
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    console.log("---003---Prompt template:", TEMPLATE);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "@langchain/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    // we have two options to return the response: stream the output of the chain, or await the full response and return it as JSON. 
    // Option 1: Stream the output

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    console.log("---004---Stream:", stream);
    

    return new StreamingTextResponse(stream);
    // Option 1 ends here

    // Option 2: Await the full response
    // const response = await chain.invoke({
    //   chat_history: formattedPreviousMessages.join("\n"),
    //   input: currentMessageContent,
    // });
    // return NextResponse.json({ response });
    // Option 2 ends here

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
