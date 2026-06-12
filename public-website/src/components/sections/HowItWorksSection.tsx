import { motion } from "framer-motion";
import { howItWorksSteps } from "../../content/site.content";
import { Card } from "../common/Card";
import { IconBadge } from "../common/IconBadge";
import { Section } from "../common/Section";
import { SectionHeader } from "../common/SectionHeader";

export const HowItWorksSection = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <Section id="how-it-works">
    {!hideHeader && (
      <SectionHeader
        eyebrow="How it works"
        title="Four simple steps from contact to complete ledger."
        description="The workflow is intentionally straightforward, so daily personal finance tracking stays calm."
      />
    )}

    <div className={hideHeader ? "relative grid gap-6 lg:grid-cols-4" : "relative mt-10 grid gap-6 lg:grid-cols-4"}>
      <div className="absolute left-0 right-0 top-12 hidden h-px bg-white/5 lg:block" />
      {howItWorksSteps.map((step, index) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.42, ease: "easeOut", delay: index * 0.06 }}
          className="relative"
        >
          <Card className="h-full p-6 space-y-4" interactive>
            <div className="flex items-center justify-between">
              <IconBadge icon={step.icon} />
              <span className="font-code text-xs font-semibold text-white/40 tracking-widest">{step.step}</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-[13px] font-light leading-relaxed text-white/50">{step.description}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);
