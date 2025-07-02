import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockReviews } from '@/data/mockData';
import ReviewCard from '@/components/ReviewCard';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Reviews() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.guestName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || review.platform === platformFilter;
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'high' && review.rating >= 4) ||
                         (ratingFilter === 'medium' && review.rating === 3) ||
                         (ratingFilter === 'low' && review.rating <= 2);
    
    return matchesSearch && matchesPlatform && matchesRating;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Reviews</h1>
        <p className="text-muted-foreground mt-2">Manage and respond to guest reviews from all platforms.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('search_reviews')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="booking">Booking.com</SelectItem>
              <SelectItem value="airbnb">Airbnb</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="high">4-5 Stars</SelectItem>
              <SelectItem value="medium">3 Stars</SelectItem>
              <SelectItem value="low">1-2 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {platformFilter !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setPlatformFilter('all')}>
              Platform: {platformFilter} ×
            </Badge>
          )}
          {ratingFilter !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setRatingFilter('all')}>
              Rating: {ratingFilter} ×
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
              Search: "{searchTerm}" ×
            </Badge>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredReviews.length} of {mockReviews.length} reviews
        </p>
        <Button variant="professional">
          Export Reviews
        </Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reviews found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setPlatformFilter('all');
              setRatingFilter('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}