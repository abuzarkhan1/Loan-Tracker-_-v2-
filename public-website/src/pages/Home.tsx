import { SEO } from "../components/common/SEO";
import { AppPreviewSection } from "../components/sections/AppPreviewSection";
import { DownloadSection } from "../components/sections/DownloadSection";
import { FAQSection } from "../components/sections/FAQSection";
import { FeatureHighlightsSection } from "../components/sections/FeatureHighlightsSection";
import { HeroSection } from "../components/sections/HeroSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { StatsSection } from "../components/sections/StatsSection";

export const Home = () => (
  <>
    <SEO
      title="Track Every Loan Clearly"
      description="Loan Tracker helps you manage given loans, borrowed loans, partial repayments, expenses, income, due amounts, and dashboard summaries."
    />
    <HeroSection />
    <StatsSection />
    <FeatureHighlightsSection compact />
    <AppPreviewSection />
    <HowItWorksSection />
    <DownloadSection />
    <FAQSection />
  </>
);
