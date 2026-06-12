import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollToTop } from "./ScrollToTop";

export const SiteLayout = () => (
  <div className="site-shell min-h-screen">
    <ScrollToTop />
    <Navbar />
    <main className="pt-24 md:pt-28">
      <Outlet />
    </main>
    <Footer />
  </div>
);
