import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Filter, Download, Users, UserCheck, Building, Award, MoreHorizontal, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mock, formatINR } from "@/lib/mock-data";
import { generateReportPdf } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/hrms")({
  head: () => ({ meta: [{ title: "HRMS · OctaForce 360" }, { name: "description", content: "Employee management, departments, designations, and complete HR profiles for OctaForce 360." }] }),
  component: HRMS,
});

function HRMS() {
  const employees = mock.employees.slice(0, 25);
  const deptCounts = mock.employees.reduce<Record<string, number>>((acc, e) => { acc[e.department] = (acc[e.department] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Workforce"
        title="HRMS — Employee Management"
        description="Manage 100 employees across 8 departments with profiles, documents, and salary structures."
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-2 h-3.5 w-3.5" />Export</Button>
            <Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />Add Employee</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Employees" value={mock.totalEmployees} icon={Users} tone="primary" />
        <StatCard label="Active" value={mock.activeEmployees} delta={{ value: "+8 this month", positive: true }} icon={UserCheck} tone="success" />
        <StatCard label="Departments" value={Object.keys(deptCounts).length} icon={Building} tone="info" />
        <StatCard label="Avg Salary" value={formatINR(Math.round(mock.employees.reduce((a,b)=>a+b.salary,0)/mock.employees.length))} icon={Award} tone="warning" />
      </div>

      <Card className="p-4">
        <Tabs defaultValue="all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">All ({mock.totalEmployees})</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="leave">On Leave</TabsTrigger>
              <TabsTrigger value="depts">Departments</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search employees" className="h-9 w-full pl-8 sm:w-56" />
              </div>
              <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <div className="overflow-hidden rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Employee</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="hidden xl:table-cell">Location</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((e) => (
                    <TableRow key={e.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{e.avatar}</AvatarFallback></Avatar>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{e.name}</div>
                            <div className="truncate text-[11px] text-muted-foreground">{e.id} · {e.designation}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-[10px]">{e.department}</Badge></TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-0.5 text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{e.email}</div>
                          <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{e.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm">{e.location}</TableCell>
                      <TableCell className="font-mono text-sm font-semibold">{formatINR(e.salary)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          e.status === "Active" ? "border-success/40 bg-success/10 text-success" :
                          e.status === "On Leave" ? "border-warning/40 bg-warning/10 text-warning" :
                          "border-muted-foreground/40 bg-muted text-muted-foreground"
                        }>{e.status}</Badge>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="depts" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(deptCounts).map(([dept, count]) => (
                <Card key={dept} className="p-4 hover:border-primary/40">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{dept}</div>
                  <div className="mt-1 font-display text-2xl font-bold">{count}</div>
                  <div className="mt-2 text-xs text-muted-foreground">employees</div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
