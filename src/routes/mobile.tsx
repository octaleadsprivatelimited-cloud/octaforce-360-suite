import { createFileRoute } from "@tanstack/react-router";
import {
  Smartphone, Wifi, Battery, Signal, Home, Target, MapPin, ListChecks, User,
  LogIn, Camera, Bell, Plus, Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mock, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/mobile")({
  head: () => ({ meta: [{ title: "Mobile App · OctaForce 360" }, { name: "description", content: "Preview of the OctaForce 360 mobile app for field agents and employees." }] }),
  component: Mobile,
});

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mx-auto w-[280px]">
        <div className="rounded-[2.2rem] border-[10px] border-secondary bg-secondary p-1 shadow-2xl">
          <div className="relative h-[560px] overflow-hidden rounded-[1.6rem] bg-background">
            {/* status bar */}
            <div className="flex h-6 items-center justify-between bg-secondary px-4 text-[9px] font-medium text-secondary-foreground">
              <span>9:41</span>
              <span className="flex items-center gap-1"><Signal className="h-2.5 w-2.5" /><Wifi className="h-2.5 w-2.5" /><Battery className="h-2.5 w-2.5" /></span>
            </div>
            <div className="h-[calc(100%-1.5rem)] overflow-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  const me = mock.employees[0];
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Companion App"
        title="Mobile Field App"
        description="iOS & Android app for attendance, customer visits, expense uploads, and live GPS — preview below."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Login */}
        <Frame label="Login">
          <div className="flex h-full flex-col bg-gradient-to-b from-secondary to-background p-5 text-secondary-foreground">
            <div className="mt-6 grid place-items-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow"><Smartphone className="h-7 w-7 text-secondary" /></div>
            </div>
            <div className="mt-4 text-center">
              <div className="font-display text-lg font-bold">OctaForce <span className="text-primary">360</span></div>
              <div className="text-[10px] opacity-70">Field Force Companion</div>
            </div>
            <div className="mt-6 space-y-2.5">
              <div className="rounded-lg bg-background/10 px-3 py-2.5 text-[11px]">📱 +91 98765 43210</div>
              <div className="rounded-lg bg-background/10 px-3 py-2.5 text-[11px]">🔐 ••••••</div>
              <button className="w-full rounded-lg gradient-primary py-2.5 text-xs font-bold text-secondary"><LogIn className="mr-1.5 inline h-3 w-3" />Sign in</button>
            </div>
            <div className="mt-auto pt-4 text-center text-[9px] opacity-60">v3.4.1 · India</div>
          </div>
        </Frame>

        {/* Dashboard */}
        <Frame label="Dashboard">
          <div className="bg-background">
            <div className="gradient-secondary p-4 text-secondary-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-primary"><AvatarFallback className="bg-primary text-[10px] font-bold text-secondary">{me.avatar}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] opacity-70">Good morning</div>
                  <div className="truncate text-sm font-semibold">{me.name}</div>
                </div>
                <Bell className="h-4 w-4" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Card className="bg-background/10 p-2 border-0">
                  <div className="text-[9px] opacity-70">Today</div>
                  <div className="font-display text-base font-bold">6 visits</div>
                </Card>
                <Card className="bg-background/10 p-2 border-0">
                  <div className="text-[9px] opacity-70">Earnings</div>
                  <div className="font-display text-base font-bold">₹2.4K</div>
                </Card>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</div>
              <div className="grid grid-cols-4 gap-1.5">
                {[{i:MapPin,l:"Check In"},{i:Camera,l:"Visit"},{i:Target,l:"Lead"},{i:Plus,l:"Expense"}].map((a,i)=>(
                  <Card key={i} className="grid place-items-center p-2.5">
                    <a.i className="h-4 w-4 text-primary" />
                    <div className="mt-1 text-[8px] font-medium">{a.l}</div>
                  </Card>
                ))}
              </div>
              <div className="pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today's Visits</div>
              {mock.visits.slice(0,3).map((v)=>(
                <Card key={v.id} className="p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0"><div className="truncate text-[11px] font-semibold">{v.customer}</div><div className="text-[9px] text-muted-foreground">{v.checkIn} · {v.duration}</div></div>
                    <Badge variant="outline" className="text-[8px] h-4 px-1">{v.status}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Frame>

        {/* Attendance */}
        <Frame label="Attendance">
          <div className="flex h-full flex-col p-4">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Friday, 20 Dec</div>
              <div className="font-display text-3xl font-bold">09:42 AM</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Card className="p-2.5"><div className="text-[9px] text-muted-foreground">Check In</div><div className="font-mono text-sm font-bold text-success">09:12</div></Card>
              <Card className="p-2.5"><div className="text-[9px] text-muted-foreground">Working</div><div className="font-mono text-sm font-bold">0h 30m</div></Card>
            </div>
            <div className="mt-4 grid place-items-center">
              <button className="relative grid h-32 w-32 place-items-center rounded-full gradient-primary shadow-glow">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/40" />
                <div className="relative text-center text-secondary">
                  <MapPin className="mx-auto h-8 w-8" />
                  <div className="mt-1 text-[10px] font-bold">CHECK OUT</div>
                </div>
              </button>
            </div>
            <div className="mt-4 rounded-lg bg-muted p-2.5 text-[10px]">
              <div className="flex items-center gap-1.5 text-success"><MapPin className="h-3 w-3" />GPS Active · 4m accuracy</div>
              <div className="mt-1 text-muted-foreground">Mumbai, Andheri East</div>
            </div>
          </div>
        </Frame>

        {/* CRM */}
        <Frame label="My Leads">
          <div className="p-3 space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search" className="w-full rounded-lg bg-muted py-1.5 pl-7 text-[11px] focus:outline-none" />
            </div>
            {mock.leads.slice(0,5).map((l)=>(
              <Card key={l.id} className="p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0"><div className="truncate text-[11px] font-semibold">{l.company}</div><div className="text-[9px] text-muted-foreground">{l.name} · {l.source}</div></div>
                  <Badge variant="outline" className="text-[8px] h-4 px-1">{l.stage}</Badge>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="font-mono text-[10px] font-bold text-primary">{formatINR(l.value)}</div>
                  <div className="text-[9px] text-warning">★ {l.score}</div>
                </div>
              </Card>
            ))}
          </div>
        </Frame>
      </div>

      <Card className="p-4">
        <div className="mb-3 font-display text-base font-bold">Bottom Navigation</div>
        <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-2xl border border-border/60 bg-card p-2">
          {[{i:Home,l:"Dashboard"},{i:Target,l:"CRM"},{i:MapPin,l:"Visits"},{i:ListChecks,l:"Tasks"},{i:User,l:"Profile"}].map((b,i)=>(
            <div key={i} className={`grid place-items-center rounded-lg p-2 text-[9px] ${i===0?"bg-primary/15 text-primary":""}`}>
              <b.i className="h-4 w-4" />
              <span className="mt-0.5 font-medium">{b.l}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
