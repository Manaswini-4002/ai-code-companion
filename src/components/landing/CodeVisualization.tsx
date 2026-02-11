import { motion } from "framer-motion";

const codeLines = [
  { text: "function processData(input) {", color: "text-neon-blue" },
  { text: "  // BUG: Missing null check", color: "text-neon-red", highlight: true },
  { text: "  const result = input.map(x => x * 2);", color: "text-foreground" },
  { text: "  if (result.length > 0) {", color: "text-foreground" },
  { text: "    // PERF: Use Set for O(1) lookup", color: "text-neon-amber", highlight: true },
  { text: "    return result.filter(x => arr.includes(x));", color: "text-foreground" },
  { text: "  }", color: "text-foreground" },
  { text: "  return [];", color: "text-neon-green" },
  { text: "}", color: "text-neon-blue" },
  { text: "", color: "text-foreground" },
  { text: "// SEC: SQL injection vulnerability", color: "text-neon-red", highlight: true },
  { text: 'const query = `SELECT * FROM ${table}`;', color: "text-foreground" },
  { text: "async function fetchUser(id) {", color: "text-neon-blue" },
  { text: "  const res = await db.query(query);", color: "text-foreground" },
  { text: "  return res.rows[0];", color: "text-neon-green" },
  { text: "}", color: "text-neon-blue" },
];

export const CodeVisualization = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-cyan/20 rounded-xl blur-xl" />
      <div className="relative bg-card border border-border rounded-xl overflow-hidden">
        {/* Window chrome  */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-neon-red/80" />
          <div className="w-3 h-3 rounded-full bg-neon-amber/80" />
          <div className="w-3 h-3 rounded-full bg-neon-green/80" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">review.ts</span>
        </div>
        {/* code area */}
        <div className="p-4 font-mono text-sm leading-relaxed h-72 overflow-hidden">
          <div className="animate-code-scroll">
            {[...codeLines, ...codeLines].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 ${line.highlight ? "bg-neon-red/5 -mx-4 px-4 border-l-2 border-neon-red/40" : ""}`}
              >
                <span className="text-muted-foreground/40 w-6 text-right select-none text-xs">
                  {(i % codeLines.length) + 1}
                </span>
                <span className={line.color}>{line.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
