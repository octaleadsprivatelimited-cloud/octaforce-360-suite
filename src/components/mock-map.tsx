import { mock } from "@/lib/mock-data";
import { MapPin, Navigation } from "lucide-react";

const statusColor: Record<string, string> = {
  Online: "bg-success",
  Working: "bg-primary",
  Traveling: "bg-info",
  Idle: "bg-warning",
  Offline: "bg-muted-foreground",
};

export function MockMap({ height = "h-[520px]" }: { height?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border/60 ${height}`}>
      {/* Map base */}
      <div className="absolute inset-0 bg-[oklch(0.22_0.03_240)] dark:bg-[oklch(0.18_0.025_245)]">
        {/* Grid */}
        <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.6 0.05 240)" strokeWidth="0.5" opacity="0.3" />
            </pattern>
            <pattern id="grid2" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="oklch(0.7 0.08 240)" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
        {/* Faux roads */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 0 30 Q 25 35 50 28 T 100 32" stroke="oklch(0.45 0.04 240)" strokeWidth="0.6" fill="none" opacity="0.7" />
          <path d="M 0 65 Q 30 60 55 68 T 100 62" stroke="oklch(0.45 0.04 240)" strokeWidth="0.6" fill="none" opacity="0.7" />
          <path d="M 22 0 Q 25 50 28 100" stroke="oklch(0.45 0.04 240)" strokeWidth="0.5" fill="none" opacity="0.7" />
          <path d="M 72 0 Q 68 50 75 100" stroke="oklch(0.45 0.04 240)" strokeWidth="0.5" fill="none" opacity="0.7" />
          <path d="M 0 0 L 100 100" stroke="oklch(0.4 0.04 240)" strokeWidth="0.3" fill="none" opacity="0.5" />
        </svg>
        {/* Glow zones */}
        <div className="absolute left-[18%] top-[22%] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[20%] top-[55%] h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
      </div>

      {/* Agents */}
      {mock.liveAgents.map((a) => (
        <div
          key={a.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${a.x}%`, top: `${a.y}%` }}
        >
          <div className="relative">
            {a.liveStatus !== "Offline" && (
              <span className={`absolute inset-0 -m-1 animate-pulse-ring rounded-full ${statusColor[a.liveStatus]} opacity-50`} />
            )}
            <div className={`relative grid h-7 w-7 place-items-center rounded-full ${statusColor[a.liveStatus]} ring-2 ring-background shadow-lg`}>
              <span className="text-[9px] font-bold text-white">{a.avatar}</span>
            </div>
          </div>
          <div className="invisible absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 rounded-lg border border-border bg-popover p-2.5 text-popover-foreground opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
            <div className="text-xs font-semibold">{a.name}</div>
            <div className="text-[10px] text-muted-foreground">{a.designation} · {a.location}</div>
            <div className="mt-1.5 flex items-center justify-between text-[10px]">
              <span className={`rounded-full px-1.5 py-0.5 font-semibold text-white ${statusColor[a.liveStatus]}`}>
                {a.liveStatus}
              </span>
              <span className="text-muted-foreground">{a.lastSeen}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Controls overlay */}
      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
        <div className="rounded-lg border border-border/60 bg-background/90 px-2.5 py-1.5 text-xs font-semibold backdrop-blur">
          <div className="flex items-center gap-1.5 text-primary">
            <MapPin className="h-3 w-3" /> Live Field Map
          </div>
          <div className="text-[10px] font-normal text-muted-foreground">India · Real-time GPS</div>
        </div>
      </div>
      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <button className="grid h-7 w-7 place-items-center rounded-md border border-border/60 bg-background/90 text-sm font-bold backdrop-blur hover:bg-background">+</button>
        <button className="grid h-7 w-7 place-items-center rounded-md border border-border/60 bg-background/90 text-sm font-bold backdrop-blur hover:bg-background">−</button>
        <button className="grid h-7 w-7 place-items-center rounded-md border border-border/60 bg-background/90 backdrop-blur hover:bg-background"><Navigation className="h-3 w-3" /></button>
      </div>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {Object.entries(statusColor).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/90 px-2 py-1 text-[10px] font-medium backdrop-blur">
            <span className={`h-1.5 w-1.5 rounded-full ${v}`} />
            {k}
          </div>
        ))}
      </div>
    </div>
  );
}
