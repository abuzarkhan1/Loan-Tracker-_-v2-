import { motion } from "framer-motion";
import { stats } from "../../content/site.content";
import { Card } from "../common/Card";
import { IconBadge, type Tone } from "../common/IconBadge";
import { Section } from "../common/Section";

export const StatsSection = () => (
  <Section className="py-10 sm:py-12">
    <div className="grid gap-4 min-[430px]:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.04 }}
        >
          <Card className="h-full p-5 flex flex-col justify-between" interactive>
            <div>
              <IconBadge icon={stat.icon} tone={stat.tone as Tone} />
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-white/40">{stat.label}</p>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);
