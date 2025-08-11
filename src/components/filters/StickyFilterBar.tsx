import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Search, Star } from 'lucide-react';
import { useState } from 'react';
export default function StickyFilterBar() {
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [activeRatings, setActiveRatings] = useState<number[]>([]);
  const toggle = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  const sources: {
    key: string;
    label: string;
    colorVar: string;
  }[] = [{
    key: 'google',
    label: 'Google',
    colorVar: '--brand-google'
  }, {
    key: 'booking',
    label: 'Booking',
    colorVar: '--brand-booking'
  }, {
    key: 'airbnb',
    label: 'Airbnb',
    colorVar: '--brand-airbnb'
  }, {
    key: 'tripadvisor',
    label: 'TripAdvisor',
    colorVar: '--brand-tripadvisor'
  }];
  return <div className="sticky top-16 z-40">
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-soft">
        <div className="p-3 md:p-4 flex flex-col gap-3">
          {/* Row 1: Search + Date range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search reviews" className="pl-10 mx-0 px-[12px]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="date" className="pl-10" />
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="date" className="pl-10 mx-0 px-[23px]" />
              </div>
            </div>
          </div>

          {/* Row 2: Source filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sources:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map(s => {
              const active = activeSources.includes(s.key);
              return <Button key={s.key} size="sm" variant={active ? 'default' : 'outline'} className="rounded-full px-3 h-8" style={active ? {
                background: `hsl(var(${s.colorVar}))`
              } : {}} onClick={() => setActiveSources(prev => toggle(prev, s.key))}>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{
                    backgroundColor: `hsl(var(${s.colorVar}))`
                  }} />
                      {s.label}
                    </span>
                  </Button>;
            })}
            </div>
          </div>

          {/* Row 3: Rating filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Rating:</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(r => {
              const active = activeRatings.includes(r);
              return <Button key={r} size="sm" variant={active ? 'default' : 'outline'} className="rounded-full px-3 h-8" onClick={() => setActiveRatings(prev => toggle(prev, r))}>
                    {r}★
                  </Button>;
            })}
            </div>
          </div>
        </div>
      </div>
    </div>;
}