import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatINR, type Invoice } from "@/lib/mock-data";

const COMPANY = {
  name: "OctaForce 360 Pvt Ltd",
  address: "12th Floor, Tower B, Cyber City, Gurugram, Haryana 122002",
  gstin: "06AABCO1234F1Z5",
  pan: "AABCO1234F",
  email: "billing@octaforce.in",
  phone: "+91 80 4567 8900",
  web: "www.octaforce.in",
};

export function buildInvoicePdf(inv: Invoice): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(35, 47, 62);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 153, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("OctaForce 360", 40, 35);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Enterprise Sales & Field Force Suite", 40, 52);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", W - 40, 35, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`GSTIN: ${COMPANY.gstin}`, W - 40, 52, { align: "right" });

  // From / To
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  let y = 95;
  doc.setFont("helvetica", "bold");
  doc.text("From", 40, y);
  doc.text("Bill To", W / 2 + 10, y);
  doc.setFont("helvetica", "normal");
  y += 14;
  doc.text(COMPANY.name, 40, y);
  doc.text(inv.customer, W / 2 + 10, y);
  y += 12;
  const addrLines = doc.splitTextToSize(COMPANY.address, W / 2 - 60);
  doc.text(addrLines, 40, y);
  doc.text("India", W / 2 + 10, y);
  y += addrLines.length * 12;
  doc.text(`Email: ${COMPANY.email}`, 40, y);
  doc.text(`PAN: ${COMPANY.pan}`, 40, y + 12);

  // Invoice meta box
  const metaY = 95;
  doc.setDrawColor(220);
  doc.setFillColor(247, 248, 250);
  doc.rect(40, metaY + 70, W - 80, 50, "FD");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice #", 50, metaY + 88);
  doc.text("Issue Date", 200, metaY + 88);
  doc.text("Due Date", 340, metaY + 88);
  doc.text("Status", 460, metaY + 88);
  doc.setFont("helvetica", "normal");
  doc.text(inv.id, 50, metaY + 105);
  doc.text(inv.issuedAt, 200, metaY + 105);
  doc.text(inv.dueAt, 340, metaY + 105);
  doc.text(inv.status, 460, metaY + 105);

  // Line items (synthesized from invoice totals)
  const items = synthesizeItems(inv);
  autoTable(doc, {
    startY: metaY + 140,
    head: [["#", "Description", "HSN", "Qty", "Rate", "Amount"]],
    body: items.map((it, i) => [
      String(i + 1),
      it.desc,
      it.hsn,
      String(it.qty),
      formatINR(it.rate),
      formatINR(it.qty * it.rate),
    ]),
    theme: "grid",
    headStyles: { fillColor: [35, 47, 62], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 30 },
      3: { halign: "right", cellWidth: 40 },
      4: { halign: "right", cellWidth: 80 },
      5: { halign: "right", cellWidth: 90 },
    },
    margin: { left: 40, right: 40 },
  });

  // Totals
  // @ts-expect-error lastAutoTable injected by autotable
  const afterY: number = doc.lastAutoTable.finalY + 14;
  const cgst = Math.round(inv.gst / 2);
  const sgst = inv.gst - cgst;
  const rows: [string, string][] = [
    ["Subtotal", formatINR(inv.subtotal)],
    ["CGST @ 9%", formatINR(cgst)],
    ["SGST @ 9%", formatINR(sgst)],
    ["Total (INR)", formatINR(inv.total)],
  ];
  doc.setFontSize(9);
  rows.forEach((r, idx) => {
    const yy = afterY + idx * 16;
    const bold = idx === rows.length - 1;
    if (bold) {
      doc.setFillColor(255, 153, 0);
      doc.rect(W - 240, yy - 12, 200, 18, "F");
      doc.setTextColor(35, 47, 62);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    }
    doc.text(r[0], W - 230, yy);
    doc.text(r[1], W - 50, yy, { align: "right" });
  });

  // Footer
  doc.setTextColor(120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const footY = doc.internal.pageSize.getHeight() - 50;
  doc.text(
    "Terms: Payment due within 30 days. Late payments attract 1.5% interest per month.",
    40,
    footY,
  );
  doc.text(
    `${COMPANY.web} · ${COMPANY.phone} · ${COMPANY.email}`,
    40,
    footY + 14,
  );
  doc.text("This is a computer-generated invoice.", W - 40, footY + 14, {
    align: "right",
  });

  return doc;
}

function synthesizeItems(inv: Invoice) {
  // Split subtotal into 2-3 plausible line items
  const base = inv.subtotal;
  const a = Math.round(base * 0.6);
  const b = base - a;
  return [
    { desc: "OctaForce 360 — Enterprise License (Annual)", hsn: "998314", qty: 1, rate: a },
    { desc: "Implementation, Onboarding & Training", hsn: "998313", qty: 1, rate: b },
  ];
}

export function downloadInvoicePdf(inv: Invoice) {
  const doc = buildInvoicePdf(inv);
  doc.save(`${inv.id}.pdf`);
}

export function invoiceShareText(inv: Invoice) {
  return `Hi, please find invoice ${inv.id} for ${inv.customer}.\nAmount: ${formatINR(inv.total)} (incl. GST)\nIssued: ${inv.issuedAt} · Due: ${inv.dueAt}\n\n— OctaForce 360`;
}

export function shareInvoiceWhatsApp(inv: Invoice) {
  const text = encodeURIComponent(invoiceShareText(inv));
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
}

export function shareInvoiceEmail(inv: Invoice) {
  const subject = encodeURIComponent(`Invoice ${inv.id} from OctaForce 360`);
  const body = encodeURIComponent(invoiceShareText(inv));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
