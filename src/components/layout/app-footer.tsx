import { Heart } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 px-4 py-3 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-1.5">
          <span>© {new Date().getFullYear()} OctaForce 360.</span>
          <span className="hidden sm:inline">All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Developed by</span>
          <a
            href="#"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Octaleds Pvt Ltd
          </a>
          <Heart className="h-3 w-3 fill-primary text-primary" />
        </div>
      </div>
    </footer>
  );
}
