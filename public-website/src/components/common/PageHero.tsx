import { motion } from "framer-motion";
import { Section } from "./Section";

export const PageHero = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <Section className="pb-10 pt-16 sm:pb-14 sm:pt-20 overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-4xl text-center space-y-5"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm">
        {eyebrow}
      </div>
      <h1 className="text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight text-white max-w-3xl mx-auto">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-white/60">
        {description}
      </p>
    </motion.div>
  </Section>
);
