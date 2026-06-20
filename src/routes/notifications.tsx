import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notifications, activityFeed } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · OctaForce 360" }, { name: "description", content: "Real-time alerts for attendance, GPS, leads, visits, invoices, and approvals." }] }),
  component: Notif,
});

const iconFor = (s: string) => s === "danger" ? AlertTriangle : s === "warning" ? AlertCircle : s === "success" ? CheckCircle2 : Info;

function Notif() {
  const all = [
    ...notifications,
    ...activityFeed.map((a, i) => ({ id: 100 + i, title: a.who, body: a.what, time: a.when, severity: a.type === "alert" ? "danger" : a.type === "win" ? "success" : "info" })),
  ];
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Realtime"
        title="Notification Center"
        description="Every event across HRMS, CRM, Field Force, and Invoicing — in one place."
        actions={<Button variant="outline" size="sm">Mark all as read</Button>}
      />

      <Card className="p-0">
        <div className="border-b border-border/60 p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <div className="font-display text-base font-bold">{all.length} notifications</div>
            <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">12 unread</Badge>
          </div>
        </div>
        <div className="divide-y divide-border/60">
          {all.map((n) => {
            const Icon = iconFor(n.severity as string);
            const tone = n.severity === "danger" ? "text-destructive bg-destructive/10" : n.severity === "warning" ? "text-warning bg-warning/10" : n.severity === "success" ? "text-success bg-success/10" : "text-info bg-info/10";
            return (
              <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-muted/40">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="truncate text-sm font-semibold">{n.title}</div>
                    <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
