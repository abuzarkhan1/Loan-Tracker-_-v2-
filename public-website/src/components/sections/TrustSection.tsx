import { trustItems } from "../../content/site.content";
import { Card } from "../common/Card";
import { IconBadge } from "../common/IconBadge";
import { Section } from "../common/Section";
import { SectionHeader } from "../common/SectionHeader";

export const TrustSection = () => (
  <Section>
    <SectionHeader
      eyebrow="Trust and clarity"
      title="Built for people who want simple records and no mental math."
      description="The app is not trying to be noisy. It keeps personal loan history organized, clear, and dependable."
    />

    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {trustItems.map((item) => (
        <Card key={item.title} className="p-6 space-y-4" interactive>
          <IconBadge icon={item.icon} tone="success" />
          <div>
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-white/50">{item.description}</p>
          </div>
        </Card>
      ))}
    </div>
  </Section>
);
