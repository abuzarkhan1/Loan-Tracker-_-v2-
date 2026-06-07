import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../../content/site.content";
import { cn } from "../../utils/cn";
import { BrandMark } from "../common/BrandMark";
import { DownloadApkButton } from "../common/DownloadApkButton";
import { ThemeToggle } from "../common/ThemeToggle";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition duration-150",
    isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-background-soft hover:text-dark",
  );

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 px-4 shadow-level1 backdrop-blur-xl sm:px-6">
      <div className="mx-auto max-w-6xl">
        <nav className="flex h-16 items-center justify-between gap-3">
          <BrandMark />

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(0, 5).map((link) => (
              <NavLink key={link.href} to={link.href} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <DownloadApkButton size="md">
              Download APK
            </DownloadApkButton>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:hidden max-[380px]:gap-1.5">
            <ThemeToggle compact />
            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((current) => !current)}
              className="grid size-9 place-items-center rounded-md border border-border bg-card text-dark shadow-level1 transition hover:bg-background-soft focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </nav>

        {open ? (
          <div className="premium-card mt-3 rounded-xl p-3 lg:hidden">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} to={link.href} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>
            <DownloadApkButton className="mt-3 w-full">
              Download Android APK
            </DownloadApkButton>
          </div>
        ) : null}
      </div>
    </header>
  );
};
