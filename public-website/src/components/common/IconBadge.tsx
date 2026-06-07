import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export type Tone = "primary" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-mint text-success",
  warning: "bg-yellow text-warning",
  danger: "bg-danger/10 text-danger",
};

export const IconBadge = ({
  icon: Icon,
  tone = "primary",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
}) => (
  <span className={cn("grid size-10 place-items-center rounded-lg border border-border/60", toneClasses[tone], className)}>
    <Icon size={18} strokeWidth={2.2} />
  </span>
);
