import type { Invoice } from "@/lib/mock-data";

export type InvoiceActivityAction = "download" | "email" | "whatsapp" | "view";

export type InvoiceActivity = {
  id: string;
  invoiceId: string;
  action: InvoiceActivityAction;
  actor: string;
  target?: string;
  at: string; // ISO
};

const KEY = "octaforce.invoiceActivity.v1";
const ACTOR_KEY = "octaforce.currentUser";

export function currentActor(): string {
  if (typeof window === "undefined") return "System";
  return localStorage.getItem(ACTOR_KEY) || "Aarav Sharma (Admin)";
}

function readAll(): InvoiceActivity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(rows: InvoiceActivity[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows.slice(0, 500)));
  window.dispatchEvent(new CustomEvent("invoice-activity-changed"));
}

export function getActivity(invoiceId: string): InvoiceActivity[] {
  return readAll()
    .filter((r) => r.invoiceId === invoiceId)
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function logActivity(
  inv: Invoice,
  action: InvoiceActivityAction,
  target?: string,
) {
  const all = readAll();
  all.unshift({
    id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    invoiceId: inv.id,
    action,
    actor: currentActor(),
    target,
    at: new Date().toISOString(),
  });
  writeAll(all);
}

export function actionLabel(a: InvoiceActivityAction): string {
  return a === "download"
    ? "Downloaded PDF"
    : a === "email"
      ? "Shared via Email"
      : a === "whatsapp"
        ? "Shared via WhatsApp"
        : "Viewed";
}

export function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}
