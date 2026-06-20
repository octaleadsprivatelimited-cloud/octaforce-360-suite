import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Clock, MapPin, Radio, UserCheck, Target, Building2,
  FileText, Wallet, CalendarDays, Receipt, ListChecks, Bell, BarChart3,
  ShieldCheck, Smartphone, Sparkles, Zap, ShoppingCart, LifeBuoy, Truck, Megaphone,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const groups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Notifications", url: "/notifications", icon: Bell, badge: "12" },
    ],
  },
  {
    label: "Workforce",
    items: [
      { title: "HRMS", url: "/hrms", icon: Users },
      { title: "Attendance", url: "/attendance", icon: Clock },
      { title: "Leave Management", url: "/leave", icon: CalendarDays },
      { title: "Payroll", url: "/payroll", icon: Wallet },
    ],
  },
  {
    label: "Field Force",
    items: [
      { title: "Live Tracking", url: "/tracking", icon: MapPin, badge: "LIVE" },
      { title: "GPS Alerts", url: "/gps-alerts", icon: Radio },
      { title: "Customer Visits", url: "/visits", icon: UserCheck },
      { title: "Expenses", url: "/expenses", icon: Receipt },
    ],
  },
  {
    label: "Sales & Revenue",
    items: [
      { title: "Sales Overview", url: "/sales", icon: ShoppingCart },
      { title: "Sales CRM", url: "/crm", icon: Target },
      { title: "Customers", url: "/customers", icon: Building2 },
      { title: "Invoicing", url: "/invoices", icon: FileText },
      { title: "Tasks", url: "/tasks", icon: ListChecks },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Support Tickets", url: "/tickets", icon: LifeBuoy },
      { title: "Procurement", url: "/procurement", icon: Truck },
      { title: "Workplace Hub", url: "/workplace", icon: Megaphone },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Reports & Analytics", url: "/reports", icon: BarChart3 },
      { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
      { title: "Roles & Access", url: "/roles", icon: ShieldCheck },
      { title: "Mobile App", url: "/mobile", icon: Smartphone },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary shadow-glow">
            <Zap className="h-5 w-5 text-secondary" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="font-display text-base font-bold leading-tight text-sidebar-foreground">
              OctaForce <span className="text-primary">360</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              Enterprise Suite
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {g.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className={`h-5 px-1.5 text-[10px] font-semibold ${
                              item.badge === "LIVE"
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : "bg-primary/20 text-primary border-primary/30"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/50 p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI Assistant
          </div>
          <p className="mt-1 text-[11px] text-sidebar-foreground/70">
            12 productivity insights ready to review
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
