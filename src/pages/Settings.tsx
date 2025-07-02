import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const platforms = [
  {
    id: 'booking',
    name: 'Booking.com',
    color: 'bg-blue-500',
    connected: true,
    lastSync: '2 hours ago'
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    color: 'bg-red-500',
    connected: true,
    lastSync: '1 hour ago'
  },
  {
    id: 'google',
    name: 'Google Reviews',
    color: 'bg-green-500',
    connected: false,
    lastSync: 'Never'
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    color: 'bg-orange-500',
    connected: false,
    lastSync: 'Never'
  }
];

export default function Settings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    newReviews: true,
    lowRatings: true,
    replyReminders: true,
    weeklyReports: false
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleConnectPlatform = (platformId: string) => {
    toast({
      title: "Platform connection",
      description: `Integration with ${platforms.find(p => p.id === platformId)?.name} will be available soon.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your platform connections and notification preferences.</p>
      </div>

      {/* Platform Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                      {platform.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last sync: {platform.lastSync}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={platform.connected ? "secondary" : "outline"}>
                    {platform.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                  <Button 
                    variant={platform.connected ? "outline" : "professional"}
                    size="sm"
                    onClick={() => handleConnectPlatform(platform.id)}
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-reviews">New Review Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when you receive new reviews</p>
              </div>
              <Switch
                id="new-reviews"
                checked={notifications.newReviews}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, newReviews: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="low-ratings">Low Rating Alerts</Label>
                <p className="text-sm text-muted-foreground">Get immediate alerts for reviews with 3 stars or below</p>
              </div>
              <Switch
                id="low-ratings"
                checked={notifications.lowRatings}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, lowRatings: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reply-reminders">Reply Reminders</Label>
                <p className="text-sm text-muted-foreground">Remind me to reply to pending reviews</p>
              </div>
              <Switch
                id="reply-reminders"
                checked={notifications.replyReminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, replyReminders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly summary reports via email</p>
              </div>
              <Switch
                id="weekly-reports"
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" placeholder="Your business name" defaultValue="Cozy Rentals" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" defaultValue="host@cozyrentals.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="UTC-5" defaultValue="UTC-5 (Eastern Time)" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="professional" onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}