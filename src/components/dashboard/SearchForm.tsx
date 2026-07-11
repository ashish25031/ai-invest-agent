"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface SearchFormProps {
  onSearch: (companyName: string) => void;
  isExecuting: boolean;
}

export function SearchForm({ onSearch, isExecuting }: SearchFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isExecuting) {
      onSearch(query.trim());
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-20 bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <CardHeader className="text-center pb-8 pt-10">
        <CardTitle className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-3">AI Investment Research</CardTitle>
        <CardDescription className="text-zinc-400 text-lg max-w-xl mx-auto">
          Enter a company name to generate a comprehensive, data-driven investment report.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 relative z-10">
          <div className="relative flex-1 group/input">
            <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
            <Input
              type="text"
              placeholder="e.g. Tesla, Apple, or Snowflake"
              className="pl-12 h-14 bg-black/40 border-white/10 text-lg focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-xl transition-all shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isExecuting}
            />
          </div>
          <Button 
            type="submit" 
            className="h-14 px-10 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium text-lg rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100" 
            disabled={!query.trim() || isExecuting}
          >
            {isExecuting ? "Analyzing..." : "Research"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
