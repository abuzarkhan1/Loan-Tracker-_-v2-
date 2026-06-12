import { motion } from "framer-motion";
import { featureHighlights } from "../../content/site.content";
import { Card } from "../common/Card";
import { IconBadge, type Tone } from "../common/IconBadge";
import { Section } from "../common/Section";
import { SectionHeader } from "../common/SectionHeader";

export const FeatureHighlightsSection = ({ 
  compact = false,
  hideHeader = false,
}: { 
  compact?: boolean;
  hideHeader?: boolean;
}) => (
  <Section id="features" className="py-12 sm:py-16">
    {!hideHeader && (
      <SectionHeader
        eyebrow="Features"
        title="Everything needed for clean personal loan tracking."
        description="From given and taken loans to expenses, income, and statuses, each workflow is built around clarity."
      />
    )}

    <div className={hideHeader ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
      {featureHighlights.slice(0, compact ? 6 : featureHighlights.length).map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.025 }}
        >
          <Card className="h-full p-6 space-y-4" interactive>
            <IconBadge icon={feature.icon} tone={feature.tone as Tone} />
            <div>
              <h3 className="text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-[13px] font-light leading-relaxed text-white/50">{feature.description}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);
