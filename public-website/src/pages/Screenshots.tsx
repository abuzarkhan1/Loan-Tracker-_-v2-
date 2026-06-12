import { Card } from "../components/common/Card";
import { PageHero } from "../components/common/PageHero";
import { SEO } from "../components/common/SEO";
import { Section } from "../components/common/Section";
import { AppPreviewSection } from "../components/sections/AppPreviewSection";

export const Screenshots = () => (
  <>
    <SEO
      title="App Preview"
      description="Preview Loan Tracker app screens including dashboard, loans list, loan detail, add payment, and expenses."
    />
    <PageHero
      eyebrow="Screenshots"
      title="A focused fintech app experience, previewed screen by screen."
      description="Product details showcase the dark titanium-gray theme, clean structure, and highly readable interfaces."
    />
    <AppPreviewSection hideHeader />
    <Section className="pt-0 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 sm:p-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Core Dashboard</p>
          <h2 className="text-xl font-semibold text-white">Visual data summaries.</h2>
          <p className="text-sm font-light leading-relaxed text-white/60">
            A glanceable summary of total receivables and payables, alongside monthly Cashflow trend charts.
          </p>
        </Card>

        <Card className="p-6 sm:p-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Ledger & Cash Flow</p>
          <h2 className="text-xl font-semibold text-white">Detailed cash movement.</h2>
          <p className="text-sm font-light leading-relaxed text-white/60">
            Record every transaction, income source, expense, and loan recovery with automatic calculations.
          </p>
        </Card>
      </div>
    </Section>
  </>
);
