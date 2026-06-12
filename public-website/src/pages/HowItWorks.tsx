import { Card } from "../components/common/Card";
import { DownloadApkButton } from "../components/common/DownloadApkButton";
import { PageHero } from "../components/common/PageHero";
import { SEO } from "../components/common/SEO";
import { Section } from "../components/common/Section";
import { AppPreviewSection } from "../components/sections/AppPreviewSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";

export const HowItWorks = () => (
  <>
    <SEO
      title="How It Works"
      description="Learn how Loan Tracker works: add a contact, add a given or taken loan, record partial payments, and track remaining balances."
    />
    <PageHero
      eyebrow="Workflow"
      title="A calm workflow for everyday loan records."
      description="No complicated accounting setup. Just contacts, loans, payments, and summaries that stay accurate as you update them."
    />
    <HowItWorksSection hideHeader />
    <Section className="pt-2">
      <Card className="p-8 text-center sm:p-10 space-y-4 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to keep your next loan clean from day one?</h2>
        <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-white/50">
          Download the Android APK, create your account, and start with your first contact and loan entry.
        </p>
        <div className="pt-3">
          <DownloadApkButton>
            Download Android APK
          </DownloadApkButton>
        </div>
      </Card>
    </Section>
    <AppPreviewSection hideHeader />
  </>
);
