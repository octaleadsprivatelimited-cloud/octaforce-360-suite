import { createFileRoute } from "@tanstack/react-router";
import { Plus, CalendarDays, Check, Clock, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock } from "@/lib/mock-data";

export const Route = createFileRoute("/leave")({
  head: () => ({ meta: [{ title: "Leave Management · OctaForce 360" }, { name: "description", content: "Casual, Sick, Earned, and LOP leave management with Manager and HR approval workflow." }] }),
  component: Leave,
});

const types = ["Casual Leave", "Sick Leave", "Earned Leave", "Loss of Pay"];
const statuses = ["Approved", "Pending", "Rejected"];

function Leave() {
  const requests = mock.employees.slice(0, 14).map((e, i) => ({
    emp: e,
    type: types[i % types.length],
    from: `2025-12-${String(2 + i).padStart(2, "0")}`,
    to: `2025-12-${String(3 + i).padStart(2, "0")}`,
    days: (i % 3) + 1,
    status: statuses[i % statuses.length],
    reason: ["Family function", "Medical", "Personal work", "Vacation"][i % 4],
  }));

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Workforce"
        title="Leave Management"
        description="Workflow: Employee → Manager → HR. Team calendar and holiday list included."
        actions={<Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />Apply Leave</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Pending Requests" value={7} icon={Clock} tone="warning" />
        <StatCard label="Approved (MTD)" value={28} icon={Check} tone="success" />
        <StatCard label="Rejected" value={3} icon={X} tone="danger" />
        <StatCard label="On Leave Today" value={mock.employees.filter(e=>e.status==="On Leave").length} icon={CalendarDays} tone="info" />
      </div>

      <Card className="p-4">
        <div className="mb-4 font-display text-base font-bold">Recent Requests</div>
        <div className="space-y-2">
          {requests.map((r, i) => (
            <Card key={i} className="grid gap-3 p-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{r.emp.avatar}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{r.emp.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{r.type} · {r.days} day{r.days>1?"s":""} · {r.reason}</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground sm:text-right">
                <div>{r.from}</div><div>→ {r.to}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={r.status==="Approved" ? "border-success/40 bg-success/10 text-success" : r.status==="Pending" ? "border-warning/40 bg-warning/10 text-warning" : "border-destructive/40 bg-destructive/10 text-destructive"}>{r.status}</Badge>
                {r.status==="Pending" && <><Button size="sm" variant="outline" className="h-7 text-[11px]">Approve</Button></>}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
