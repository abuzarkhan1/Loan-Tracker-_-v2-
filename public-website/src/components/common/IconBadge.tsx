import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export type Tone = "primary" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  primary: "bg-white/5 text-white border-white/5",
  success: "bg-emerald-950/20 text-emerald-400 border-emerald-500/10",
  warning: "bg-amber-950/20 text-amber-400 border-amber-500/10",
  danger: "bg-rose-950/20 text-rose-400 border-rose-500/10",
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
  <span className={cn("grid size-10 place-items-center rounded-xl border", toneClasses[tone], className)}>
    <Icon size={18} strokeWidth={2} className="opacity-95" />
  </span>
);
