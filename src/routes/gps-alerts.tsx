import { createFileRoute } from "@tanstack/react-router";
import { Wifi, WifiOff, MapPin, BatteryLow, Smartphone, Eye, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock } from "@/lib/mock-data";

export const Route = createFileRoute("/gps-alerts")({
  head: () => ({ meta: [{ title: "GPS Alerts · OctaForce 360" }, { name: "description", content: "Detect GPS off, network off, app force close, battery saver, and mock location issues." }] }),
  component: GpsAlerts,
});

const alertTypes = [
  { type: "GPS Disabled", icon: MapPin, tone: "danger" as const, count: 3 },
  { type: "Internet Disconnected", icon: WifiOff, tone: "danger" as const, count: 2 },
  { type: "App Force Closed", icon: Smartphone, tone: "warning" as const, count: 1 },
  { type: "Battery Saver", icon: BatteryLow, tone: "warning" as const, count: 4 },
  { type: "Mock Location", icon: Eye, tone: "danger" as const, count: 0 },
];

function GpsAlerts() {
  const alerts = mock.liveAgents.slice(0, 8).map((a, i) => ({
    agent: a,
    alert: alertTypes[i % alertTypes.length],
    when: `${i + 2} min ago`,
    lastKnown: `${a.location} · BKC area`,
  }));

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Field Force"
        title="Network / GPS Off Detection"
        description="Real-time alerts when field agents go offline, disable GPS, or trigger anomalies."
        actions={<Button variant="outline" size="sm"><AlertTriangle className="mr-2 h-3.5 w-3.5" />Alert Settings</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {alertTypes.map((a) => (
          <StatCard key={a.type} label={a.type} value={a.count} icon={a.icon} tone={a.tone} />
        ))}
      </div>

      <Card className="p-0">
        <div className="border-b border-border/60 p-4">
          <div className="font-display text-base font-bold">Active Alerts</div>
          <div className="text-xs text-muted-foreground">Managers will be notified automatically for each event.</div>
        </div>
        <div className="divide-y divide-border/60">
          {alerts.map((a, i) => (
            <div key={i} className="grid gap-3 p-4 hover:bg-muted/40 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center">
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${a.alert.tone==="danger" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"}`}>
                <a.alert.icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{a.agent.avatar}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{a.agent.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{a.alert.type} · Last seen {a.lastKnown}</div>
                </div>
              </div>
              <Badge variant="outline" className={a.alert.tone==="danger" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-warning/40 bg-warning/10 text-warning"}>{a.when}</Badge>
              <Button variant="outline" size="sm">Investigate</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
