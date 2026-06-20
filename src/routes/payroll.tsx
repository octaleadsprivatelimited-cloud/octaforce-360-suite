import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Calendar, FileText, Download, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock, formatINR } from "@/lib/mock-data";
import { generateReportPdf } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/payroll")({
  head: () => ({ meta: [{ title: "Payroll · OctaForce 360" }, { name: "description", content: "Salary processing with Basic, HRA, PF, ESI, professional tax, and instant payslip generation." }] }),
  component: Payroll,
});

function Payroll() {
  const total = mock.employees.reduce((a,b)=>a+b.salary,0);
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Workforce"
        title="Payroll Management"
        description="Process December 2025 payroll. PF, ESI, PT, and TDS automatically calculated."
        actions={<>
          <Button variant="outline" size="sm"><Download className="mr-2 h-3.5 w-3.5" />Payslips</Button>
          <Button size="sm" className="gradient-primary text-secondary"><Wallet className="mr-2 h-3.5 w-3.5" />Run Payroll</Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Gross Payout" value={formatINR(total)} icon={Wallet} tone="primary" />
        <StatCard label="Net Payable" value={formatINR(Math.round(total*0.82))} delta={{ value: "After deductions", positive: true }} icon={TrendingUp} tone="success" />
        <StatCard label="PF + ESI" value={formatINR(Math.round(total*0.13))} icon={FileText} tone="info" />
        <StatCard label="Pay Date" value="30 Dec" icon={Calendar} tone="warning" />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-display text-base font-bold">December 2025 Payroll</div>
          <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning">Draft · Approve before 28 Dec</Badge>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Basic</TableHead>
                <TableHead className="hidden md:table-cell">HRA</TableHead>
                <TableHead className="hidden lg:table-cell">PF</TableHead>
                <TableHead className="hidden lg:table-cell">ESI</TableHead>
                <TableHead className="hidden xl:table-cell">PT</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mock.employees.slice(0, 15).map((e) => {
                const basic = Math.round(e.salary*0.5);
                const hra = Math.round(e.salary*0.2);
                const pf = Math.round(basic*0.12);
                const esi = e.salary < 25000 ? Math.round(e.salary*0.0175) : 0;
                const pt = 200;
                const net = e.salary - pf - esi - pt;
                return (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">{e.avatar}</AvatarFallback></Avatar>
                        <div className="min-w-0"><div className="truncate text-sm font-medium">{e.name}</div><div className="truncate text-[10px] text-muted-foreground">{e.id}</div></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{formatINR(basic)}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{formatINR(hra)}</TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-destructive">-{formatINR(pf)}</TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-destructive">-{formatINR(esi)}</TableCell>
                    <TableCell className="hidden xl:table-cell font-mono text-xs text-destructive">-₹{pt}</TableCell>
                    <TableCell className="font-mono text-sm font-bold text-success">{formatINR(net)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
