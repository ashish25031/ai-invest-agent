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
    <main className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10 opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-indigo-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        
        {/* Header / Nav */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
               AI
             </div>
             <span className="text-xl font-medium tracking-tight">InvestAgent</span>
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
