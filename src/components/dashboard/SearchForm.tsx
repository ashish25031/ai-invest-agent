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
    <Card className="max-w-2xl mx-auto mt-12 bg-black/40 backdrop-blur-md border-zinc-800">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-light tracking-tight">AI Investment Research</CardTitle>
        <CardDescription className="text-zinc-400">
          Enter a company name to generate a comprehensive, data-driven investment report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="e.g. Tesla, Apple, or Snowflake"
              className="pl-10 h-12 bg-zinc-900/50 border-zinc-700 text-lg focus-visible:ring-indigo-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isExecuting}
            />
          </div>
          <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!query.trim() || isExecuting}>
            {isExecuting ? "Analyzing..." : "Research"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
