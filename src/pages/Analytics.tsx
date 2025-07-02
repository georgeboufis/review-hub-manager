import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsData, positiveKeywords, negativeKeywords } from '@/data/mockData';
import { SimpleLineChart, SimpleBarChart, SimplePieChart } from '@/components/SimpleChart';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Analytics() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">Insights and trends from your guest reviews.</p>
      </div>

      {/* Rating Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart
            data={analyticsData.ratingTrends}
            xKey="month"
            yKey="rating"
            color="#3b82f6"
          />
        </CardContent>
      </Card>

      {/* Review Count Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Review Volume Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleBarChart
            data={analyticsData.reviewCounts}
            xKey="month"
            yKey="count"
            color="#10b981"
          />
        </CardContent>
      </Card>

      {/* Platform Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SimplePieChart
                data={analyticsData.platformDistribution}
                dataKey="count"
                nameKey="platform"
                colors={["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]}
              />
            </div>
            <div className="space-y-4">
              {analyticsData.platformDistribution.map((platform, index) => (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][index] }}
                    />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{platform.count}</div>
                    <div className="text-sm text-muted-foreground">{platform.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Most Common Positive Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positiveKeywords.map((keyword, index) => (
                <div key={keyword.word} className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {keyword.word}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(keyword.count / positiveKeywords[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{keyword.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Most Common Negative Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {negativeKeywords.map((keyword, index) => (
                <div key={keyword.word} className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {keyword.word}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(keyword.count / negativeKeywords[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{keyword.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">85%</div>
            <p className="text-sm text-muted-foreground">Of reviews have responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2.5h</div>
            <p className="text-sm text-muted-foreground">Time to respond to reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">92%</div>
            <p className="text-sm text-muted-foreground">4+ star reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}