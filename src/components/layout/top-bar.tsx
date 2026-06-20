import { Bell, Search, Sun, Moon, Settings, LogOut, ChevronDown, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notifications } from "@/lib/mock-data";

export function TopBar() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/80 px-3 backdrop-blur-xl sm:gap-3 sm:px-5">
      <SidebarTrigger className="-ml-1" />

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search employees, leads, invoices…"
          className="h-9 border-border/60 bg-muted/40 pl-9 text-sm focus-visible:bg-background"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1 md:hidden" />

      <Badge variant="outline" className="hidden h-7 gap-1.5 border-success/40 bg-success/10 text-success lg:flex">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        <span className="text-[11px] font-semibold">Live · 47 agents online</span>
      </Badge>

      <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="h-9 w-9">
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Button variant="ghost" size="icon" className="hidden h-9 w-9 sm:flex">
        <HelpCircle className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
              12
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-semibold">Notifications</div>
            <Badge variant="secondary" className="text-[10px]">12 new</Badge>
          </div>
          <div className="max-h-80 overflow-auto">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 border-b border-border/50 px-4 py-3 last:border-0 hover:bg-muted/40">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.severity === "danger" ? "bg-destructive" :
                  n.severity === "success" ? "bg-success" :
                  n.severity === "warning" ? "bg-warning" : "bg-info"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{n.body}</div>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-muted/60">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="gradient-primary text-[10px] font-bold text-secondary">RA</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold leading-tight">Ravi Agarwal</div>
              <div className="text-[10px] leading-tight text-muted-foreground">Super Admin</div>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Settings className="mr-2 h-3.5 w-3.5" />Settings</DropdownMenuItem>
          <DropdownMenuItem><HelpCircle className="mr-2 h-3.5 w-3.5" />Help & Docs</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-3.5 w-3.5" />Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
