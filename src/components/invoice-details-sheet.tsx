import { useEffect, useState } from "react";
import { Download, Mail, MessageCircle, Eye, Clock, FileText, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatINR, type Invoice } from "@/lib/mock-data";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { actionLabel, formatRelative, getActivity, logActivity, type InvoiceActivity, type InvoiceActivityAction } from "@/lib/invoice-activity";
import { toast } from "sonner";

const iconFor: Record<InvoiceActivityAction, typeof Download> = {
  download: Download,
  email: Mail,
  whatsapp: MessageCircle,
  view: Eye,
};

const toneFor: Record<InvoiceActivityAction, string> = {
  download: "text-primary bg-primary/10 border-primary/30",
  email: "text-info bg-info/10 border-info/30",
  whatsapp: "text-success bg-success/10 border-success/30",
  view: "text-muted-foreground bg-muted border-border",
};

export function InvoiceDetailsSheet({
  invoice,
  open,
  onOpenChange,
  onShare,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onShare: (inv: Invoice) => void;
}) {
  const [log, setLog] = useState<InvoiceActivity[]>([]);

  useEffect(() => {
    if (!invoice || !open) return;
    setLog(getActivity(invoice.id));
    logActivity(invoice, "view");
    const refresh = () => setLog(getActivity(invoice.id));
    window.addEventListener("invoice-activity-changed", refresh);
    return () => window.removeEventListener("invoice-activity-changed", refresh);
  }, [invoice, open]);

  if (!invoice) return null;
  const cgst = Math.round(invoice.gst / 2);
  const sgst = invoice.gst - cgst;

  const handleDownload = () => {
    downloadInvoicePdf(invoice);
    logActivity(invoice, "download");
    toast.success(`${invoice.id}.pdf downloaded`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[640px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">{invoice.id}</Badge>
            <Badge variant="outline" className={
              invoice.status === "Paid" ? "border-success/40 bg-success/10 text-success" :
              invoice.status === "Pending" ? "border-warning/40 bg-warning/10 text-warning" :
              invoice.status === "Overdue" ? "border-destructive/40 bg-destructive/10 text-destructive" :
              "border-muted-foreground/40 bg-muted text-muted-foreground"
            }>{invoice.status}</Badge>
          </div>
          <SheetTitle className="text-xl">{invoice.customer}</SheetTitle>
          <SheetDescription>
            GST tax invoice · Issued {invoice.issuedAt} · Due {invoice.dueAt}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-3.5 w-3.5" />Download PDF
          </Button>
          <Button size="sm" className="gradient-primary text-secondary" onClick={() => onShare(invoice)}>
            <MessageCircle className="mr-2 h-3.5 w-3.5" />Share
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Subtotal" value={formatINR(invoice.subtotal)} />
          <Stat label="CGST 9%" value={formatINR(cgst)} />
          <Stat label="SGST 9%" value={formatINR(sgst)} />
          <Stat label="Total" value={formatINR(invoice.total)} accent />
        </div>

        <Separator className="my-5" />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Activity Log</h3>
            </div>
            <Badge variant="outline" className="text-xs">{log.length} events</Badge>
          </div>

          {log.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-6 text-center">
              <FileText className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">No activity yet. Download or share to log events.</p>
            </div>
          ) : (
            <ScrollArea className="h-[320px] rounded-lg border border-border/60">
              <ol className="relative">
                {log.map((ev, idx) => {
                  const Icon = iconFor[ev.action];
                  return (
                    <li key={ev.id} className="relative flex gap-3 border-b border-border/40 p-3 last:border-b-0">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${toneFor[ev.action]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">{actionLabel(ev.action)}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(ev.at)}</span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{ev.actor}</span>
                          {ev.target && (
                            <>
                              <span>·</span>
                              <span className="font-mono">{ev.target}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {idx === 0 && (
                        <Badge variant="outline" className="absolute right-3 top-3 hidden border-primary/30 bg-primary/10 text-[10px] text-primary sm:block">
                          Latest
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ol>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${accent ? "border-primary/40 bg-primary/10" : "border-border/60 bg-muted/30"}`}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-sm font-bold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
