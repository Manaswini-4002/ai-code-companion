import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Loader2, Copy, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  name: string;
  description: string;
  input: string;
  expected_output: string;
  type: "unit" | "edge" | "integration" | "boundary";
}

interface TestCaseGeneratorProps {
  code: string;
  language: string;
}

const typeColors: Record<string, string> = {
  unit: "bg-neon-blue/10 text-neon-blue border-neon-blue/30",
  edge: "bg-neon-amber/10 text-neon-amber border-neon-amber/30",
  integration: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
  boundary: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
};

const TestCaseGenerator = ({ code, language }: TestCaseGeneratorProps) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateTests = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ code, language }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate Limited", description: "Please try again later.", variant: "destructive" });
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Credits Required", description: "Please add credits to continue.", variant: "destructive" });
        return;
      }
      if (!resp.ok) throw new Error("Failed to generate tests");

      const data = await resp.json();
      setTestCases(data.test_cases || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyAllTests = () => {
    const text = testCases
      .map((tc, i) => `// Test ${i + 1}: ${tc.name}\n// ${tc.description}\n// Input: ${tc.input}\n// Expected: ${tc.expected_output}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied all test cases" });
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-neon-cyan" />
          Test Case Generator
        </CardTitle>
        <div className="flex gap-2">
          {testCases.length > 0 && (
            <Button variant="ghost" size="sm" onClick={copyAllTests}>
              <Copy className="w-4 h-4 mr-1" /> Copy All
            </Button>
          )}
          <Button size="sm" onClick={generateTests} disabled={loading} className="glow-cyan">
            {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Generating...</> : "Generate Tests"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {testCases.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-8">
            Click "Generate Tests" to create AI-powered test cases for your code.
          </p>
        )}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
          </div>
        )}
        {testCases.length > 0 && (
          <div className="space-y-3">
            {testCases.map((tc, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-background">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{tc.name}</span>
                    <Badge variant="outline" className={typeColors[tc.type] || typeColors.unit}>
                      {tc.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{tc.description}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3 h-3 text-neon-green" />
                      <span className="text-xs font-medium text-muted-foreground">Input</span>
                    </div>
                    <pre className="font-mono text-xs bg-card p-2 rounded border border-border overflow-x-auto">{tc.input}</pre>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <XCircle className="w-3 h-3 text-neon-amber" />
                      <span className="text-xs font-medium text-muted-foreground">Expected Output</span>
                    </div>
                    <pre className="font-mono text-xs bg-card p-2 rounded border border-border overflow-x-auto">{tc.expected_output}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseGenerator;
