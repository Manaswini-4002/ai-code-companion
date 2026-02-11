import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, ArrowLeft, Copy, Download, Shield, Bug, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Finding {
  type: "bug" | "security" | "performance" | "style";
  severity: "error" | "warning" | "info";
  line?: number;
  message: string;
  suggestion: string;
}

interface ReviewData {
  id: string;
  language: string;
  review_type: string;
  original_code: string;
  findings: { findings: Finding[]; summary: string };
  rewritten_code: string;
  score: number;
  created_at: string;
}

const severityColors: Record<string, string> = {
  error: "bg-neon-red/10 text-neon-red border-neon-red/30",
  warning: "bg-neon-amber/10 text-neon-amber border-neon-amber/30",
  info: "bg-neon-blue/10 text-neon-blue border-neon-blue/30",
};

const typeIcons: Record<string, any> = {
  bug: Bug,
  security: Shield,
  performance: Zap,
  style: AlertTriangle,
};

const ReviewResults = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data, error } = await supabase
        .from("code_reviews")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast({ title: "Review not found", variant: "destructive" });
        navigate("/dashboard");
        return;
      }
      setReview(data as unknown as ReviewData);
      setLoading(false);
    };
    fetchReview();
  }, [id, navigate, toast]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied to clipboard" });
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading review...</div>
      </div>
    );
  }

  const findings: Finding[] = review.findings?.findings || [];
  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;
  const infos = findings.filter((f) => f.severity === "info").length;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CodeLens AI</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
        </div>
      </nav>

      <div className="container py-10 max-w-5xl">
        {/* Summary */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className={`text-4xl font-bold ${review.score >= 70 ? "text-neon-green" : review.score >= 40 ? "text-neon-amber" : "text-neon-red"}`}>
                {review.score}/100
              </div>
              <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-neon-red">{errors}</div>
              <p className="text-sm text-muted-foreground mt-1">Errors</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-neon-amber">{warnings}</div>
              <p className="text-sm text-muted-foreground mt-1">Warnings</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-neon-blue">{infos}</div>
              <p className="text-sm text-muted-foreground mt-1">Suggestions</p>
            </CardContent>
          </Card>
        </div>

        {review.findings?.summary && (
          <Card className="border-border mb-8">
            <CardHeader><CardTitle className="text-lg">Summary</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{review.findings.summary}</p></CardContent>
          </Card>
        )}

        <Tabs defaultValue="findings" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="findings">Findings ({findings.length})</TabsTrigger>
            <TabsTrigger value="original">Original Code</TabsTrigger>
            <TabsTrigger value="rewritten">Rewritten Code</TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="space-y-3">
            {findings.length === 0 ? (
              <Card className="border-border">
                <CardContent className="pt-6 text-center text-muted-foreground">No issues found. Your code looks great!</CardContent>
              </Card>
            ) : (
              findings.map((f, i) => {
                const Icon = typeIcons[f.type] || Bug;
                return (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${f.severity === "error" ? "text-neon-red" : f.severity === "warning" ? "text-neon-amber" : "text-neon-blue"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={severityColors[f.severity]}>
                              {f.severity}
                            </Badge>
                            <Badge variant="outline" className="border-border">{f.type}</Badge>
                            {f.line && <span className="text-xs text-muted-foreground">Line {f.line}</span>}
                          </div>
                          <p className="text-sm font-medium mb-1">{f.message}</p>
                          <p className="text-sm text-muted-foreground">{f.suggestion}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="original">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Original Code</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyCode(review.original_code)}>
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="font-mono text-sm bg-background p-4 rounded-lg border border-border overflow-x-auto whitespace-pre-wrap">{review.original_code}</pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewritten">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Rewritten Code</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyCode(review.rewritten_code || "")}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => downloadCode(review.rewritten_code || "", `rewritten.${review.language.toLowerCase()}`)}>
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="font-mono text-sm bg-background p-4 rounded-lg border border-border overflow-x-auto whitespace-pre-wrap">{review.rewritten_code || "No rewritten code available."}</pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewResults;
