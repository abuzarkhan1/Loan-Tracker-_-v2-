import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={cn(
      "mx-auto max-w-4xl space-y-4", 
      align === "center" ? "text-center" : "text-left", 
      className
    )}
  >
    {eyebrow ? (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
        {eyebrow}
      </div>
    ) : null}
    <h2 className={cn(
      "text-3xl sm:text-5xl font-bold leading-[1.15] tracking-tight text-white",
      align === "center" ? "mx-auto max-w-2xl" : ""
    )}>
      {title}
    </h2>
    {description ? (
      <p className={cn(
        "text-base font-light leading-relaxed text-white/50",
        align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
      )}>
        {description}
      </p>
    ) : null}
  </motion.div>
);
