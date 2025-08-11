import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Review } from '@/services/reviewsService';

interface Props {
  reviews: Review[];
}

const platforms = [
  { key: 'google', label: 'Google', colorVar: '--brand-google' },
  { key: 'booking', label: 'Booking.com', colorVar: '--brand-booking' },
  { key: 'airbnb', label: 'Airbnb', colorVar: '--brand-airbnb' },
  { key: 'tripadvisor', label: 'TripAdvisor', colorVar: '--brand-tripadvisor' },
] as const;

export default function PlatformRatingsRow({ reviews }: Props) {
  const byPlatform = platforms.map((p) => {
    const list = reviews.filter((r) => r.platform === (p.key as any));
    const count = list.length;
    const avg = count ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
    return { ...p, count, avg: Number(avg.toFixed(2)) };
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {byPlatform.map((p) => (
        <Card key={p.key} className="rounded-xl shadow-soft border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{p.label}</div>
              <div className="text-2xl font-bold text-foreground">{p.avg.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">{p.count} reviews</div>
            </div>
            <div className="flex items-center gap-1" style={{ color: `hsl(var(${p.colorVar}))` }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(p.avg) ? 'fill-current' : ''}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
