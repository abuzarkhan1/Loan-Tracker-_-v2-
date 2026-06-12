import { Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../../content/site.content";
import { cn } from "../../utils/cn";
import { BrandMark } from "../common/BrandMark";

const AnimatedNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <NavLink to={to} className="group text-sm font-medium">
      {({ isActive }) => (
        <div className="overflow-hidden h-[1.25rem]">
          <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
            <span
              className={cn(
                "h-[1.25rem] flex items-center leading-none whitespace-nowrap",
                isActive ? "text-white" : "text-white/60"
              )}
            >
              {children}
            </span>
            <span className="h-[1.25rem] flex items-center leading-none whitespace-nowrap text-white">
              {children}
            </span>
          </div>
        </div>
      )}
    </NavLink>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const location = useLocation();
  const shapeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const loginButtonElement = (
    <Link
      to="/sign-in"
      className="px-4 py-2 text-xs border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto text-center"
    >
      LogIn
    </Link>
  );

  const downloadButtonElement = (
    <div className="relative group w-full sm:w-auto">
      <div
        className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-gray-100
                     opacity-40 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"
      />
      <Link
        to="/download"
        className="relative z-10 block text-center px-4 py-2 text-xs font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full sm:w-auto whitespace-nowrap"
      >
        Download App
      </Link>
    </div>
  );

  return (
    <header
      className={cn(
        "fixed top-6 left-1/2 transform -translate-x-1/2 z-50",
        "flex flex-col items-center",
        "pl-6 pr-6 py-3 backdrop-blur-sm",
        headerShapeClass,
        "border border-[#333] bg-[#1f1f1f57]",
        "w-[calc(100%-2rem)] md:w-auto",
        "transition-[border-radius] duration-0 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between w-full gap-x-6 md:gap-x-8">
        <div className="flex items-center">
          <BrandMark />
        </div>

        <nav className="hidden md:flex items-center space-x-4 md:space-x-6 text-sm">
          {navLinks.map((link) => (
            <AnimatedNavLink key={link.href} to={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 md:gap-3">
          {loginButtonElement}
          {downloadButtonElement}
        </div>

        <button
          className="md:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden",
          isOpen ? "max-h-[1000px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full pb-4 border-b border-white/5">
          {navLinks.map((link) => (
            <AnimatedNavLink key={link.href} to={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-3 mt-4 w-full">
          {loginButtonElement}
          {downloadButtonElement}
        </div>
      </div>
    </header>
  );
};
