"use client";

import { useResearchWorkflow } from "../hooks/useResearchWorkflow";
import { SearchForm } from "../components/dashboard/SearchForm";
import { ProgressIndicator } from "../components/dashboard/ProgressIndicator";
import { ReportDashboard } from "../components/report/ReportDashboard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";

export default function Home() {
  const { state, isExecuting, error, startResearch, reset } = useResearchWorkflow();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* Header / Nav */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-heading font-bold text-white shadow-lg shadow-indigo-500/25 border border-white/10">
               AI
             </div>
             <span className="text-2xl font-heading font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
               InvestAgent
             </span>
          </div>
          {Object.keys(state).length > 0 && !isExecuting && (
            <Button variant="ghost" onClick={reset} className="text-zinc-400 hover:text-white">
              Start New Research
            </Button>
          )}
        </header>

        {/* Initial State */}
        {Object.keys(state).length === 0 && !error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-20">
            <SearchForm onSearch={startResearch} isExecuting={isExecuting} />
          </div>
        )}

        {/* Executing State */}
        {isExecuting && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <SearchForm onSearch={() => {}} isExecuting={true} />
            <ProgressIndicator status={state.status} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-4">
              <span className="break-words">{error}</span>
              <Button onClick={reset} variant="outline" className="w-fit border-destructive/50 hover:bg-destructive/10">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Final Report Dashboard */}
        {!isExecuting && !error && state.decision && (
          <ReportDashboard state={state} />
        )}
      </div>
    </main>
  );
}
