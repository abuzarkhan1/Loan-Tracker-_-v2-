import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

type ButtonLinkProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-white text-black font-semibold hover:bg-neutral-200 shadow-lg shadow-white/5",
  secondary:
    "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
  ghost: 
    "border-transparent bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
  dark: 
    "border-white/20 bg-neutral-900 text-white hover:bg-neutral-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-white/30";

export const ButtonLink = ({
  children,
  to,
  href,
  icon: Icon,
  trailingIcon: TrailingIcon,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  onClick,
}: ButtonLinkProps) => {
  const content = (
    <>
      {Icon ? <Icon size={18} strokeWidth={2} className="opacity-90" /> : null}
      <span>{children}</span>
      {TrailingIcon ? <TrailingIcon size={18} strokeWidth={2} className="opacity-90" /> : null}
    </>
  );
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} aria-label={ariaLabel} onClick={onClick}>
      {content}
    </button>
  );
};
