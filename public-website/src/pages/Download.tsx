import { AlertCircle, ShieldCheck } from "lucide-react";
import { Card } from "../components/common/Card";
import { PageHero } from "../components/common/PageHero";
import { SEO } from "../components/common/SEO";
import { Section } from "../components/common/Section";
import { DownloadSection } from "../components/sections/DownloadSection";
import { FAQSection } from "../components/sections/FAQSection";

export const Download = () => (
  <>
    <SEO
      title="Download Android APK"
      description="Download the Loan Tracker Android APK and review version, size, compatibility, installation guidance, and safety notes."
    />
    <PageHero
      eyebrow="Download"
      title="Download the Android APK."
      description="The official APK is served from the GitHub release link configured once and reused across every download button."
    />
    <DownloadSection full />
    <Section className="pt-2">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <ShieldCheck className="text-emerald-400" size={28} />
          <div>
            <h2 className="text-base font-semibold text-white">Safety note</h2>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-white/50">
              Download the APK only from the official link shared on this website. The app is focused on simple loan, payment, expense, and income records.
            </p>
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <AlertCircle className="text-white/40" size={28} />
          <div>
            <h2 className="text-base font-semibold text-white">Before installing</h2>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-white/50">
              Android may ask you to allow installation from your browser. This is normal for APK files downloaded outside the Play Store.
            </p>
          </div>
        </Card>
      </div>
    </Section>
    <FAQSection />
  </>
);
