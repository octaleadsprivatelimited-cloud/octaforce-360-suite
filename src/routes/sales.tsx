import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, Package, TrendingUp, Target, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [
    { title: "Sales · OctaForce 360" },
    { name: "description", content: "Sales orders, product catalogue, rep quota attainment, and revenue performance." },
  ]}),
  component: SalesPage,
});

function statusTone(s: string) {
  return s === "Delivered" ? "border-success/40 bg-success/10 text-success"
    : s === "Shipped" ? "border-info/40 bg-info/10 text-info"
    : s === "Packed" ? "border-warning/40 bg-warning/10 text-warning"
    : s === "Cancelled" ? "border-destructive/40 bg-destructive/10 text-destructive"
    : "border-border bg-muted text-muted-foreground";
}

function SalesPage() {
  const delivered = mock.orders.filter(o => o.status === "Delivered");
  const cancelled = mock.orders.filter(o => o.status === "Cancelled");
  const avgAttainment = Math.round(mock.quotas.reduce((a,b)=>a+b.attainment,0) / mock.quotas.length);
  const topProducts = [...mock.products].sort((a,b)=>b.revenue-a.revenue).slice(0,6);

  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Revenue Operations"
        title="Sales Overview"
        description="Orders, product performance, and rep quota tracking across all channels."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Orders (90d)" value={mock.totalOrders} icon={ShoppingCart} tone="primary" />
        <StatCard label="Order Revenue" value={formatINR(mock.orderRevenue)} icon={IndianRupee} tone="success" delta={{ value: "+18.4%", positive: true }} />
        <StatCard label="Delivered" value={delivered.length} icon={Package} tone="info" />
        <StatCard label="Avg Quota Attainment" value={`${avgAttainment}%`} icon={Target} tone="warning" />
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="quotas">Rep Quotas</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Rep</TableHead>
                  <TableHead className="hidden sm:table-cell">Channel</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Placed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.orders.slice(0, 20).map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs font-semibold">{o.id}</TableCell>
                    <TableCell className="text-sm">{o.customer}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{o.rep}</TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-xs">{o.channel}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-xs">{o.items}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">{formatINR(o.total)}</TableCell>
                    <TableCell><Badge variant="outline" className={statusTone(o.status)}>{o.status}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{o.placedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          {cancelled.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">{cancelled.length} cancelled order{cancelled.length === 1 ? "" : "s"} excluded from revenue totals.</p>
          )}
        </TabsContent>

        <TabsContent value="products">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {topProducts.map(p => (
              <Card key={p.sku} className="p-4">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">{p.sku}</span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold">{p.name}</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div className="font-mono font-bold">{formatINR(p.price)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Sold</div>
                    <div className="font-mono font-bold">{p.sold}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Revenue</div>
                    <div className="font-mono font-bold text-primary">{formatINR(p.revenue)}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Stock</span>
                  <span className={p.stock < 100 ? "font-mono text-warning" : "font-mono text-success"}>{p.stock === 999 ? "Unlimited" : p.stock}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotas">
          <Card className="p-4">
            <div className="space-y-4">
              {mock.quotas.map(q => (
                <div key={q.rep} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-mono text-[10px] font-bold text-primary">{q.avatar}</div>
                      <div>
                        <div className="font-medium">{q.rep}</div>
                        <div className="text-[11px] text-muted-foreground">{q.city} · {q.deals} deals · Pipeline {formatINR(q.pipeline)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold">{formatINR(q.achieved)} <span className="text-muted-foreground">/ {formatINR(q.target)}</span></div>
                      <div className={`text-[11px] font-semibold ${q.attainment >= 100 ? "text-success" : q.attainment >= 70 ? "text-warning" : "text-destructive"}`}>
                        <TrendingUp className="mr-1 inline h-3 w-3" />{q.attainment}% attainment
                      </div>
                    </div>
                  </div>
                  <Progress value={Math.min(q.attainment, 100)} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
