import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful AI assistant with access to a knowledge base.

Respond to greetings and casual conversation naturally without tools.

For questions that seek specific information, facts, or knowledge:
- Use the getInformation tool to search your knowledge base first
- Base your answer only on the knowledge base results
- If no relevant information is found, say "Sorry, I don't know."

If the getInformation tool returns "No relevant information found" or "Error searching knowledge base":
- Respond with "Sorry, I don't know."
- Do NOT provide answers from your general training data

Examples of when to use the knowledge base:
- "What is...?" 
- "How does...work?"
- "Tell me about..."
- Questions about specific topics, people, or concepts


Examples of when NOT to use the knowledge base:
- Greetings ("hello", "hi")
- Casual conversation ("how are you?")
- Thank you messages
- General pleasantries`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      // web_search_preview: openai.tools.webSearchPreview({}),
      // addResource: tool({
      //   description: `add a resource to your knowledge base.
      //     If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
      //   inputSchema: z.object({
      //     content: z
      //       .string()
      //       .describe("the content or resource to add to the knowledge base"),
      //   }),
      //   execute: async ({ content }) => createResource({ content }),
      // }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
