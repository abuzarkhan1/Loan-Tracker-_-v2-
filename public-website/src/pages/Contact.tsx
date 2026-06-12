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
      description="Reach out to us using the form below, or contact support directly through our email."
    />
    <Section className="pt-4">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-4">
          {supportCards.map((card) => (
            <Card key={card.title} className="flex items-center gap-4 p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-white border border-white/5">
                <card.icon size={18} className="opacity-80" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{card.title}</p>
                <p className="mt-1 text-sm font-light text-white/50">{card.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 sm:p-8">
          <form className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Name</span>
                <input 
                  className="h-11 rounded-full border border-white/10 bg-transparent px-4 text-sm font-light text-white outline-none transition focus:border-white/30" 
                  placeholder="Your name" 
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Email</span>
                <input 
                  type="email" 
                  className="h-11 rounded-full border border-white/10 bg-transparent px-4 text-sm font-light text-white outline-none transition focus:border-white/30" 
                  placeholder="you@example.com" 
                />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Subject</span>
              <input 
                className="h-11 rounded-full border border-white/10 bg-transparent px-4 text-sm font-light text-white outline-none transition focus:border-white/30" 
                placeholder="APK, support, or feedback" 
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Message</span>
              <textarea 
                className="min-h-32 resize-none rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-light text-white outline-none transition focus:border-white/30" 
                placeholder="Write your message" 
              />
            </label>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <ButtonLink icon={Send} className="w-full sm:w-auto">
                Send Message
              </ButtonLink>
              <p className="text-xs font-light text-white/40">
                This is a static contact form UI. No backend submission is connected yet.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </Section>
  </>
);
