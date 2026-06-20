import { createFileRoute } from "@tanstack/react-router";
import { Plus, FileText, DollarSign, Clock, AlertCircle, Download, Share2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Invoicing · OctaForce 360" }, { name: "description", content: "GST-compliant invoicing, quotations, proforma invoices, and payment tracking." }] }),
  component: Invoices,
});

function Invoices() {
  const paid = mock.invoices.filter(i=>i.status==="Paid");
  const pending = mock.invoices.filter(i=>i.status==="Pending");
  const overdue = mock.invoices.filter(i=>i.status==="Overdue");
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Sales & Revenue"
        title="Invoicing & GST"
        description="Generate quotations, proforma, and GST invoices with CGST/SGST/IGST support."
        actions={<>
          <Button variant="outline" size="sm"><Download className="mr-2 h-3.5 w-3.5" />Export</Button>
          <Button size="sm" className="gradient-primary text-secondary"><Plus className="mr-2 h-3.5 w-3.5" />New Invoice</Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Invoiced" value={formatINR(mock.invoices.reduce((a,b)=>a+b.total,0))} icon={FileText} tone="primary" />
        <StatCard label="Paid" value={formatINR(paid.reduce((a,b)=>a+b.total,0))} delta={{ value: `${paid.length} invoices`, positive: true }} icon={DollarSign} tone="success" />
        <StatCard label="Pending" value={formatINR(pending.reduce((a,b)=>a+b.total,0))} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={formatINR(overdue.reduce((a,b)=>a+b.total,0))} delta={{ value: `${overdue.length} invoices`, positive: false }} icon={AlertCircle} tone="danger" />
      </div>

      <Card className="p-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({mock.invoices.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Issued</TableHead>
                <TableHead className="hidden lg:table-cell">Due</TableHead>
                <TableHead className="hidden sm:table-cell">GST</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mock.invoices.slice(0, 20).map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs font-semibold">{inv.id}</TableCell>
                  <TableCell className="text-sm">{inv.customer}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{inv.issuedAt}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{inv.dueAt}</TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-xs">{formatINR(inv.gst)}</TableCell>
                  <TableCell className="font-mono text-sm font-bold">{formatINR(inv.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      inv.status==="Paid" ? "border-success/40 bg-success/10 text-success" :
                      inv.status==="Pending" ? "border-warning/40 bg-warning/10 text-warning" :
                      inv.status==="Overdue" ? "border-destructive/40 bg-destructive/10 text-destructive" :
                      "border-muted-foreground/40 bg-muted text-muted-foreground"
                    }>{inv.status}</Badge>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-7 w-7"><Share2 className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
