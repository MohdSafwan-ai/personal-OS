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
        "group flex flex-col rounded-xl border bg-card text-card-foreground",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.03)]",
        "transition-shadow duration-300",
        "hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12),0_4px_12px_-4px_rgba(0,0,0,0.08)]",
        "dark:hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-1">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon && (
            <span className="text-muted-foreground/70 transition-colors duration-200 group-hover:text-primary">
              {icon}
            </span>
          )}
          {title}
        </div>
        {action}
      </div>
      <div className={cn("flex-1 px-5 pb-5 pt-2", contentClassName)}>{children}</div>
    </motion.div>
  )
);
DashCard.displayName = "DashCard";
