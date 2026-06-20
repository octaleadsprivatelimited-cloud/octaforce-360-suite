import { createFileRoute } from "@tanstack/react-router";
import { Plus, ListChecks, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock } from "@/lib/mock-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks · OctaForce 360" }, { name: "description", content: "Assign and track tasks with priority, due dates, and status across teams." }] }),
  component: Tasks,
});

const columns = ["Pending", "In Progress", "Completed", "Delayed"] as const;
const priorities = ["High", "Medium", "Low"];
const titles = [
  "Follow up with Tata Steel proposal", "Prepare Q4 sales report", "Onboard 3 new sales reps",
  "Review pending invoices", "Client call with Reliance Retail", "Update CRM with last week's leads",
  "Submit GST returns", "Field route optimization for Mumbai zone", "Approve pending leave requests",
  "Prepare payroll for December", "Customer satisfaction survey", "Renew vendor contracts",
];

function Tasks() {
  const tasksByCol = columns.map((c, ci) =>
    titles.slice(ci * 3, ci * 3 + 3).map((t, i) => ({
      title: t,
      priority: priorities[i % 3],
      due: `Dec ${15 + i + ci * 2}`,
      assignee: mock.employees[(ci * 7 + i) % mock.employees.length],
    }))
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Productivity"
        title="Task Management"
        description="Kanban view of all team tasks with assignees, priority, and due dates."
        actions={<Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />New Task</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Pending" value={18} icon={Clock} tone="warning" />
        <StatCard label="In Progress" value={24} icon={ListChecks} tone="info" />
        <StatCard label="Completed" value={56} icon={CheckCircle2} tone="success" />
        <StatCard label="Delayed" value={4} icon={AlertCircle} tone="danger" />
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {columns.map((c, ci) => (
          <div key={c} className="min-w-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${c==="Pending"?"bg-warning":c==="In Progress"?"bg-info":c==="Completed"?"bg-success":"bg-destructive"}`} />
                <span className="text-xs font-semibold">{c}</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{tasksByCol[ci].length}</Badge>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-2 space-y-2">
              {tasksByCol[ci].map((t, i) => (
                <Card key={i} className="p-3 hover:border-primary/40">
                  <div className="text-sm font-medium leading-snug">{t.title}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className={`text-[10px] ${t.priority==="High"?"border-destructive/40 text-destructive":t.priority==="Medium"?"border-warning/40 text-warning":"border-muted-foreground/40 text-muted-foreground"}`}>{t.priority}</Badge>
                    <div className="text-[10px] text-muted-foreground">{t.due}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2">
                    <Avatar className="h-5 w-5"><AvatarFallback className="bg-primary/15 text-[9px] font-bold text-primary">{t.assignee.avatar}</AvatarFallback></Avatar>
                    <div className="truncate text-[10px] text-muted-foreground">{t.assignee.name}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
