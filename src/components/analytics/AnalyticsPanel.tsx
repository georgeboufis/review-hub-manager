import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SimpleLineChart, SimplePieChart } from '@/components/SimpleChart';
import { analyticsData, positiveKeywords, negativeKeywords } from '@/data/mockData';

export default function AnalyticsPanel() {
  const [open, setOpen] = useState(false);

  const pieData = [
    { name: 'Positive', value: 72 },
    { name: 'Neutral', value: 18 },
    { name: 'Negative', value: 10 },
  ];

  const pieColors = [
    'hsl(var(--positive))',
    'hsl(var(--neutral))',
    'hsl(var(--negative))',
  ];

  return (
    <Card className="border border-border rounded-xl shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Insights & Analytics</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? (
            <span className="inline-flex items-center gap-2">Hide <ChevronUp className="h-4 w-4" /></span>
          ) : (
            <span className="inline-flex items-center gap-2">Show <ChevronDown className="h-4 w-4" /></span>
          )}
        </Button>
      </CardHeader>
      {open && (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Average rating over time</h4>
              <SimpleLineChart data={analyticsData.ratingTrends} xKey="month" yKey="rating" color="hsl(var(--primary))" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Sentiment ratio</h4>
              <SimplePieChart data={pieData} dataKey="value" nameKey="name" colors={pieColors} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Common keywords</h4>
            <div className="flex flex-wrap gap-3">
              {[...positiveKeywords, ...negativeKeywords].map((k) => {
                const size = 12 + Math.min(k.count, 50) / 2; // 12px – 37px
                const isPositive = positiveKeywords.some((p) => p.word === k.word);
                const tone = isPositive ? 'var(--positive)' : 'var(--negative)';
                return (
                  <span
                    key={k.word}
                    className="rounded-full px-3 py-1 border"
                    style={{
                      fontSize: `${size}px`,
                      color: `hsl(${tone})`,
                      borderColor: `hsl(${tone})`,
                      background: `hsl(${tone}) / 0.06`,
                    } as React.CSSProperties}
                  >
                    {k.word}
                  </span>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
