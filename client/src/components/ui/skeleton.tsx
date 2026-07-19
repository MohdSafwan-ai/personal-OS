import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-foreground/[0.06] after:to-transparent",
        className
      )}
    />
  );
}

/** Skeleton mimicking a dashboard card while data "loads". */
export function CardSkeleton({ tall }: { tall?: boolean }) {
  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="mt-4 space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className={tall ? "h-40 w-full" : "h-16 w-full"} />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
