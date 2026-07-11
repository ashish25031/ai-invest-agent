"use client";

import { NewsArticleSchema } from "../../types";
import { z } from "zod";
import { format } from "date-fns";
import { ExternalLink, Clock } from "lucide-react";

interface NewsTimelineProps {
  news: z.infer<typeof NewsArticleSchema>[] | undefined;
}

export function NewsTimeline({ news }: NewsTimelineProps) {
  if (!news || news.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-heading font-semibold text-white mb-8 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" /> Recent News Timeline
      </h3>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
        {news.map((article, idx) => {
          const isBullish = article.sentiment === 'BULLISH';
          const isBearish = article.sentiment === 'BEARISH';
          
          return (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              {/* Timeline Dot */}
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-card bg-zinc-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-2 md:translate-x-0" 
                style={{ backgroundColor: isBullish ? '#10B981' : isBearish ? '#EF4444' : '#6B7280' }}
              />
              
              {/* Card */}
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-colors ml-6 md:ml-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <time className="text-xs font-medium text-zinc-500">
                    {format(new Date(article.publishedAt), 'MMM d, yyyy h:mm a')}
                  </time>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                    ${isBullish ? 'bg-success/10 text-success border border-success/20' : 
                      isBearish ? 'bg-danger/10 text-danger border border-danger/20' : 
                      'bg-zinc-800 text-zinc-300 border border-zinc-700'}`}
                  >
                    {article.sentiment}
                  </span>
                </div>
                
                <a href={article.url} target="_blank" rel="noreferrer" className="block text-sm font-medium text-zinc-200 hover:text-primary transition-colors mb-2 leading-snug">
                  {article.title}
                </a>
                
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <ExternalLink className="w-3 h-3" />
                  <span>{article.source}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
