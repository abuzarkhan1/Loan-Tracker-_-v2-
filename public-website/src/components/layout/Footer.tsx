import { Mail, MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_CONFIG } from "../../config/app.config";
import { navLinks } from "../../content/site.content";
import { BrandMark } from "../common/BrandMark";
import { DownloadApkButton } from "../common/DownloadApkButton";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const Footer = () => (
  <footer className="px-4 pb-6 pt-10 sm:px-6">
    <div className="mx-auto max-w-6xl rounded-xl border border-white/10 bg-[#0a2540] p-6 text-white shadow-elevated dark:border-[#2a3441] dark:bg-[#151b2b] dark:text-[#f0f6fc] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
        <div>
          <BrandMark className="[&_span_span:first-child]:text-white [&_span_span:last-child]:text-[#a3acb9] dark:[&_span_span:first-child]:text-[#f0f6fc] dark:[&_span_span:last-child]:text-[#8b9cb5]" />
          <p className="mt-4 max-w-sm text-sm font-normal leading-6 text-[#c7d2e1] dark:text-[#8b9cb5]">
            A focused personal loan tracker for contacts, repayments, remaining balances, and clean financial summaries.
          </p>
          <DownloadApkButton className="mt-6">
            Download APK
          </DownloadApkButton>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#a3acb9] dark:text-[#8b949e]">Quick Links</h3>
          <div className="mt-4 grid gap-3">
            {navLinks.slice(0, 5).map((link) => (
              <Link key={link.href} to={link.href} className="text-sm font-medium text-[#c7d2e1] transition hover:text-white dark:text-[#8b9cb5] dark:hover:text-[#f0f6fc]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#a3acb9] dark:text-[#8b949e]">Legal</h3>
          <div className="mt-4 grid gap-3">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-sm font-medium text-[#c7d2e1] transition hover:text-white dark:text-[#8b9cb5] dark:hover:text-[#f0f6fc]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#a3acb9] dark:text-[#8b949e]">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm font-medium text-[#c7d2e1] dark:text-[#8b9cb5]">
            <a href={APP_CONFIG.supportEmailHref} className="inline-flex items-center gap-2 transition hover:text-white dark:hover:text-[#f0f6fc]">
              <Mail size={17} />
              {APP_CONFIG.supportEmail}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin size={17} />
              {APP_CONFIG.companyLocation}
            </span>
            <span className="inline-flex items-center gap-2">
              <Smartphone size={17} />
              Android APK
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-normal text-[#a3acb9] dark:border-[#2a3441] dark:text-[#8b949e] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {APP_CONFIG.appName}. All rights reserved.</p>
        <p>Built for clear personal finance records.</p>
      </div>
    </div>
  </footer>
);
