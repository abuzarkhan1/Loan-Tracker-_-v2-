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
  <Section className="pb-6 pt-10 lg:pb-8 lg:pt-12">
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-dark sm:text-[40px] sm:leading-[48px]">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-[15px] font-normal leading-6 text-muted">{description}</p>
    </motion.div>
  </Section>
);
