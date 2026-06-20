import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, Brain, Route as RouteIcon, Target, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights · OctaForce 360" }, { name: "description", content: "AI-powered predictions for attendance, sales, productivity, lead scoring, and route optimization." }] }),
  component: AI,
});

const insights = [
  { icon: Brain, tone: "primary", title: "Attendance Anomaly Detected", body: "Sales team attendance dropped 8% this week. AI suggests reviewing Friday WFH policy.", confidence: 92 },
  { icon: TrendingUp, tone: "success", title: "Sales Prediction · Q1 2026", body: "Projected revenue ₹78.4L (+18% QoQ). High confidence based on current pipeline velocity.", confidence: 87 },
  { icon: Target, tone: "info", title: "3 High-Conversion Leads", body: "Tata Steel, Reliance Retail, HDFC Bank — all show buying signals. Recommend immediate outreach.", confidence: 94 },
  { icon: Zap, tone: "warning", title: "Productivity Insight", body: "Top 10% of field agents cover 2.3× more visits. Sharing route patterns could lift team average by 14%.", confidence: 81 },
  { icon: RouteIcon, tone: "primary", title: "Route Optimization", body: "Mumbai zone routes can save 84 km/day by reordering visit sequence. Est. ₹1.2L/month fuel savings.", confidence: 96 },
  { icon: Sparkles, tone: "info", title: "Employee Productivity Score", body: "12 employees showing improvement signals. 3 may need coaching intervention this month.", confidence: 78 },
];

const toneMap: Record<string, string> = {
  primary: "bg-primary/15 text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  info: "bg-info/15 text-info border-info/30",
  warning: "bg-warning/15 text-warning border-warning/30",
};

function AI() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <PageHeader
        eyebrow="Sparkles · AI"
        title="AI Insights & Predictions"
        description="Machine learning models analyzing 2,000+ data points across your organization in real-time."
        actions={<Button size="sm" className="gradient-primary text-secondary"><Sparkles className="mr-2 h-3.5 w-3.5" />Train Model</Button>}
      />

      <Card className="relative overflow-hidden border-primary/30 p-5">
        <div className="absolute inset-0 opacity-20 shimmer-bg" />
        <div className="relative grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Model Accuracy</div>
            <div className="font-display text-3xl font-bold">94.2%</div>
            <div className="text-xs text-muted-foreground">Across last 30 days</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Insights Generated</div>
            <div className="font-display text-3xl font-bold">147</div>
            <div className="text-xs text-muted-foreground">This week</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Actions Taken</div>
            <div className="font-display text-3xl font-bold">38</div>
            <div className="text-xs text-muted-foreground">Acted on by managers</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((i, idx) => (
          <Card key={idx} className="group p-5 transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${toneMap[i.tone]}`}>
                <i.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{i.title}</div>
                  <Badge variant="outline" className="text-[10px]">AI</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <span className="font-medium text-muted-foreground">Confidence</span>
                    <span className="font-bold text-primary">{i.confidence}%</span>
                  </div>
                  <Progress value={i.confidence} className="h-1.5" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-border/60 pt-3">
              <Button variant="outline" size="sm" className="flex-1">Dismiss</Button>
              <Button size="sm" className="flex-1 gradient-primary text-secondary">Take Action</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
