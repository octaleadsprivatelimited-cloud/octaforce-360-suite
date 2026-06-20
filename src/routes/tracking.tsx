import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Clock, Activity, Battery, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { MockMap } from "@/components/mock-map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock } from "@/lib/mock-data";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Live Tracking · OctaForce 360" }, { name: "description", content: "Real-time GPS tracking of field agents with route history, idle time, and live status." }] }),
  component: Tracking,
});

const statusColor: Record<string, string> = {
  Online: "bg-success text-success-foreground",
  Working: "bg-primary text-primary-foreground",
  Traveling: "bg-info text-info-foreground",
  Idle: "bg-warning text-warning-foreground",
  Offline: "bg-muted text-muted-foreground",
};

function Tracking() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Field Force · Live"
        title="Real-Time GPS Tracking"
        description={`${mock.gpsActiveUsers} of ${mock.activeFieldAgents} field agents are live on the map right now.`}
        actions={<>
          <Button variant="outline" size="sm"><Filter className="mr-2 h-3.5 w-3.5" />Filter</Button>
          <Button size="sm" className="gradient-primary text-secondary"><Navigation className="mr-2 h-3.5 w-3.5" />Optimize Routes</Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="GPS Active" value={mock.gpsActiveUsers} icon={MapPin} tone="success" />
        <StatCard label="Avg Distance" value="32 km" icon={Navigation} tone="info" />
        <StatCard label="Avg Working Time" value="6h 42m" icon={Clock} tone="primary" />
        <StatCard label="Idle Alerts" value={4} icon={Activity} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden p-4">
          <MockMap height="h-[560px]" />
        </Card>

        <Card className="p-0">
          <div className="border-b border-border/60 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Agents</div>
            <div className="font-display text-base font-bold">{mock.liveAgents.length} live now</div>
          </div>
          <div className="max-h-[520px] divide-y divide-border/60 overflow-auto">
            {mock.liveAgents.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 hover:bg-muted/40">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="gradient-primary text-[10px] font-bold text-secondary">{a.avatar}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">{a.name}</div>
                    <Badge className={`h-5 px-1.5 text-[9px] ${statusColor[a.liveStatus]}`}>{a.liveStatus}</Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{a.location}</span>
                    <span>·</span>
                    <span>{a.lastSeen}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><Battery className="h-2.5 w-2.5" />{a.battery}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
