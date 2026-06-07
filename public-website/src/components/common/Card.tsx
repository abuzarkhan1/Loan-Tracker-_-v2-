import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export const Card = ({
  children,
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; interactive?: boolean }) => (
  <div
    className={cn(
      "premium-card rounded-xl p-5",
      interactive && "transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-level2",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
