import { Mail, MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_CONFIG } from "../../config/app.config";
import { navLinks } from "../../content/site.content";
import { BrandMark } from "../common/BrandMark";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const Footer = () => (
  <footer className="px-4 pb-12 pt-16 sm:px-6">
    <div className="mx-auto max-w-6xl rounded-3xl border border-white/5 bg-neutral-900/20 p-8 text-white backdrop-blur-md sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-sm text-sm font-light leading-6 text-white/50">
            A focused personal loan tracker for contacts, repayments, remaining balances, and clean financial summaries.
          </p>
          <div className="pt-2">
            <Link
              to="/download"
              className="inline-block px-5 py-2 text-xs font-semibold text-black bg-white rounded-full hover:bg-white/90 transition-colors"
            >
              Download APK
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-white/45">Quick Links</h3>
          <div className="mt-4 grid gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-light text-white/60 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-white/45">Legal</h3>
          <div className="mt-4 grid gap-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-light text-white/60 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-white/45">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm font-light text-white/60">
            <a
              href={APP_CONFIG.supportEmailHref}
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Mail size={16} className="text-white/40" />
              {APP_CONFIG.supportEmail}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-white/40" />
              {APP_CONFIG.companyLocation}
            </span>
            <span className="inline-flex items-center gap-2">
              <Smartphone size={16} className="text-white/40" />
              Android APK
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-8 text-xs font-light text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {APP_CONFIG.appName}. All rights reserved.</p>
        <p>Built for clear personal finance records.</p>
      </div>
    </div>
  </footer>
);
