"use client";

import { useResearchWorkflow } from "../hooks/useResearchWorkflow";
import { SearchForm } from "../components/dashboard/SearchForm";
import { AnimatedPipeline } from "../components/dashboard/AnimatedPipeline";
import { ReportDashboard } from "../components/report/ReportDashboard";
import { CompanyHeader } from "../components/dashboard/CompanyHeader";
import { RecommendationCard } from "../components/report/RecommendationCard";
import { AlertCircle, User, Moon, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";

export default function Home() {
  const { state, isExecuting, error, startResearch } = useResearchWorkflow();
  const hasStarted = Object.keys(state).length > 0 || isExecuting;

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex-1 max-w-2xl">
          <SearchForm onSearch={startResearch} isExecuting={isExecuting} />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Moon className="w-5 h-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        
        {!hasStarted && !error && (
           <div className="h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-700">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-heading font-semibold text-white mb-4">Start your research</h2>
              <p className="text-zinc-400 text-lg">Enter a company ticker or name in the search bar above to generate a comprehensive, AI-driven financial analysis.</p>
           </div>
        )}

        {hasStarted && (
          <div className="animate-in fade-in duration-500 space-y-12">
            
            {/* Top Dashboard Row */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
               <CompanyHeader companyInfo={state.companyInfo} fallbackName={state.companyName || "Analyzing..."} />
               {state.decision && !isExecuting && (
                 <div className="w-full lg:w-80">
                   <RecommendationCard decision={state.decision} />
                 </div>
               )}
            </div>

            {/* Pipeline State */}
            {isExecuting && (
              <div className="py-12 border-y border-border bg-card/30 rounded-2xl">
                <AnimatedPipeline status={state.status || "idle"} />
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="mt-2 flex flex-col gap-4">
                  <span className="break-words">{error}</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Final Report Dashboard */}
            {!isExecuting && !error && state.decision && (
              <ReportDashboard state={state} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
