import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, GraduationCap, Laptop, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/workplace")({
  head: () => ({ meta: [
    { title: "Workplace · OctaForce 360" },
    { name: "description", content: "Announcements, training, IT assets, and refund credit notes in one place." },
  ]}),
  component: WorkplacePage,
});

function WorkplacePage() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader eyebrow="Operations" title="Workplace Hub" description="Company-wide announcements, learning, assets, and credit notes." />

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList>
          <TabsTrigger value="news"><Megaphone className="mr-1.5 h-3.5 w-3.5" />Announcements</TabsTrigger>
          <TabsTrigger value="training"><GraduationCap className="mr-1.5 h-3.5 w-3.5" />Training</TabsTrigger>
          <TabsTrigger value="assets"><Laptop className="mr-1.5 h-3.5 w-3.5" />Assets</TabsTrigger>
          <TabsTrigger value="refunds"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Credit Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-3">
          {mock.announcements.map(a => (
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] text-primary">{a.tag}</Badge>
                    <span className="text-[11px] text-muted-foreground">{a.author} · {a.at}</span>
                  </div>
                  <h3 className="text-sm font-semibold">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="training">
          <Card className="p-4 space-y-4">
            {mock.trainings.map(t => {
              const pct = Math.round((t.completed / t.enrolled) * 100);
              return (
                <div key={t.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold">{t.title}</span>
                      <span className="ml-2 text-[11px] text-muted-foreground">{t.category} · {t.hours}h · Deadline {t.deadline}</span>
                    </div>
                    <span className="font-mono text-xs">{t.completed}/{t.enrolled} ({pct}%)</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Brand · Serial</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell">Condition</TableHead>
                  <TableHead className="hidden lg:table-cell">Warranty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.assets.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs font-semibold">{a.id}</TableCell>
                    <TableCell className="text-sm">{a.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{a.brand} · <span className="font-mono">{a.serial}</span></TableCell>
                    <TableCell className="text-sm">{a.assignee}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={
                        a.condition === "Excellent" || a.condition === "Good" ? "border-success/40 bg-success/10 text-success" :
                        a.condition === "Fair" ? "border-warning/40 bg-warning/10 text-warning" :
                        "border-destructive/40 bg-destructive/10 text-destructive"
                      }>{a.condition}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{a.warrantyEnds}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Credit Note</TableHead>
                  <TableHead>Against Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Reason</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.refunds.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs font-semibold">{r.id}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.invoice}</TableCell>
                    <TableCell className="text-sm">{r.customer}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{r.reason}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">{formatINR(r.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        r.status === "Processed" ? "border-success/40 bg-success/10 text-success" :
                        r.status === "Approved" ? "border-info/40 bg-info/10 text-info" :
                        r.status === "Rejected" ? "border-destructive/40 bg-destructive/10 text-destructive" :
                        "border-warning/40 bg-warning/10 text-warning"
                      }>{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
