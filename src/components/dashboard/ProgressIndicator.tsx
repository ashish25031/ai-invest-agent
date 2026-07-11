"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

interface ProgressIndicatorProps {
  status?: string;
}

export function ProgressIndicator({ status }: ProgressIndicatorProps) {
  // Simple heuristic for progress bar based on common statuses
  const getProgress = (statusText: string) => {
    if (!statusText) return 5;
    const s = statusText.toLowerCase();
    if (s.includes("initializing")) return 10;
    if (s.includes("company research") || s.includes("analyzing financials")) return 30;
    if (s.includes("analyzing news") || s.includes("sentiment")) return 60;
    if (s.includes("assessing risks")) return 80;
    if (s.includes("decision") || s.includes("report")) return 90;
    if (s.includes("complete")) return 100;
    return 50; // default indeterminate
  };

  const progress = getProgress(status || "");

  return (
    <Card className="max-w-2xl mx-auto mt-8 bg-zinc-900/50 border-zinc-800">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 text-indigo-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg font-medium">{status || "Processing..."}</p>
        </div>
        <Progress value={progress} className="h-2 w-full bg-zinc-800" />
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          LangGraph Multi-Agent Orchestration
        </p>
      </CardContent>
    </Card>
  );
}
