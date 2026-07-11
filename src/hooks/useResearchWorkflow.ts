import { useState, useCallback } from "react";
import { AgentState } from "../types";

export function useResearchWorkflow() {
  const [state, setState] = useState<Partial<AgentState>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startResearch = useCallback((companyName: string) => {
    setIsExecuting(true);
    setError(null);
    setState({ companyName, status: "Initializing..." });

    const eventSource = new EventSource(`/api/research?companyName=${encodeURIComponent(companyName)}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.error) {
          setError(data.error);
          setIsExecuting(false);
          eventSource.close();
          return;
        }

        if (data.done) {
          setIsExecuting(false);
          eventSource.close();
          return;
        }

        setState(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error", err);
      setError("Connection lost. Please try again.");
      setIsExecuting(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const reset = useCallback(() => {
    setState({});
    setIsExecuting(false);
    setError(null);
  }, []);

  return { state, isExecuting, error, startResearch, reset };
}
