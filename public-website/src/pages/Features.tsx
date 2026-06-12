import { Card } from "../components/common/Card";
import { DownloadApkButton } from "../components/common/DownloadApkButton";
import { PageHero } from "../components/common/PageHero";
import { SEO } from "../components/common/SEO";
import { Section } from "../components/common/Section";
import { FeatureHighlightsSection } from "../components/sections/FeatureHighlightsSection";
import { TrustSection } from "../components/sections/TrustSection";

const featureStories = [
  {
    title: "From one payment to complete balance",
    copy: "Every repayment changes paid amount, remaining amount, and loan status without manual calculation.",
  },
  {
    title: "Contact-wise clarity",
    copy: "Open a person and see the full ledger context instead of hunting through chats or notes.",
  },
  {
    title: "Dashboard-first thinking",
    copy: "Receivable, payable, paid back, active, completed, and overdue numbers stay visible from the first screen.",
  },
];

export const Features = () => (
  <>
    <SEO
      title="Features"
      description="Explore Loan Tracker features including given loans, borrowed loans, partial payments, ledgers, dashboards, statuses, charts, and dark mode."
    />
    <PageHero
      eyebrow="Features"
      title="A complete personal loan ledger in your pocket."
      description="Loan Tracker keeps the product simple while covering the details that matter: contacts, loan direction, repayments, balances, dates, statuses, expenses, and income."
    />
    <FeatureHighlightsSection hideHeader />
    <Section className="pt-2">
      <div className="grid gap-6 lg:grid-cols-3">
        {featureStories.map((story) => (
          <Card key={story.title} className="p-6 space-y-3">
            <h3 className="text-base font-semibold text-white">{story.title}</h3>
            <p className="text-[13px] font-light leading-relaxed text-white/50">{story.copy}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <DownloadApkButton size="lg">
          Download Android APK
        </DownloadApkButton>
      </div>
    </Section>
    <TrustSection />
  </>
);
