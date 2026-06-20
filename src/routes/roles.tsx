import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Check, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Access · OctaForce 360" }, { name: "description", content: "Role-based access control across Super Admin, HR, Sales Manager, Field Agent, and more." }] }),
  component: Roles,
});

const roles = [
  { name: "Super Admin", users: 2, color: "text-primary bg-primary/15 border-primary/30" },
  { name: "HR Admin", users: 5, color: "text-info bg-info/15 border-info/30" },
  { name: "Sales Manager", users: 8, color: "text-success bg-success/15 border-success/30" },
  { name: "Team Leader", users: 14, color: "text-warning bg-warning/15 border-warning/30" },
  { name: "Accounts Manager", users: 4, color: "text-accent bg-accent/15 border-accent/30" },
  { name: "Field Agent", users: 50, color: "text-primary bg-primary/15 border-primary/30" },
  { name: "Employee", users: 67, color: "text-muted-foreground bg-muted border-border" },
];

const modules = ["Dashboard", "HRMS", "Attendance", "Payroll", "Leave", "CRM", "Customers", "Invoicing", "Tracking", "Expenses", "Reports", "Roles"];

const matrix: Record<string, boolean[]> = {
  "Super Admin":      [true,true,true,true,true,true,true,true,true,true,true,true],
  "HR Admin":         [true,true,true,true,true,false,false,false,false,false,true,false],
  "Sales Manager":    [true,false,false,false,false,true,true,true,false,false,true,false],
  "Team Leader":      [true,false,true,false,true,true,true,false,true,true,false,false],
  "Accounts Manager": [true,false,false,true,false,false,true,true,false,true,true,false],
  "Field Agent":      [true,false,true,false,true,false,true,false,true,true,false,false],
  "Employee":         [true,false,true,false,true,false,false,false,false,true,false,false],
};

function Roles() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Security"
        title="Roles & Permissions"
        description="Granular RBAC across 7 roles and 12+ modules with JWT-based authentication."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {roles.map((r) => (
          <Card key={r.name} className={`p-3 border ${r.color}`}>
            <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /><span className="text-xs font-bold">{r.name}</span></div>
            <div className="mt-1 font-display text-lg font-bold">{r.users}</div>
            <div className="text-[10px] uppercase opacity-70">users</div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="mb-3 font-display text-base font-bold">Permission Matrix</div>
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="sticky left-0 bg-muted/40">Role</TableHead>
                {modules.map((m) => <TableHead key={m} className="text-center text-[10px]">{m}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(matrix).map(([role, perms]) => (
                <TableRow key={role}>
                  <TableCell className="sticky left-0 bg-background text-sm font-semibold">{role}</TableCell>
                  {perms.map((p, i) => (
                    <TableCell key={i} className="text-center">
                      {p ? <Check className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/40" />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
