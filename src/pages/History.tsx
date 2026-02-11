import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, ArrowLeft, ArrowRight } from "lucide-react";

interface Review {
  id: string;
  language: string;
  review_type: string;
  score: number | null;
  created_at: string;
}

const History = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data } = await supabase
        .from("code_reviews")
        .select("id, language, review_type, score, created_at")
        .order("created_at", { ascending: false });

      setReviews((data as Review[]) || []);
      setLoading(false);
    };
    fetch();
  }, [navigate]);

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
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Link>
          </Button>
        </div>
      </nav>

      <div className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Review History</h1>
        <p className="text-muted-foreground mb-8">All your past code reviews.</p>

        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading...</div>
        ) : reviews.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No reviews yet.</p>
              <Button asChild><Link to="/dashboard">Start a Review</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Link key={r.id} to={`/review/${r.id}`}>
                <Card className="border-border hover:border-primary/40 transition-colors cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="border-border font-mono">{r.language}</Badge>
                      <span className="text-sm text-muted-foreground">{r.review_type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.score !== null && (
                        <span className={`font-bold ${r.score >= 70 ? "text-neon-green" : r.score >= 40 ? "text-neon-amber" : "text-neon-red"}`}>
                          {r.score}/100
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
