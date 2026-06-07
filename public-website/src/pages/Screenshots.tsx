import { PageHero } from "../components/common/PageHero";
import { SEO } from "../components/common/SEO";
import { Section } from "../components/common/Section";
import { AppPreviewSection } from "../components/sections/AppPreviewSection";
import { PhoneMockup } from "../components/mockups/PhoneMockup";

export const Screenshots = () => (
  <>
    <SEO
      title="App Preview"
      description="Preview Loan Tracker app screens including dashboard, loans list, loan detail, add payment, and expenses."
    />
    <PageHero
      eyebrow="Screenshots"
      title="A focused fintech app experience, previewed screen by screen."
      description="Product mockups show the final navy, purple, white, and cool-gray design direction."
    />
    <AppPreviewSection />
    <Section className="pt-0 lg:py-12">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="premium-card rounded-xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-primary">Light Preview</p>
          <h2 className="mt-3 text-xl font-semibold text-dark">White surfaces, purple actions, cool-gray structure.</h2>
          <p className="mt-2 text-sm font-normal leading-6 text-muted">The light theme follows the same premium system used across the web app.</p>
          <div className="mt-6">
            <PhoneMockup screen="dashboard" compact />
          </div>
        </div>
        <div className="dark rounded-xl border border-border bg-background p-5 text-dark shadow-elevated sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-primary">Dark Preview</p>
          <h2 className="mt-3 text-xl font-semibold text-dark">Navy surfaces, purple actions, clear contrast.</h2>
          <p className="mt-2 text-sm font-normal leading-6 text-muted">The dark preview uses the same app palette without extra decorative colors.</p>
          <div className="mt-6 dark">
            <PhoneMockup screen="expenses" compact />
          </div>
        </div>
      </div>
    </Section>
  </>
);
