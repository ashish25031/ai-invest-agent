"use client";

import { AgentState } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ExternalLink, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Newspaper, ShieldAlert } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface ReportDashboardProps {
  state: Partial<AgentState>;
}

export function ReportDashboard({ state }: ReportDashboardProps) {
  const { companyInfo, financials, news, risks, decision, sources } = state;

  if (!decision) return null;

  const isInvest = decision.recommendation === "INVEST";

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Decision Overview */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-1 h-full ${isInvest ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-4xl font-bold">{companyInfo?.name || state.companyName}</CardTitle>
                {companyInfo?.ticker && (
                  <Badge variant="outline" className="text-lg bg-zinc-800 text-zinc-300">
                    {companyInfo.ticker}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-lg mt-2 text-zinc-400">
                {companyInfo?.industry} • {decision.investmentHorizon} Horizon
              </CardDescription>
            </div>
            
            <div className="flex flex-col items-end gap-2 text-right">
              <Badge 
                className={`text-xl px-6 py-2 ${isInvest ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'}`}
              >
                {decision.recommendation}
              </Badge>
              <div className="text-sm text-zinc-500">
                Confidence: <span className="text-white font-medium">{decision.confidence}%</span>
              </div>
              <div className="text-sm text-zinc-500">
                Risk Level: <span className="text-white font-medium">{decision.riskLevel}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-zinc-300 mb-6">{decision.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-3">
                <h4 className="font-semibold text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Key Reasons
                </h4>
                <ul className="space-y-2">
                  {decision.reasons.map((r, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span> {r}
                    </li>
                  ))}
                </ul>
             </div>
             <div className="space-y-3">
                <h4 className="font-semibold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Primary Concerns
                </h4>
                <ul className="space-y-2">
                  {decision.concerns.map((c, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-rose-500 mt-1">•</span> {c}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout for details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Financials */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5 text-indigo-400" /> Financial Health (Score: {decision.financialScore}/100)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {financials ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Market Cap</div>
                    <div className="font-mono">{financials.marketCap ? (financials.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Revenue</div>
                    <div className="font-mono">{financials.revenue ? (financials.revenue / 1e9).toFixed(2) + 'B' : 'N/A'}</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Profit Margin</div>
                    <div className="font-mono">{financials.profitMargin ? (financials.profitMargin * 100).toFixed(2) + '%' : 'N/A'}</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">P/E Ratio</div>
                    <div className="font-mono">{financials.peRatio ? financials.peRatio.toFixed(2) : 'N/A'}</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Debt/Equity</div>
                    <div className="font-mono">{financials.debtToEquity ? financials.debtToEquity.toFixed(2) : 'N/A'}</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Currency</div>
                    <div className="font-mono">{financials.currency}</div>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Detailed financial metrics unavailable.</p>
              )}
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          {risks && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldAlert className="h-5 w-5 text-indigo-400" /> SWOT Analysis & Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion className="w-full">
                  <AccordionItem value="swot">
                    <AccordionTrigger className="text-zinc-300">Detailed SWOT Matrix</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="border border-zinc-800 p-4 rounded bg-black/20">
                          <h5 className="font-semibold text-emerald-400 mb-2">Strengths</h5>
                          <ul className="text-sm text-zinc-400 space-y-1 list-disc pl-4">
                            {risks.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        <div className="border border-zinc-800 p-4 rounded bg-black/20">
                          <h5 className="font-semibold text-rose-400 mb-2">Weaknesses</h5>
                          <ul className="text-sm text-zinc-400 space-y-1 list-disc pl-4">
                            {risks.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                        <div className="border border-zinc-800 p-4 rounded bg-black/20">
                          <h5 className="font-semibold text-blue-400 mb-2">Opportunities</h5>
                          <ul className="text-sm text-zinc-400 space-y-1 list-disc pl-4">
                            {risks.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                          </ul>
                        </div>
                        <div className="border border-zinc-800 p-4 rounded bg-black/20">
                          <h5 className="font-semibold text-orange-400 mb-2">Threats</h5>
                          <ul className="text-sm text-zinc-400 space-y-1 list-disc pl-4">
                            {risks.threats.map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="risks">
                    <AccordionTrigger className="text-zinc-300">Systemic & Specific Risks</AccordionTrigger>
                    <AccordionContent>
                       <div className="space-y-4 pt-2">
                          <div>
                            <h5 className="text-sm font-semibold text-zinc-300 mb-1">Systemic (Macro) Risks</h5>
                            <ul className="text-sm text-zinc-400 list-disc pl-4">
                              {risks.systemicRisks.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-zinc-300 mb-1">Company-Specific Risks</h5>
                            <ul className="text-sm text-zinc-400 list-disc pl-4">
                              {risks.companySpecificRisks.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Column 3: Sidebar Content */}
        <div className="space-y-6">
          
          {/* News Sentiment */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="h-5 w-5 text-indigo-400" /> Recent News (Score: {decision.sentimentScore})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {news && news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((article, i) => (
                      <div key={i} className="space-y-1">
                        <a href={article.url} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-indigo-400 transition-colors flex items-start gap-1">
                          {article.title}
                          <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0" />
                        </a>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">{article.source} • {new Date(article.publishedAt).toLocaleDateString()}</span>
                          <Badge variant="secondary" className={
                            article.sentiment === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400' :
                            article.sentiment === 'BEARISH' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-800 text-zinc-400'
                          }>
                            {article.sentiment}
                          </Badge>
                        </div>
                        {i < news.length - 1 && <Separator className="mt-3 bg-zinc-800" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">No recent news available.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Sources */}
          {sources && sources.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-1">
                      {s.name} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
