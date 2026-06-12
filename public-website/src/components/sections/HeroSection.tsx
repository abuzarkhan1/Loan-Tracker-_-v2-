import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "../common/ButtonLink";
import { DownloadApkButton } from "../common/DownloadApkButton";
import { Section } from "../common/Section";
import { AppMockupCluster } from "../mockups/AppMockupCluster";
import { CanvasRevealEffect } from "../ui/sign-in-flow-1";

const trustBadges = [
  { label: "Clear balances", icon: WalletCards },
  { label: "Partial payments", icon: Sparkles },
  { label: "Personal records", icon: ShieldCheck },
];

export const HeroSection = () => (
  <Section className="relative bg-black pb-16 pt-20 text-white overflow-hidden min-h-[720px] flex items-center">
    {/* Animated dot reveal effect as background */}
    <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
      <CanvasRevealEffect
        animationSpeed={1.5}
        containerClassName="bg-black"
        colors={[[255, 255, 255]]}
        dotSize={5}
        showGradient={false}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.1)_0%,_rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </div>

    <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="space-y-6 text-left"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
          <Sparkles size={14} className="text-white/60 animate-pulse" />
          Premium personal finance clarity
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight text-white">
          Track every loan, repayment, and balance clearly.
        </h1>
        <p className="text-base sm:text-lg font-light leading-relaxed text-white/60 max-w-xl">
          Loan Tracker helps you manage money you gave, money you borrowed, partial repayments, due amounts, and financial summaries in one simple app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <DownloadApkButton size="lg" className="w-full sm:w-auto" />
          <ButtonLink to="/features" trailingIcon={ArrowRight} variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore Features
          </ButtonLink>
        </div>

        {/* Mobile mockups */}
        <div className="relative z-10 mt-8 h-[360px] w-full overflow-hidden lg:hidden flex justify-center">
          <div className="origin-top scale-[0.72] sm:scale-[0.85] w-full max-w-[400px]">
            <AppMockupCluster />
          </div>
        </div>

        <div className="grid gap-3 grid-cols-3 pt-8 border-t border-white/5">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex flex-col space-y-1.5">
              <badge.icon className="text-white/40" size={18} />
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">{badge.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative hidden lg:block">
        <AppMockupCluster />
      </div>
    </div>
  </Section>
);
