import { motion } from "framer-motion";

const languages = [
  { name: "Python", abbr: "PY", color: "text-neon-blue bg-neon-blue/10" },
  { name: "JavaScript", abbr: "JS", color: "text-neon-amber bg-neon-amber/10" },
  { name: "TypeScript", abbr: "TS", color: "text-neon-blue bg-neon-blue/10" },
  { name: "Java", abbr: "JV", color: "text-neon-red bg-neon-red/10" },
  { name: "C++", abbr: "C+", color: "text-neon-purple bg-neon-purple/10" },
  { name: "Go", abbr: "GO", color: "text-neon-cyan bg-neon-cyan/10" },
  { name: "Rust", abbr: "RS", color: "text-neon-amber bg-neon-amber/10" },
  { name: "Ruby", abbr: "RB", color: "text-neon-red bg-neon-red/10" },
];

export const LanguageIcons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {languages.map((lang, i) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.1 }}
          className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg border border-border hover:border-primary/40 transition-colors cursor-default ${lang.color}`}
        >
          <span className="font-mono font-bold text-lg">{lang.abbr}</span>
          <span className="text-xs text-muted-foreground">{lang.name}</span>
        </motion.div>
      ))}
    </div>
  );
};
