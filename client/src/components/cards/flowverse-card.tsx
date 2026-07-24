import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DashCard } from "@/components/ui/dash-card";
import { useFlowverse } from "@/lib/queries";

export function FlowverseCard() {
  const { data } = useFlowverse();
  const progress = data?.progress ?? 0;

  return (
    <DashCard
      title="FlowVerse"
      icon={<Globe2 className="h-4 w-4" />}
      action={
        <Link
          to="/flowverse"
          className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
        >
          View world <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
      className="relative overflow-hidden"
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative grid h-24 w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-950/20 to-primary/10">
          <img
            src="/flowverse-world.webp"
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.22)]"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Next unlock
          </p>
          <p className="mt-1 truncate text-sm font-bold">
            {data?.next ? data.next.unlock : "Kingdom complete"}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{progress}%</span>
            <span>{data?.next ? `${data.remaining} BP remaining` : `${data?.buildPoints ?? 0} BP`}</span>
          </div>
        </div>
      </div>
      <div className="relative mt-3 flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-[11px]">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">{data?.current.name ?? "Untouched Island"}</span>
        <span className="ml-auto text-muted-foreground">+{data?.todayBuildPoints ?? 0} BP today</span>
      </div>
    </DashCard>
  );
}
