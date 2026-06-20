import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mock } from "@/lib/mock-data";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [
    { title: "Support Tickets · OctaForce 360" },
    { name: "description", content: "Multi-channel support tickets with SLA tracking and priority queues." },
  ]}),
  component: TicketsPage,
});

const priorityTone: Record<string, string> = {
  Urgent: "border-destructive/40 bg-destructive/10 text-destructive",
  High: "border-warning/40 bg-warning/10 text-warning",
  Medium: "border-info/40 bg-info/10 text-info",
  Low: "border-muted-foreground/40 bg-muted text-muted-foreground",
};

const statusTone: Record<string, string> = {
  Open: "border-info/40 bg-info/10 text-info",
  "In Progress": "border-warning/40 bg-warning/10 text-warning",
  Waiting: "border-muted-foreground/40 bg-muted text-muted-foreground",
  Resolved: "border-success/40 bg-success/10 text-success",
  Closed: "border-success/40 bg-success/10 text-success",
};

function TicketsPage() {
  const open = mock.tickets.filter(t => !["Resolved","Closed"].includes(t.status));
  const breached = mock.tickets.filter(t => t.sla === "Breached");
  const urgent = mock.tickets.filter(t => t.priority === "Urgent");
  const resolved = mock.tickets.filter(t => t.status === "Resolved" || t.status === "Closed");

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader eyebrow="Customer Success" title="Support Tickets" description="Queues across Email, Phone, Portal, and WhatsApp with live SLA tracking." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Open Tickets" value={open.length} icon={LifeBuoy} tone="primary" />
        <StatCard label="Urgent" value={urgent.length} icon={AlertTriangle} tone="danger" />
        <StatCard label="SLA Breached" value={breached.length} icon={Clock} tone="warning" />
        <StatCard label="Resolved (90d)" value={resolved.length} icon={CheckCircle2} tone="success" />
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Ticket</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Channel</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">SLA</TableHead>
              <TableHead className="hidden md:table-cell">Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mock.tickets.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                <TableCell className="max-w-[260px] truncate text-sm">{t.subject}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{t.customer}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs">{t.channel}</TableCell>
                <TableCell><Badge variant="outline" className={priorityTone[t.priority]}>{t.priority}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={statusTone[t.status]}>{t.status}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className={
                    t.sla === "Breached" ? "border-destructive/40 bg-destructive/10 text-destructive" :
                    t.sla === "At Risk" ? "border-warning/40 bg-warning/10 text-warning" :
                    "border-success/40 bg-success/10 text-success"
                  }>{t.sla}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">{t.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
