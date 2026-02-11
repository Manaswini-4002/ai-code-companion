import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, Code2, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeVisualization } from "@/components/landing/CodeVisualization";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { LanguageIcons } from "@/components/landing/LanguageIcons";

const features = [
  {
    icon: Code2,
    title: "Smart Code Review",
    description: "AI analyzes your code for bugs, anti-patterns, and style issues with detailed explanations and severity ratings.",
    color: "bg-neon-blue/10 text-neon-blue",
    delay: 0,
  },
  {
    icon: RefreshCw,
    title: "Instant Rewriting",
    description: "Get refactored, cleaner versions of your code following best practices and modern patterns.",
    color: "bg-neon-green/10 text-neon-green",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description: "Detect SQL injection, XSS, and other security vulnerabilities before they reach production.",
    color: "bg-neon-red/10 text-neon-red",
    delay: 0.2,
  },
  {
    icon: Zap,
    title: "Performance Insights",
    description: "Identify bottlenecks, unnecessary computations, and optimize for speed and memory usage.",
    color: "bg-neon-amber/10 text-neon-amber",
    delay: 0.3,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CodeLens AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?signup=true">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Code Intelligence
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Review, Refactor &{" "}
                <span className="text-primary text-glow-blue">Secure</span>{" "}
                Your Code
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Paste your code and let AI find bugs, security flaws, and performance issues — then get a clean, rewritten version instantly.
              </p>
              <div className="flex items-center gap-4">
                <Button size="lg" className="glow-blue" asChild>
                  <Link to="/auth?signup=true">
                    Start Reviewing <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">Try Demo</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CodeVisualization />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Better Code</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive analysis covering quality, security, and performance across all major programming languages.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">Multi-Language Support</h2>
            <p className="text-muted-foreground">Works with the languages you use every day.</p>
          </motion.div>
          <LanguageIcons />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center max-w-2xl mx-auto"
          >
            <div className="absolute -inset-10 bg-primary/5 rounded-3xl blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Ready to Write Better Code?</h2>
              <p className="text-muted-foreground mb-8">
                Sign up free and start getting AI-powered code reviews in seconds.
              </p>
              <Button size="lg" className="glow-blue" asChild>
                <Link to="/auth?signup=true">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 CodeLens AI. Built with intelligence.
        </div>
      </footer>
    </div>
  );
};

export default Index;
