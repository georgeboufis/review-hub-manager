import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, Euro, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PricingService, PricingData } from '@/services/pricingService';
import { SimpleChart } from '@/components/SimpleChart';

export default function PricingDashboard() {
  const [pricingData, setPricingData] = useState<PricingData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [latestPricing, setLatestPricing] = useState<Record<string, PricingData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [pricingResult, analyticsResult, latestResult] = await Promise.all([
        PricingService.getUserPricingData(),
        PricingService.getPricingAnalytics(),
        PricingService.getLatestPricing()
      ]);

      if (pricingResult.data) setPricingData(pricingResult.data);
      if (analyticsResult.data) setAnalytics(analyticsResult.data);
      if (latestResult.data) setLatestPricing(latestResult.data);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pricing data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const result = await PricingService.triggerDataSync();
      
      if (result.success) {
        toast({
          title: "Sync Completed",
          description: "Data has been updated successfully",
        });
        await fetchData();
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync data",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const platformColors = {
    booking: 'bg-blue-500',
    airbnb: 'bg-red-500',
    google: 'bg-green-500',
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Pricing Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your property prices across different platforms
          </p>
        </div>
        <Button onClick={handleManualSync} disabled={isSyncing}>
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{analytics.averagePrice}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEntries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platforms</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(analytics.pricesByPlatform).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Update</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pricingData.length > 0 
                  ? new Date(pricingData[0].date).toLocaleDateString()
                  : 'N/A'
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Latest Prices */}
      <Card>
        <CardHeader>
          <CardTitle>Current Prices</CardTitle>
          <CardDescription>
            Latest pricing information from each platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(latestPricing).map(([platform, pricing]) => (
              <div key={platform} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${platformColors[platform as keyof typeof platformColors] || 'bg-gray-500'}`}></div>
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <Badge variant="outline">
                    {new Date(pricing.date).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  €{pricing.price?.toFixed(2) || 'N/A'}
                </div>
                {pricing.property_id && (
                  <div className="text-sm text-muted-foreground">
                    Property: {pricing.property_id}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price History */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="table">Price History</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
              <CardDescription>
                Track how your prices have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && analytics.priceHistory.length > 0 ? (
                <SimpleChart 
                  data={analytics.priceHistory}
                  xKey="date"
                  yKey="price"
                  title="Price Trends"
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pricing data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Price History Table</CardTitle>
              <CardDescription>
                Detailed view of all pricing data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Platform</th>
                      <th className="text-left p-2">Property ID</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingData.map((pricing) => (
                      <tr key={pricing.id} className="border-b">
                        <td className="p-2">{new Date(pricing.date).toLocaleDateString()}</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${platformColors[pricing.platform as keyof typeof platformColors] || 'bg-gray-500'}`}></div>
                            <span className="capitalize">{pricing.platform}</span>
                          </div>
                        </td>
                        <td className="p-2">{pricing.property_id || 'N/A'}</td>
                        <td className="p-2">€{pricing.price?.toFixed(2) || 'N/A'}</td>
                        <td className="p-2">{pricing.currency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}