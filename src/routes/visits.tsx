import { createFileRoute } from "@tanstack/react-router";
import { UserCheck, MapPin, Clock, Camera, FileSignature, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock } from "@/lib/mock-data";

export const Route = createFileRoute("/visits")({
  head: () => ({ meta: [{ title: "Customer Visits · OctaForce 360" }, { name: "description", content: "Field agent customer visit timeline with check-ins, signatures, and meeting notes." }] }),
  component: Visits,
});

function Visits() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Field Force"
        title="Customer Visits"
        description="Track on-site meetings, check-ins, signatures, and visit outcomes in real-time."
        actions={<Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />New Visit</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Visits Today" value={42} icon={UserCheck} tone="primary" />
        <StatCard label="Completed" value={31} icon={MapPin} tone="success" />
        <StatCard label="Avg Duration" value="48m" icon={Clock} tone="info" />
        <StatCard label="With Signature" value={28} icon={FileSignature} tone="warning" />
      </div>

      <Card className="p-5">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today's Timeline</div>
        <div className="relative space-y-4 border-l-2 border-border/60 pl-5">
          {mock.visits.slice(0, 10).map((v, i) => (
            <div key={v.id} className="relative">
              <div className="absolute -left-[26px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-primary">
                <MapPin className="h-2.5 w-2.5 text-secondary" />
              </div>
              <Card className="p-4 transition-all hover:border-primary/40">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{v.agent.split(" ").map(w=>w[0]).join("")}</AvatarFallback></Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{v.agent}</div>
                        <div className="truncate text-[11px] text-muted-foreground">visited {v.customer}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">📝 {v.notes}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <Badge variant="outline" className={v.status==="Completed" ? "border-success/40 bg-success/10 text-success" : v.status==="Ongoing" ? "border-info/40 bg-info/10 text-info" : "border-destructive/40 bg-destructive/10 text-destructive"}>{v.status}</Badge>
                    <div className="font-mono text-[10px] text-muted-foreground">{v.checkIn} → {v.checkOut} · {v.duration}</div>
                    <div className="text-[10px] text-muted-foreground">{v.distance}</div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
