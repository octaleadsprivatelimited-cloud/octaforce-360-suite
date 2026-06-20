import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useRouterState
} from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { AppFooter } from "@/components/layout/app-footer";
import { Toaster } from "@/components/ui/sonner";

import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That route isn't part of OctaForce 360.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Try again</button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "OctaForce 360 — HRMS, CRM, Field Force & Payroll" },
      { name: "description", content: "Enterprise SaaS suite for HRMS, Sales CRM, Attendance, Payroll, Invoicing, and Live Field Force Management." },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const matches = useRouterState({
    select: (state) => state.matches,
  });

  useEffect(() => {
    const matchedRouteWithHead = [...matches]
      .reverse()
      .find((match) => {
        const route = (match as any).route;
        return route && route.options && typeof route.options.head === "function";
      });

    if (matchedRouteWithHead) {
      try {
        const headFn = (matchedRouteWithHead as any).route.options.head;
        const headData = headFn();
        if (headData && headData.meta) {
          const titleMeta = headData.meta.find((m: any) => m.title);
          if (titleMeta && titleMeta.title) {
            document.title = titleMeta.title;
          } else {
            const ogTitle = headData.meta.find((m: any) => m.property === "og:title" || m.name === "twitter:title");
            if (ogTitle && ogTitle.content) {
              document.title = ogTitle.content;
            }
          }

          const descMeta = headData.meta.find((m: any) => m.name === "description");
          if (descMeta && descMeta.content) {
            const metaTag = document.querySelector('meta[name="description"]');
            if (metaTag) {
              metaTag.setAttribute("content", descMeta.content);
            }
          }
        }
      } catch (err) {
        console.error("Failed to update page metadata:", err);
      }
    }
  }, [matches]);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="min-w-0 flex-1">
            <TopBar />
            <main className="min-w-0 flex-1 p-4 sm:p-5 lg:p-6">
              <Outlet />
            </main>
            <AppFooter />
          </SidebarInset>
        </div>
        <Toaster position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
