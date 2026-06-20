import { createFileRoute } from "@tanstack/react-router";
import { Truck, ShoppingBag, IndianRupee, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/procurement")({
  head: () => ({ meta: [
    { title: "Procurement · OctaForce 360" },
    { name: "description", content: "Vendor management and purchase orders with GST tracking." },
  ]}),
  component: ProcurementPage,
});

function ProcurementPage() {
  const totalPO = mock.purchases.reduce((a,b)=>a+b.amount,0);
  const paid = mock.purchases.filter(p=>p.status==="Paid");

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader eyebrow="Operations" title="Vendors & Procurement" description="Manage vendor relationships and track purchase orders across the lifecycle." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Active Vendors" value={mock.vendors.filter(v=>v.status==="Active").length} icon={Truck} tone="primary" />
        <StatCard label="Total Spend" value={formatINR(mock.vendorSpend)} icon={IndianRupee} tone="success" />
        <StatCard label="Open POs" value={mock.purchases.length - paid.length} icon={ShoppingBag} tone="warning" />
        <StatCard label="Avg Vendor Rating" value={(mock.vendors.reduce((a,b)=>a+Number(b.rating),0)/mock.vendors.length).toFixed(1)} icon={Star} tone="info" />
      </div>

      <Tabs defaultValue="po" className="space-y-4">
        <TabsList>
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="po">
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>PO #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="hidden md:table-cell">Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">GST</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Raised By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.purchases.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs font-semibold">{p.id}</TableCell>
                    <TableCell className="text-sm">{p.vendor}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.item}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">{formatINR(p.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right font-mono text-xs">{formatINR(p.gst)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        p.status === "Paid" ? "border-success/40 bg-success/10 text-success" :
                        p.status === "Approved" ? "border-info/40 bg-info/10 text-info" :
                        p.status === "Received" ? "border-warning/40 bg-warning/10 text-warning" :
                        "border-muted-foreground/40 bg-muted text-muted-foreground"
                      }>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">{p.raisedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <p className="mt-3 text-xs text-muted-foreground">Total PO value (90d): <span className="font-mono font-semibold">{formatINR(totalPO)}</span></p>
        </TabsContent>

        <TabsContent value="vendors">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {mock.vendors.map(v => (
              <Card key={v.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">{v.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{v.category} · {v.city}</p>
                  </div>
                  <Badge variant="outline" className={v.status === "Active" ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning"}>{v.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Spend (YTD)</div>
                    <div className="font-mono font-bold text-primary">{formatINR(v.spend)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Rating</div>
                    <div className="flex items-center gap-1 font-mono font-bold"><Star className="h-3 w-3 fill-warning text-warning" />{v.rating}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
