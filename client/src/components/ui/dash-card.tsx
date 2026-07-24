import { motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashCardProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/** Shared card shell: lifts slightly on hover with a deeper shadow. */
export const DashCard = forwardRef<HTMLDivElement, DashCardProps>(
  ({ title, icon, action, children, className, contentClassName }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "group flex min-w-0 flex-col rounded-[18px] border bg-card text-card-foreground",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.03)]",
        "transition-shadow duration-300",
        "hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12),0_4px_12px_-4px_rgba(0,0,0,0.08)]",
        "dark:bg-card/90 dark:shadow-none dark:hover:border-primary/25 dark:hover:shadow-[0_0_32px_-16px_hsl(var(--primary)/0.28)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
          {icon && (
            <span className="text-muted-foreground/70 transition-colors duration-200 group-hover:text-primary">
              {icon}
            </span>
          )}
          {title}
        </div>
        {action}
      </div>
      <div className={cn("min-w-0 flex-1 px-4 pb-4 pt-2 sm:px-5 sm:pb-5", contentClassName)}>{children}</div>
    </motion.div>
  )
);
DashCard.displayName = "DashCard";
