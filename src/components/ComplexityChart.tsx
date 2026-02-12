import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

interface Finding {
  type: string;
  severity: string;
}

interface ComplexityChartProps {
  findings: Finding[];
  score: number;
  linesOfCode: number;
}

const COLORS = [
  "hsl(0, 72%, 55%)",     // red
  "hsl(38, 92%, 55%)",    // amber
  "hsl(217, 91%, 60%)",   // blue
  "hsl(160, 84%, 44%)",   // green
];

const ComplexityChart = ({ findings, score, linesOfCode }: ComplexityChartProps) => {
  // Severity distribution for pie chart
  const severityData = [
    { name: "Errors", value: findings.filter(f => f.severity === "error").length, fill: COLORS[0] },
    { name: "Warnings", value: findings.filter(f => f.severity === "warning").length, fill: COLORS[1] },
    { name: "Info", value: findings.filter(f => f.severity === "info").length, fill: COLORS[2] },
  ].filter(d => d.value > 0);

  // Type distribution for bar chart
  const typeData = [
    { name: "Bugs", count: findings.filter(f => f.type === "bug").length },
    { name: "Security", count: findings.filter(f => f.type === "security").length },
    { name: "Performance", count: findings.filter(f => f.type === "performance").length },
    { name: "Style", count: findings.filter(f => f.type === "style").length },
  ];

  // Radar chart for code quality dimensions
  const qualityData = [
    { metric: "Security", value: Math.max(0, 100 - findings.filter(f => f.type === "security").length * 20) },
    { metric: "Performance", value: Math.max(0, 100 - findings.filter(f => f.type === "performance").length * 15) },
    { metric: "Readability", value: Math.max(0, 100 - findings.filter(f => f.type === "style").length * 10) },
    { metric: "Reliability", value: Math.max(0, 100 - findings.filter(f => f.type === "bug").length * 25) },
    { metric: "Maintainability", value: Math.min(100, score + 10) },
  ];

  const chartConfig = {
    value: { label: "Score", color: "hsl(185, 96%, 55%)" },
    count: { label: "Issues", color: "hsl(217, 91%, 60%)" },
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Code Quality Radar */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Code Quality Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <RadarChart data={qualityData}>
              <PolarGrid stroke="hsl(222, 30%, 18%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Radar name="Quality" dataKey="value" stroke="hsl(185, 96%, 55%)" fill="hsl(185, 96%, 55%)" fillOpacity={0.2} strokeWidth={2} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Issue Types Bar Chart */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Issues by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Severity Pie Chart */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Code Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Lines of Code</span>
            <span className="font-mono font-bold text-foreground">{linesOfCode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Issue Density</span>
            <span className="font-mono font-bold text-foreground">{linesOfCode > 0 ? (findings.length / linesOfCode * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quality Grade</span>
            <span className={`font-mono font-bold text-lg ${score >= 80 ? "text-neon-green" : score >= 60 ? "text-neon-amber" : "text-neon-red"}`}>
              {score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 50 ? "D" : "F"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Issues</span>
            <span className="font-mono font-bold text-foreground">{findings.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplexityChart;
