import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "../common/ButtonLink";
import { DownloadApkButton } from "../common/DownloadApkButton";
import { Section } from "../common/Section";
import { AppMockupCluster } from "../mockups/AppMockupCluster";

const trustBadges = [
  { label: "Clear balances", icon: WalletCards },
  { label: "Partial payments", icon: Sparkles },
  { label: "Personal records", icon: ShieldCheck },
];

export const HeroSection = () => (
  <Section className="bg-[#0a2540] pb-10 pt-10 text-white dark:bg-[#070c18] sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14">
    <div className="relative min-h-[620px] overflow-hidden rounded-xl border border-white/10 bg-[#0a2540] dark:border-[#2a3441] dark:bg-[#070c18] lg:min-h-[560px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(99,91,255,0.30),transparent_28%),linear-gradient(135deg,#0a2540_0%,#123456_100%)] dark:bg-[linear-gradient(135deg,#070c18_0%,#0f1d33_50%,#1a2b4a_100%)]" />
      <div className="pointer-events-none absolute -right-20 top-10 hidden w-[520px] opacity-85 lg:block">
        <AppMockupCluster />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 max-w-2xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14"
      >
        <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-[#c7d2e1] dark:border-[#2a3441] dark:bg-white/[0.06] dark:text-[#f0f6fc]">
          <Sparkles size={15} />
          Premium personal finance clarity
        </div>
        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:mt-6 sm:text-[56px] sm:leading-[64px]">
          Track every loan, repayment, and remaining balance clearly.
        </h1>
        <p className="mt-5 max-w-xl text-[17px] font-normal leading-7 text-[#c7d2e1] dark:text-[#8b9cb5]">
          Loan Tracker helps you manage money you gave, money you borrowed, partial repayments, due amounts, and financial summaries in one simple app.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <DownloadApkButton size="lg" className="w-full sm:w-auto">
            Download Android APK
          </DownloadApkButton>
          <ButtonLink to="/features" trailingIcon={ArrowRight} variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore Features
          </ButtonLink>
        </div>

        <div className="mt-7 grid gap-3 min-[460px]:grid-cols-3 sm:flex sm:flex-wrap">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.08] px-3 py-2 text-sm font-medium text-[#c7d2e1] dark:border-[#2a3441] dark:bg-white/[0.06] dark:text-[#8b9cb5]">
              <badge.icon className="text-primary" size={16} />
              {badge.label}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mt-2 h-[420px] overflow-hidden px-5 pb-8 lg:hidden">
        <div className="origin-top scale-[0.78]">
          <AppMockupCluster />
        </div>
      </div>
    </div>
  </Section>
);
