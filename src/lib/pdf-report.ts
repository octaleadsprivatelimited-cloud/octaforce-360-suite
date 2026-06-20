import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COMPANY = {
  name: "OctaForce 360 Pvt Ltd",
  tagline: "Enterprise Sales · HRMS · Field Force Suite",
  web: "www.octaforce.in",
  phone: "+91 80 4567 8900",
  email: "hello@octaforce.in",
  gstin: "06AABCO1234F1Z5",
  developer: "Developed by Octaleds Pvt Ltd",
};

export type ReportKpi = { label: string; value: string | number };
export type ReportSection = {
  heading: string;
  columns: string[];
  rows: (string | number)[][];
  summary?: string;
};

export type ReportOptions = {
  title: string;
  subtitle?: string;
  kpis?: ReportKpi[];
  sections: ReportSection[];
  notes?: string[];
  fileName?: string;
};

function drawHeader(doc: jsPDF, title: string, subtitle?: string) {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(35, 47, 62);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 153, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("OctaForce 360", 40, 32);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(COMPANY.tagline, 40, 48);
  doc.setFontSize(8);
  doc.text(`GSTIN: ${COMPANY.gstin}`, 40, 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(title.toUpperCase(), W - 40, 32, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  if (subtitle) doc.text(subtitle, W - 40, 48, { align: "right" });
  doc.text(`Generated · ${new Date().toLocaleString("en-IN")}`, W - 40, 60, { align: "right" });
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(230);
    doc.line(40, H - 40, W - 40, H - 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`${COMPANY.web} · ${COMPANY.phone} · ${COMPANY.email}`, 40, H - 26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 153, 0);
    doc.text(COMPANY.developer, 40, H - 14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${pageCount}`, W - 40, H - 14, { align: "right" });
  }
}

export function generateReportPdf(opts: ReportOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  drawHeader(doc, opts.title, opts.subtitle);

  let y = 95;

  // KPIs row
  if (opts.kpis && opts.kpis.length) {
    const cols = Math.min(opts.kpis.length, 4);
    const cardW = (W - 80 - (cols - 1) * 10) / cols;
    opts.kpis.slice(0, 4).forEach((k, i) => {
      const x = 40 + i * (cardW + 10);
      doc.setDrawColor(220);
      doc.setFillColor(247, 248, 250);
      doc.rect(x, y, cardW, 54, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(110);
      doc.text(k.label.toUpperCase(), x + 10, y + 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(35, 47, 62);
      doc.text(String(k.value), x + 10, y + 40);
    });
    y += 70;
  }

  // Sections
  opts.sections.forEach((section, idx) => {
    if (idx > 0) y += 10;
    if (y > 720) { doc.addPage(); drawHeader(doc, opts.title, opts.subtitle); y = 95; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(35, 47, 62);
    doc.text(section.heading, 40, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [section.columns],
      body: section.rows.map((r) => r.map((c) => String(c))),
      theme: "grid",
      headStyles: { fillColor: [35, 47, 62], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      alternateRowStyles: { fillColor: [250, 251, 253] },
      margin: { left: 40, right: 40 },
    });
    // @ts-expect-error lastAutoTable from autotable plugin
    y = doc.lastAutoTable.finalY + 8;

    if (section.summary) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(110);
      doc.text(section.summary, 40, y);
      y += 14;
    }
  });

  // Notes
  if (opts.notes && opts.notes.length) {
    if (y > 700) { doc.addPage(); drawHeader(doc, opts.title, opts.subtitle); y = 95; }
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(35, 47, 62);
    doc.text("Notes", 40, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80);
    opts.notes.forEach((n) => {
      const lines = doc.splitTextToSize(`• ${n}`, W - 80);
      doc.text(lines, 40, y);
      y += lines.length * 11;
    });
  }

  drawFooter(doc);
  const fileName = opts.fileName || `${opts.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;
  doc.save(fileName);
}
