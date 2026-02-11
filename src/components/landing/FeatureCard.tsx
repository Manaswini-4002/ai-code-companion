import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export const FeatureCard = ({ icon: Icon, title, description, color, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/20 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity blur" />
      <div className="relative bg-card border border-border rounded-xl p-6 h-full hover:border-primary/40 transition-colors">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
