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
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-xl relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search for a company (e.g. AAPL, Tesla, Snowflake)..."
        className="block w-full pl-10 pr-24 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isExecuting}
      />
      <div className="absolute inset-y-0 right-1 flex items-center">
        <Button 
          type="submit" 
          size="sm"
          className="h-7 px-4 bg-primary hover:bg-primary/90 text-white font-medium text-xs rounded transition-all" 
          disabled={!query.trim() || isExecuting}
        >
          {isExecuting ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </form>
  );
}
