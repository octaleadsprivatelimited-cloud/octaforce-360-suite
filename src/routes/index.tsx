import { createFileRoute } from "@tanstack/react-router";
import {
  Users, UserCheck, UserX, Target, TrendingUp, FileText, MapPin, Wifi,
  Plus, Download, Filter, ArrowUpRight, Trophy, AlertTriangle, Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, FunnelChart, Funnel, LabelList, LineChart, Line,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { MockMap } from "@/components/mock-map";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mock, revenueSeries, attendanceSeries, funnel, activityFeed, formatINR } from "@/lib/mock-data";
import { generateReportPdf } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · OctaForce 360" },
      { name: "description", content: "Executive overview of workforce, sales, attendance, revenue, and live field operations across OctaForce 360." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const exportSnapshot = () => {
    generateReportPdf({
      title: "Executive Dashboard Snapshot",
      subtitle: "Daily operations · all departments",
      kpis: [
        { label: "Total Employees", value: mock.totalEmployees },
        { label: "Present Today", value: mock.presentToday },
        { label: "Open Pipeline", value: mock.openLeads },
        { label: "MRR (Paid)", value: formatINR(mock.monthlyRevenue) },
      ],
      sections: [
        {
          heading: "Revenue Trend (last 9 months)",
          columns: ["Month", "Revenue", "Target"],
          rows: revenueSeries.map((r) => [r.m, formatINR(r.revenue), formatINR(r.target)]),
        },
        {
          heading: "Sales Funnel",
          columns: ["Stage", "Count"],
          rows: funnel.map((f) => [f.stage, f.count]),
        },
        {
          heading: "Recent Activity",
          columns: ["Who", "What", "When"],
          rows: activityFeed.map((a) => [a.who, a.what, a.when]),
        },
      ],
      fileName: "octaforce-dashboard-snapshot.pdf",
    });
    toast.success("Dashboard snapshot PDF downloaded");
  };
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Super Admin · Live"
        title="Good morning, Ravi 👋"
        description="Here's what's happening across all 8 departments and 47 active field agents today."
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Filter className="mr-2 h-3.5 w-3.5" />Filter</Button>
            <Button variant="outline" size="sm" onClick={exportSnapshot}><Download className="mr-2 h-3.5 w-3.5" />Export PDF</Button>
            <Button size="sm" className="gradient-primary text-secondary hover:opacity-90"><Plus className="mr-2 h-3.5 w-3.5" />New</Button>
          </>
        }
      />

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Employees" value={mock.totalEmployees} delta={{ value: "+12 this month", positive: true }} icon={Users} tone="primary" sparkline={[60, 65, 70, 78, 85, 88, 92, 100]} />
        <StatCard label="Present Today" value={mock.presentToday} delta={{ value: "92% attendance", positive: true }} icon={UserCheck} tone="success" sparkline={[78, 82, 80, 85, 88, 90, 84, 92]} />
        <StatCard label="Absent Today" value={mock.absentToday} delta={{ value: "-3 vs avg", positive: true }} icon={UserX} tone="warning" />
        <StatCard label="Open Leads" value={mock.openLeads} delta={{ value: "+18 this week", positive: true }} icon={Target} tone="info" sparkline={[40, 45, 50, 48, 55, 62, 68, 75]} />
        <StatCard label="Monthly Revenue" value={formatINR(mock.monthlyRevenue)} delta={{ value: "+24.6% MoM", positive: true }} icon={TrendingUp} tone="success" sparkline={[30, 38, 35, 48, 52, 60, 68, 82]} />
        <StatCard label="Pending Invoices" value={mock.pendingInvoices} delta={{ value: formatINR(2840000) + " due", positive: false }} icon={FileText} tone="danger" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Active Field Agents" value={mock.activeFieldAgents} icon={MapPin} tone="primary" />
        <StatCard label="GPS Active Now" value={mock.gpsActiveUsers} delta={{ value: "Live", positive: true }} icon={Wifi} tone="success" />
        <StatCard label="Won Leads (MTD)" value={mock.wonLeads} icon={Trophy} tone="success" />
        <StatCard label="GPS Alerts" value={3} delta={{ value: "Needs attention", positive: false }} icon={AlertTriangle} tone="danger" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Revenue */}
        <Card className="overflow-hidden p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Revenue Analytics</div>
              <div className="font-display text-lg font-bold">{formatINR(mock.monthlyRevenue)} <span className="text-xs font-medium text-success">▲ 24.6%</span></div>
            </div>
            <div className="flex gap-1.5 text-[11px]">
              <Badge variant="outline" className="border-primary/40 text-primary">Revenue</Badge>
              <Badge variant="outline" className="border-accent/40 text-accent">Target</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tgt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
              <Area type="monotone" dataKey="target" stroke="var(--color-chart-2)" strokeWidth={2} strokeDasharray="4 4" fill="url(#tgt)" />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Lead funnel */}
        <Card className="p-5">
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sales Funnel</div>
            <div className="font-display text-lg font-bold">680 active deals</div>
          </div>
          <div className="space-y-3">
            {funnel.map((f, i) => {
              const pct = (f.count / funnel[0].count) * 100;
              return (
                <div key={f.stage}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{f.stage}</span>
                    <span className="text-muted-foreground">{f.count} · {pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: `var(--color-chart-${i+1})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
            <div>
              <div className="text-muted-foreground">Win Rate</div>
              <div className="font-display text-base font-bold text-success">8.75%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Avg Cycle</div>
              <div className="font-display text-base font-bold">14 days</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Attendance · Last 14 Days</div>
              <div className="font-display text-lg font-bold">92% avg attendance</div>
            </div>
            <div className="flex gap-1.5 text-[10px]">
              <Badge variant="outline" className="border-success/40 text-success">Present</Badge>
              <Badge variant="outline" className="border-warning/40 text-warning">Late</Badge>
              <Badge variant="outline" className="border-destructive/40 text-destructive">Absent</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
              <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="present" stackId="a" fill="var(--color-success)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="late" stackId="a" fill="var(--color-warning)" />
              <Bar dataKey="absent" stackId="a" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live Activity</div>
            <Badge variant="outline" className="border-success/40 bg-success/10 text-success text-[10px]">
              <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-success" />LIVE
            </Badge>
          </div>
          <div className="space-y-3">
            {activityFeed.slice(0, 6).map((a, i) => (
              <div key={i} className="flex gap-2.5 text-xs">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-muted text-[10px]">{a.who.split(" ").map(w=>w[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="leading-snug">
                    <span className="font-semibold">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Map */}
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Field Force · Live GPS Tracking</div>
            <div className="font-display text-lg font-bold">{mock.gpsActiveUsers} agents on the move</div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/tracking" className="inline-flex items-center">Open Map<ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></a>
          </Button>
        </div>
        <div className="p-4">
          <MockMap height="h-[420px]" />
        </div>
      </Card>

      {/* AI Insights teaser */}
      <Card className="relative overflow-hidden border-primary/30 p-5">
        <div className="absolute inset-0 opacity-30 shimmer-bg" />
        <div className="relative grid gap-4 sm:grid-cols-[auto_1fr_auto]">
          <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-base font-bold">AI Insights ready</div>
            <p className="text-sm text-muted-foreground">3 high-conversion leads detected · 2 underperforming routes · 1 attendance anomaly flagged.</p>
          </div>
          <Button asChild className="gradient-primary text-secondary hover:opacity-90">
            <a href="/ai-insights">Review</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
