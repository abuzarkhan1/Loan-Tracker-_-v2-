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

    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {trustItems.map((item) => (
        <Card key={item.title} className="p-5" interactive>
          <IconBadge icon={item.icon} tone="success" />
          <h3 className="mt-4 text-base font-semibold text-dark">{item.title}</h3>
          <p className="mt-2 text-sm font-normal leading-6 text-muted">{item.description}</p>
        </Card>
      ))}
    </div>
  </Section>
);
