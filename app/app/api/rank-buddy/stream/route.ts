import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest } from "next/server";

const client = new Anthropic();

function loadPrompt(): string {
  const promptPath = join(process.cwd(), "prompts", "rank-buddy.v1.txt");
  return readFileSync(promptPath, "utf-8");
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const systemPrompt = loadPrompt();

  const anthropicMessages = messages
    .filter((m: { kind: string }) => m.kind === "user" || m.kind === "question")
    .map((m: { kind: string; text?: string }) => ({
      role: m.kind === "user" ? "user" : "assistant",
      content: m.text ?? "",
    }))
    .filter((m: { content: string }) => m.content.trim() !== "");

  if (anthropicMessages.length === 0 || anthropicMessages[anthropicMessages.length - 1].role !== "user") {
    return new Response("No user message to respond to", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: systemPrompt,
          messages: anthropicMessages,
          stream: true,
        });

        let buffer = "";

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            buffer += event.delta.text;

            // Try to parse complete JSON objects from the buffer
            let startIdx = buffer.indexOf("{");
            while (startIdx !== -1) {
              // Find matching closing brace
              let depth = 0;
              let endIdx = -1;
              for (let i = startIdx; i < buffer.length; i++) {
                if (buffer[i] === "{") depth++;
                else if (buffer[i] === "}") {
                  depth--;
                  if (depth === 0) {
                    endIdx = i;
                    break;
                  }
                }
              }

              if (endIdx === -1) break; // incomplete JSON, wait for more

              const jsonStr = buffer.slice(startIdx, endIdx + 1);
              buffer = buffer.slice(endIdx + 1).trimStart();
              startIdx = buffer.indexOf("{");

              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.kind) {
                  send(parsed);
                }
              } catch {
                // not valid JSON, skip
              }
            }
          }
        }

        // Try to parse any remaining buffer content
        if (buffer.trim()) {
          const startIdx = buffer.indexOf("{");
          if (startIdx !== -1) {
            try {
              const parsed = JSON.parse(buffer.slice(startIdx));
              if (parsed.kind) send(parsed);
            } catch {
              // ignore
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        send({ kind: "question", text: `Error: ${errorMsg}. Please try again.` });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
