import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label, value, delta, icon: Icon, tone = "default", sparkline,
}: {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  icon: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  sparkline?: number[];
}) {
  const toneMap: Record<string, string> = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
  };

  return (
    <Card className="group relative overflow-hidden border-border/60 p-4 transition-all hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1.5 font-display text-2xl font-bold tracking-tight">{value}</div>
          {delta && (
            <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${delta.positive ? "text-success" : "text-destructive"}`}>
              {delta.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta.value}
            </div>
          )}
        </div>
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {sparkline && (
        <svg viewBox="0 0 100 24" className="mt-2 h-6 w-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary/70"
            points={sparkline
              .map((v, i) => {
                const x = (i / (sparkline.length - 1)) * 100;
                const min = Math.min(...sparkline);
                const max = Math.max(...sparkline);
                const y = 22 - ((v - min) / (max - min || 1)) * 20;
                return `${x},${y}`;
              })
              .join(" ")}
          />
        </svg>
      )}
    </Card>
  );
}
