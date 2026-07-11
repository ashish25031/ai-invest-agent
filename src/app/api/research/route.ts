import { NextRequest } from "next/server";
import { runResearchWorkflow } from "../../../lib/graph";
import { logger } from "../../../lib/logger";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const companyName = searchParams.get("companyName");

  if (!companyName) {
    return new Response(JSON.stringify({ error: "Company name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      const sendUpdate = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        sendUpdate({ status: "Initializing Research Workflow..." });
        
        await runResearchWorkflow(companyName, (stateUpdate) => {
          // Send incremental state updates to the client
          sendUpdate(stateUpdate);
        });

        sendUpdate({ status: "Complete", done: true });
        logger.info(`SSE stream completed for ${companyName}`);
      } catch (error: any) {
        logger.error(`SSE stream error for ${companyName}`, error);
        sendUpdate({ error: error.message || "An unexpected error occurred." });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
