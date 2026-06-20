import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, TrendingUp, Users, Target, MapPin } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revenueSeries, mock, formatINR } from "@/lib/mock-data";
import { generateReportPdf } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics · OctaForce 360" }, { name: "description", content: "HR, sales, and field-force reports with exportable insights." }] }),
  component: Reports,
});

const conversionData = [
  { m: "Jul", rate: 5.2 }, { m: "Aug", rate: 6.1 }, { m: "Sep", rate: 7.4 },
  { m: "Oct", rate: 8.0 }, { m: "Nov", rate: 8.6 }, { m: "Dec", rate: 9.1 },
];

const departmentRevenue = [
  { dept: "Sales", value: 4200000, fill: "var(--color-chart-1)" },
  { dept: "Field Force", value: 2800000, fill: "var(--color-chart-2)" },
  { dept: "Support", value: 1100000, fill: "var(--color-chart-3)" },
  { dept: "Marketing", value: 700000, fill: "var(--color-chart-4)" },
];

function Reports() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Insights"
        title="Reports & Analytics"
        description="Cross-module reports: attendance, payroll, lead conversion, route productivity, and more."
        actions={<Button size="sm" className="gradient-primary text-secondary"><Download className="mr-2 h-3.5 w-3.5" />Export All</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Lead Conversion Rate</div>
              <div className="font-display text-lg font-bold">9.1% <span className="text-xs text-success">▲ 3.9pp YoY</span></div>
            </div>
            <Badge variant="outline" className="border-success/40 text-success">Trending up</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="rate" stroke="var(--color-chart-1)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Revenue by Department</div>
              <div className="font-display text-lg font-bold">{formatINR(8800000)} this quarter</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={departmentRevenue} dataKey="value" nameKey="dept" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={2}>
                {departmentRevenue.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">9-Month Revenue Trend</div>
            <div className="font-display text-lg font-bold">{formatINR(revenueSeries.reduce((a,b)=>a+b.revenue,0))}</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
              <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[6,6,0,0]} />
              <Bar dataKey="target" fill="var(--color-chart-2)" radius={[6,6,0,0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { title: "HR Reports", desc: "Attendance · Leave · Payroll", icon: Users, count: 12 },
          { title: "Sales Reports", desc: "Lead conversion · Revenue · Targets", icon: Target, count: 9 },
          { title: "Field Force Reports", desc: "Routes · Visits · Location history", icon: MapPin, count: 7 },
        ].map((r) => (
          <Card key={r.title} className="group p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary"><r.icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{r.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.desc}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="text-muted-foreground">{r.count} reports available</span>
              <span className="text-primary font-semibold">View →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
