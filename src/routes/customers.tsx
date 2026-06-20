import { createFileRoute } from "@tanstack/react-router";
import { Plus, Building2, Phone, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers · OctaForce 360" }, { name: "description", content: "Customer profiles with purchase history, interaction timeline, and follow-up tracking." }] }),
  component: Customers,
});

function Customers() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Sales & Revenue"
        title="Customer Management"
        description={`${mock.customers.length} active customers worth ${formatINR(mock.customers.reduce((a,c)=>a+c.revenue,0))} lifetime.`}
        actions={<Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />Add Customer</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Customers" value={mock.customers.length} icon={Building2} tone="primary" />
        <StatCard label="Active This Month" value={42} icon={Phone} tone="success" />
        <StatCard label="Total Revenue" value={formatINR(mock.customers.reduce((a,c)=>a+c.revenue,0))} icon={Mail} tone="info" />
        <StatCard label="Total Orders" value={mock.customers.reduce((a,c)=>a+c.orders,0)} icon={MapPin} tone="warning" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mock.customers.slice(0, 18).map((c) => (
          <Card key={c.id} className="group p-4 transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{c.company}</div>
                <div className="truncate text-xs text-muted-foreground">{c.contact} · {c.city}</div>
              </div>
              <Badge variant="outline" className="text-[10px]">{c.industry}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Revenue</div>
                <div className="font-display text-sm font-bold text-primary">{formatINR(c.revenue)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Orders</div>
                <div className="font-display text-sm font-bold">{c.orders}</div>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">Last visit: {c.lastVisit}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
