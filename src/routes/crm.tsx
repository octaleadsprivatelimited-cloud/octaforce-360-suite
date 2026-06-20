import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, TrendingUp, Target, Trophy, X, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "Sales CRM · OctaForce 360" }, { name: "description", content: "Sales pipeline with leads from Website, Facebook, Instagram, Google Ads, WhatsApp, and more." }] }),
  component: CRM,
});

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won"] as const;

function CRM() {
  const byStage: Record<string, typeof mock.leads> = {};
  stages.forEach((s) => { byStage[s] = mock.leads.filter((l) => l.stage === s).slice(0, 6); });

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Sales & Revenue"
        title="Sales CRM Pipeline"
        description={`${mock.openLeads} open opportunities worth ${formatINR(mock.leads.reduce((a,l)=>a+l.value,0))} in the pipeline.`}
        actions={<>
          <Button variant="outline" size="sm"><Filter className="mr-2 h-3.5 w-3.5" />Filter</Button>
          <Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />New Lead</Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Leads" value={mock.totalLeads} icon={Target} tone="primary" />
        <StatCard label="Open" value={mock.openLeads} icon={TrendingUp} tone="info" />
        <StatCard label="Won (MTD)" value={mock.wonLeads} delta={{ value: formatINR(4200000), positive: true }} icon={Trophy} tone="success" />
        <StatCard label="Lost" value={mock.lostLeads} icon={X} tone="danger" />
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {stages.map((s, i) => {
          const items = byStage[s];
          const total = items.reduce((a, b) => a + b.value, 0);
          return (
            <div key={s} className="min-w-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: `var(--color-chart-${i+1})` }} />
                  <span className="text-xs font-semibold">{s}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{items.length}</Badge>
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <div className="mb-2 text-[10px] font-medium text-muted-foreground">{formatINR(total)}</div>
                <div className="space-y-2">
                  {items.map((l) => (
                    <Card key={l.id} className="cursor-pointer p-3 transition-all hover:border-primary/60 hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold">{l.company}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{l.name}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0"><MoreHorizontal className="h-3 w-3" /></Button>
                      </div>
                      <div className="mt-2 font-display text-sm font-bold text-primary">{formatINR(l.value)}</div>
                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <Badge variant="outline" className="h-4 px-1 text-[9px]">{l.source}</Badge>
                        <span className={`font-bold ${l.score >= 70 ? "text-success" : l.score >= 40 ? "text-warning" : "text-muted-foreground"}`}>★ {l.score}</span>
                      </div>
                      <div className="mt-2 truncate border-t border-border/60 pt-1.5 text-[10px] text-muted-foreground">{l.owner} · {l.city}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
