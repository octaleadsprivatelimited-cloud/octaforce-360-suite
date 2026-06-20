import { createFileRoute } from "@tanstack/react-router";
import { Plus, Receipt, Fuel, Plane, Utensils, Hotel, Package } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/expenses")({
  head: () => ({ meta: [{ title: "Expenses · OctaForce 360" }, { name: "description", content: "Field expense claims for Fuel, Travel, Food, Hotel, and Miscellaneous with bill uploads." }] }),
  component: Expenses,
});

const categories = [
  { label: "Fuel", icon: Fuel, tone: "primary" as const },
  { label: "Travel", icon: Plane, tone: "info" as const },
  { label: "Food", icon: Utensils, tone: "warning" as const },
  { label: "Hotel", icon: Hotel, tone: "success" as const },
  { label: "Misc", icon: Package, tone: "danger" as const },
];

function Expenses() {
  const claims = mock.employees.slice(0, 12).map((e, i) => ({
    emp: e,
    cat: categories[i % categories.length],
    amount: (i + 1) * 480 + 200,
    date: `2025-12-${String(2+i).padStart(2, "0")}`,
    status: ["Approved", "Pending", "Approved", "Reimbursed"][i % 4],
    desc: ["Cab to client meeting", "Petrol — Mumbai-Pune", "Team lunch with client", "Stay at Vivanta", "Misc supplies"][i % 5],
  }));

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Field Force"
        title="Expense Management"
        description="Claim and approve field expenses with bill uploads and category breakdowns."
        actions={<Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />New Claim</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {categories.map((c) => (
          <StatCard key={c.label} label={c.label} value={formatINR((c.label==="Hotel"?28400:c.label==="Travel"?42100:18200))} icon={c.icon} tone={c.tone} />
        ))}
      </div>

      <Card className="p-4">
        <div className="mb-4 font-display text-base font-bold">Recent Claims</div>
        <div className="space-y-2">
          {claims.map((c, i) => (
            <Card key={i} className="grid gap-3 p-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{c.emp.avatar}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.emp.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{c.desc} · {c.date}</div>
                </div>
              </div>
              <Badge variant="outline" className="self-center text-[10px]"><c.cat.icon className="mr-1 h-2.5 w-2.5" />{c.cat.label}</Badge>
              <div className="flex items-center gap-2 self-center">
                <div className="font-mono text-sm font-bold">{formatINR(c.amount)}</div>
                <Badge variant="outline" className={c.status==="Approved" || c.status==="Reimbursed" ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning"}>{c.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
