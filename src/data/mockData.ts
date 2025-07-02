export interface Review {
  id: string;
  platform: 'booking' | 'airbnb' | 'google' | 'tripadvisor';
  guestName: string;
  rating: number;
  text: string;
  date: string;
  replied: boolean;
  replyText?: string;
  propertyName: string;
}

export const mockReviews: Review[] = [
  {
    id: '1',
    platform: 'booking',
    guestName: 'Sarah Johnson',
    rating: 5,
    text: 'Amazing stay! The apartment was spotless and the location was perfect. Host was very responsive and helpful throughout our trip.',
    date: '2024-06-25',
    replied: true,
    replyText: 'Thank you so much for your kind words, Sarah! We\'re delighted you enjoyed your stay.',
    propertyName: 'Downtown Loft'
  },
  {
    id: '2',
    platform: 'airbnb',
    guestName: 'Michael Chen',
    rating: 4,
    text: 'Great place overall. Clean and comfortable. The only minor issue was the WiFi speed, but everything else was excellent.',
    date: '2024-06-22',
    replied: false,
    propertyName: 'Cozy Studio'
  },
  {
    id: '3',
    platform: 'google',
    guestName: 'Emma Wilson',
    rating: 5,
    text: 'Exceeded all expectations! Beautiful property, amazing amenities, and the host went above and beyond to make our stay memorable.',
    date: '2024-06-20',
    replied: true,
    replyText: 'Emma, thank you for this wonderful review! We\'re so happy we could make your stay special.',
    propertyName: 'Garden Villa'
  },
  {
    id: '4',
    platform: 'tripadvisor',
    guestName: 'David Brown',
    rating: 3,
    text: 'Decent stay but could use some improvements. The bed was uncomfortable and the kitchen needs updating. Location was good though.',
    date: '2024-06-18',
    replied: false,
    propertyName: 'City Center Apartment'
  },
  {
    id: '5',
    platform: 'booking',
    guestName: 'Lisa Garcia',
    rating: 5,
    text: 'Perfect getaway! Everything was exactly as described. The host provided excellent recommendations for local restaurants.',
    date: '2024-06-15',
    replied: true,
    replyText: 'Lisa, we\'re thrilled you had such a wonderful time! Thank you for staying with us.',
    propertyName: 'Beachside Cottage'
  },
  {
    id: '6',
    platform: 'airbnb',
    guestName: 'James Taylor',
    rating: 4,
    text: 'Very good experience. The check-in process was smooth and the place was clean. Would definitely book again.',
    date: '2024-06-12',
    replied: false,
    propertyName: 'Modern Flat'
  },
  {
    id: '7',
    platform: 'google',
    guestName: 'Anna Martinez',
    rating: 2,
    text: 'Unfortunately, our experience was disappointing. The property wasn\'t as clean as expected and several amenities were not working.',
    date: '2024-06-10',
    replied: true,
    replyText: 'Anna, we sincerely apologize for your experience. We take your feedback seriously and are addressing these issues immediately.',
    propertyName: 'Riverside Suite'
  },
  {
    id: '8',
    platform: 'tripadvisor',
    guestName: 'Robert Davis',
    rating: 5,
    text: 'Outstanding accommodation! Every detail was thoughtfully considered. The host\'s attention to detail is remarkable.',
    date: '2024-06-08',
    replied: true,
    replyText: 'Robert, your kind words mean the world to us! Thank you for appreciating the effort we put into every detail.',
    propertyName: 'Luxury Penthouse'
  }
];

export const analyticsData = {
  ratingTrends: [
    { month: 'Jan', rating: 4.2 },
    { month: 'Feb', rating: 4.1 },
    { month: 'Mar', rating: 4.4 },
    { month: 'Apr', rating: 4.3 },
    { month: 'May', rating: 4.5 },
    { month: 'Jun', rating: 4.4 }
  ],
  reviewCounts: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 18 },
    { month: 'May', count: 22 },
    { month: 'Jun', count: 16 }
  ],
  platformDistribution: [
    { platform: 'Booking.com', count: 28, percentage: 35 },
    { platform: 'Airbnb', count: 24, percentage: 30 },
    { platform: 'Google', count: 20, percentage: 25 },
    { platform: 'TripAdvisor', count: 8, percentage: 10 }
  ]
};

export const positiveKeywords = [
  { word: 'clean', count: 45 },
  { word: 'location', count: 38 },
  { word: 'helpful', count: 32 },
  { word: 'comfortable', count: 28 },
  { word: 'beautiful', count: 25 }
];

export const negativeKeywords = [
  { word: 'noisy', count: 12 },
  { word: 'dirty', count: 8 },
  { word: 'uncomfortable', count: 6 },
  { word: 'outdated', count: 5 },
  { word: 'expensive', count: 4 }
];