import { createFileRoute } from "@tanstack/react-router";
import { Camera, QrCode, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Smartphone, Wifi } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock, attendanceSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance · OctaForce 360" }, { name: "description", content: "GPS, Selfie, and QR attendance tracking with daily, weekly, and monthly reports." }] }),
  component: Attendance,
});

function Attendance() {
  const today = mock.employees.slice(0, 12);
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Workforce"
        title="Attendance Management"
        description="Triple-verified attendance via GPS, selfie face-match, and QR codes."
        actions={<Button size="sm" className="gradient-primary text-secondary"><MapPin className="mr-2 h-3.5 w-3.5" />Mark Attendance</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Present Today" value={mock.presentToday} icon={CheckCircle2} tone="success" />
        <StatCard label="Absent Today" value={mock.absentToday} icon={XCircle} tone="danger" />
        <StatCard label="Late Arrivals" value={6} icon={AlertCircle} tone="warning" />
        <StatCard label="Attendance %" value="92.4%" delta={{ value: "+1.8%", positive: true }} icon={Clock} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: MapPin, title: "GPS Attendance", desc: "Geo-fenced check-in with lat/long & device info", count: 64, tone: "primary" },
          { icon: Camera, title: "Selfie Attendance", desc: "Face verification + GPS validation", count: 22, tone: "info" },
          { icon: QrCode, title: "QR Attendance", desc: "Scan office QR for instant marking", count: 8, tone: "success" },
        ].map((m) => (
          <Card key={m.title} className="group p-5 transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${m.tone === "primary" ? "bg-primary/15 text-primary" : m.tone === "info" ? "bg-info/15 text-info" : "bg-success/15 text-success"}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{m.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{m.desc}</div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-3">
              <div>
                <div className="font-display text-2xl font-bold">{m.count}</div>
                <div className="text-[10px] uppercase text-muted-foreground">check-ins today</div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">Configure →</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">14-Day Trend</div>
            <div className="font-display text-lg font-bold">Attendance by day</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={attendanceSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="present" fill="var(--color-success)" radius={[4,4,0,0]} />
            <Bar dataKey="late" fill="var(--color-warning)" radius={[4,4,0,0]} />
            <Bar dataKey="absent" fill="var(--color-destructive)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <Tabs defaultValue="today">
          <TabsList>
            <TabsTrigger value="today">Today's Log</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4">
            <div className="overflow-hidden rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Employee</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="hidden md:table-cell">Check In</TableHead>
                    <TableHead className="hidden md:table-cell">Check Out</TableHead>
                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                    <TableHead className="hidden xl:table-cell">Device</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {today.map((e, i) => {
                    const method = ["GPS", "Selfie", "QR"][i % 3];
                    return (
                      <TableRow key={e.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{e.avatar}</AvatarFallback></Avatar>
                            <div className="min-w-0"><div className="truncate text-sm font-medium">{e.name}</div><div className="truncate text-[10px] text-muted-foreground">{e.department}</div></div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{method === "GPS" && <MapPin className="mr-1 h-2.5 w-2.5" />}{method === "Selfie" && <Camera className="mr-1 h-2.5 w-2.5" />}{method === "QR" && <QrCode className="mr-1 h-2.5 w-2.5" />}{method}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs">09:{12 + i}</TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs">18:0{i % 9}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{e.location}</TableCell>
                        <TableCell className="hidden xl:table-cell"><div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Smartphone className="h-2.5 w-2.5" />Android · <Wifi className="h-2.5 w-2.5" />4G</div></TableCell>
                        <TableCell><Badge variant="outline" className="border-success/40 bg-success/10 text-success text-[10px]">Present</Badge></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
