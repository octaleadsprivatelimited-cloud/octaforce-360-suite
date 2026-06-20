import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileText, DollarSign, Clock, AlertCircle, Download, Share2, Mail, MessageCircle, Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mock, formatINR, type Invoice } from "@/lib/mock-data";
import { downloadInvoicePdf, invoiceShareText, shareInvoiceEmail, shareInvoiceWhatsApp } from "@/lib/invoice-pdf";
import { logActivity } from "@/lib/invoice-activity";
import { InvoiceDetailsSheet } from "@/components/invoice-details-sheet";
import { generateReportPdf } from "@/lib/pdf-report";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Invoicing · OctaForce 360" }, { name: "description", content: "GST-compliant invoicing, quotations, proforma invoices, and payment tracking." }] }),
  component: Invoices,
});

function Invoices() {
  const paid = mock.invoices.filter(i=>i.status==="Paid");
  const pending = mock.invoices.filter(i=>i.status==="Pending");
  const overdue = mock.invoices.filter(i=>i.status==="Overdue");
  const [shareInv, setShareInv] = useState<Invoice | null>(null);
  const [detailsInv, setDetailsInv] = useState<Invoice | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const openShare = (inv: Invoice) => {
    setShareInv(inv);
    setEmail("");
    setPhone("");
    setMessage(invoiceShareText(inv));
  };

  const sendEmail = () => {
    if (!shareInv) return;
    if (email) {
      const subject = encodeURIComponent(`Invoice ${shareInv.id} from OctaForce 360`);
      const body = encodeURIComponent(message);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } else {
      shareInvoiceEmail(shareInv);
    }
    logActivity(shareInv, "email", email || "manual recipient");
    toast.success(`Email draft opened for ${shareInv.id}`);
  };

  const sendWhatsApp = () => {
    if (!shareInv) return;
    const text = encodeURIComponent(message);
    const num = phone.replace(/\D/g, "");
    const url = num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener");
    logActivity(shareInv, "whatsapp", phone || "manual recipient");
    toast.success(`WhatsApp opened for ${shareInv.id}`);
    void shareInvoiceWhatsApp;
  };

  const handleDownload = (inv: Invoice) => {
    downloadInvoicePdf(inv);
    logActivity(inv, "download");
    toast.success(`${inv.id}.pdf downloaded`);
  };

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
                <TableHead className="w-32 text-right">Actions</TableHead>
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
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View details" onClick={() => setDetailsInv(inv)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Download PDF" onClick={() => handleDownload(inv)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Share" onClick={() => openShare(inv)}>
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!shareInv} onOpenChange={(o) => !o && setShareInv(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Share Invoice {shareInv?.id}</DialogTitle>
            <DialogDescription>
              Send the GST invoice PDF to your customer via Email or WhatsApp.
            </DialogDescription>
          </DialogHeader>

          {shareInv && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-3">
                <div>
                  <div className="text-xs text-muted-foreground">{shareInv.customer}</div>
                  <div className="font-mono text-sm font-semibold">{formatINR(shareInv.total)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(shareInv)}>
                    <Eye className="mr-2 h-3.5 w-3.5" />Preview PDF
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="share-email" className="text-xs">Recipient Email</Label>
                  <Input id="share-email" type="email" placeholder="ap@customer.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="share-phone" className="text-xs">WhatsApp Number</Label>
                  <Input id="share-phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="share-msg" className="text-xs">Message</Label>
                <Textarea id="share-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => shareInv && handleDownload(shareInv)}>
              <Download className="mr-2 h-3.5 w-3.5" />Download PDF
            </Button>
            <Button variant="outline" onClick={sendEmail}>
              <Mail className="mr-2 h-3.5 w-3.5" />Send Email
            </Button>
            <Button className="gradient-primary text-secondary" onClick={sendWhatsApp}>
              <MessageCircle className="mr-2 h-3.5 w-3.5" />Send WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InvoiceDetailsSheet
        invoice={detailsInv}
        open={!!detailsInv}
        onOpenChange={(o) => !o && setDetailsInv(null)}
        onShare={(inv) => { setDetailsInv(null); openShare(inv); }}
      />
    </div>
  );
}
