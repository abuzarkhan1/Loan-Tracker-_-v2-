import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { ButtonLink } from "../components/common/ButtonLink";
import { Card } from "../components/common/Card";
import { PageHero } from "../components/common/PageHero";
import { SEO } from "../components/common/SEO";
import { Section } from "../components/common/Section";
import { APP_CONFIG } from "../config/app.config";

const supportCards = [
  { title: "Email support", value: APP_CONFIG.supportEmail, icon: Mail },
  { title: "Location", value: APP_CONFIG.companyLocation, icon: MapPin },
  { title: "Product updates", value: "APK release coming soon", icon: MessageCircle },
];

export const Contact = () => (
  <>
    <SEO
      title="Contact"
      description="Contact the Loan Tracker team for support, APK questions, and product feedback."
    />
    <PageHero
      eyebrow="Contact"
      title="Questions about Loan Tracker?"
      description="Use the form UI below for now, or reach out through the support email placeholder. Backend form handling can be added later."
    />
    <Section className="pt-4">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-4">
          {supportCards.map((card) => (
            <Card key={card.title} className="flex items-center gap-4 p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <card.icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-dark">{card.title}</p>
                <p className="mt-1 text-sm font-normal text-muted">{card.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-5 sm:p-6">
          <form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Name</span>
                <input className="h-10 rounded-md border border-border bg-input px-3 text-[15px] font-normal text-dark outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/10" placeholder="Your name" />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Email</span>
                <input type="email" className="h-10 rounded-md border border-border bg-input px-3 text-[15px] font-normal text-dark outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/10" placeholder="you@example.com" />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Subject</span>
              <input className="h-10 rounded-md border border-border bg-input px-3 text-[15px] font-normal text-dark outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/10" placeholder="APK, support, or feedback" />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Message</span>
              <textarea className="min-h-32 resize-none rounded-md border border-border bg-input px-3 py-3 text-[15px] font-normal text-dark outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/10" placeholder="Write your message" />
            </label>
            <ButtonLink icon={Send} className="w-fit">
              Send Message
            </ButtonLink>
            <p className="text-xs font-normal leading-5 text-muted">This is a static contact form UI for now. No backend submission is connected yet.</p>
          </form>
        </Card>
      </div>
    </Section>
  </>
);
