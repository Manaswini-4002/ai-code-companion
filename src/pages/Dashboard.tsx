import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, LogOut, History, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NetworkBackground from "@/components/NetworkBackground";

const languages = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "Ruby", "PHP", "C#"];
const reviewTypes = [
  { value: "all", label: "All (Quality + Security + Performance)" },
  { value: "quality", label: "Code Quality" },
  { value: "security", label: "Security Analysis" },
  { value: "performance", label: "Performance Review" },
];

const Dashboard = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [reviewType, setReviewType] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({ title: "Paste some code", description: "The code input area is empty.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/review-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ code, language, reviewType, userId: session.user.id }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate Limited", description: "Too many requests. Please try again later.", variant: "destructive" });
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Credits Required", description: "Please add credits to continue using AI reviews.", variant: "destructive" });
        return;
      }
      if (!resp.ok) throw new Error("Review failed");

      const result = await resp.json();
      navigate(`/review/${result.reviewId}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <NetworkBackground />
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl relative z-10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CodeLens AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history"><History className="w-4 h-4 mr-1" /> History</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Log out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-10 max-w-4xl relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Review Dashboard</h1>
          <p className="text-muted-foreground">Paste your code below and let AI analyze it.</p>
        </div>

        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-card/80 backdrop-blur"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Review Type</label>
              <Select value={reviewType} onValueChange={setReviewType}>
                <SelectTrigger className="bg-card/80 backdrop-blur"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reviewTypes.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-border bg-card/80 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paste your code</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here..."
                className="min-h-[300px] font-mono text-sm bg-background/50 border-border resize-y"
              />
            </CardContent>
          </Card>

          <Button size="lg" className="w-full glow-blue" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : "Submit for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
