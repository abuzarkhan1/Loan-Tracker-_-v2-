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
    <HowItWorksSection />
    <Section className="pt-2">
      <Card className="p-6 text-center sm:p-8">
        <h2 className="text-2xl font-semibold text-dark">Ready to keep your next loan clean from day one?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-normal leading-6 text-muted">
          Download the Android APK, create your account, and start with your first contact and loan entry.
        </p>
        <DownloadApkButton className="mt-7">
          Download Android APK
        </DownloadApkButton>
      </Card>
    </Section>
    <AppPreviewSection />
  </>
);
