import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { painPoints, solutions } from "../../content/site.content";
import { Card } from "../common/Card";
import { Section } from "../common/Section";
import { SectionHeader } from "../common/SectionHeader";

export const ProblemSolutionSection = () => (
  <Section id="problem">
    <SectionHeader
      eyebrow="Why it matters"
      title="Personal loans get messy when history lives in memory."
      description="Loan Tracker brings every contact, payment, due date, and remaining balance into one clear place."
    />

    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
        <Card className="h-full p-6 sm:p-8">
          <div className="mb-6 inline-flex rounded-full border border-rose-500/10 bg-rose-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400">
            Common problems
          </div>
          <div className="grid gap-4">
            {painPoints.map((item) => (
              <div key={item} className="flex gap-3.5 rounded-2xl border border-white/5 bg-white/5 p-4 items-start">
                <XCircle className="mt-0.5 shrink-0 text-rose-400" size={18} />
                <p className="text-sm font-light leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
        <Card className="h-full p-6 sm:p-8">
          <div className="mb-6 inline-flex rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Loan Tracker solution
          </div>
          <div className="grid gap-4">
            {solutions.map((item) => (
              <div key={item} className="flex gap-3.5 rounded-2xl border border-white/5 bg-white/5 p-4 items-start">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={18} />
                <p className="text-sm font-light leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  </Section>
);
