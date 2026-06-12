import { motion } from "framer-motion";
import { previewScreens } from "../../content/site.content";
import { Section } from "../common/Section";
import { SectionHeader } from "../common/SectionHeader";

export const AppPreviewSection = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <Section id="preview" className="lg:py-14">
    {!hideHeader && (
      <SectionHeader
        eyebrow="App Preview"
        title="Mobile screens that stay focused and easy to scan."
        description="Product previews show the main workflows without adding extra visual noise."
      />
    )}

    <div className={hideHeader ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}>
      {previewScreens.map((screen, index) => (
        <motion.div
          key={screen.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.42, ease: "easeOut", delay: index * 0.04 }}
          className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col justify-center text-center space-y-2"
        >
          <h3 className="text-sm font-semibold text-white">{screen.title}</h3>
          <p className="text-xs font-light leading-relaxed text-white/50">{screen.description}</p>
        </motion.div>
      ))}
    </div>
  </Section>
);
