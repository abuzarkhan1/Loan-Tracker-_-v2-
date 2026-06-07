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
    "border-primary bg-primary text-white shadow-level1 shadow-primary/10 hover:border-primary-dark hover:bg-primary-dark",
  secondary:
    "border-border bg-card text-dark shadow-level1 hover:bg-background-soft",
  ghost: "border-transparent bg-transparent text-primary hover:bg-background-soft",
  dark: "border-[#0a2540] bg-[#0a2540] text-white hover:bg-[#123456] dark:border-border dark:bg-card dark:text-dark dark:hover:bg-background-soft",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-[15px]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background";

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
      {Icon ? <Icon size={18} strokeWidth={2.4} /> : null}
      <span>{children}</span>
      {TrailingIcon ? <TrailingIcon size={18} strokeWidth={2.4} /> : null}
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
