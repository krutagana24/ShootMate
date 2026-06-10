import { User, CollabRequest, ChatMessage, Review, Report, SystemAnalytics } from '../types';

// Curated beautiful stock photos that match a premium modern aesthetic
export const STOCK_PHOTOS = {
  creatorHero: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
  photographerCard: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
  videographerCard: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
  cameramanCard: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600',
  editorCard: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600',
  
  avatars: {
    alex: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', // Creator 1
    leo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',  // Prof 1 (Paris)
    sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', // Prof 2 (Tokyo)
    marcus: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',// Prof 3 (Rome)
    elena: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150', // Prof 4 (London)
    devon: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150', // Prof 5 (New York)
    amina: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150', // Prof 6 (Paris)
  },
  
  portfolio: [
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1481137562224-6e2413dba25c?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500'
  ]
};

export const INITIAL_CREATOR: User = {
  id: 'user-creator-1',
  email: 'alex@thornecreative.co',
  name: 'Alex Thorne',
  role: 'creator',
  photoUrl: STOCK_PHOTOS.avatars.alex,
  joinedAt: '2025-01-15T08:00:00Z',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  phone: '+1 (555) 382-9020',
  rating: 4.95,
  reputationScore: 98,
  projectsCompleted: 24,
  responseTime: '15 mins',
  completionRate: 100,
  badges: ['🏆 Trusted Creator', '🚀 Fast Communicator'],
  savedProfessionals: ['user-prof-1', 'user-prof-2']
};

export const INITIAL_PROFESSIONALS: User[] = [
  {
    id: 'user-prof-1',
    email: 'leo.vance@lensworks.io',
    name: 'Leo Vance',
    role: 'professional',
    photoUrl: STOCK_PHOTOS.avatars.leo,
    coverUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    country: 'France',
    state: 'Île-de-France',
    city: 'Paris',
    phone: '+33 6 4390 1202',
    joinedAt: '2025-02-12T10:30:00Z',
    professions: ['Photographer', 'Videographer'],
    experience: 7,
    languages: ['English', 'French'],
    about: 'Photographer and visual content designer focusing on fashion, high-energy travel content, and cinematic brand reels. Based in the heart of Paris, I know the best hidden spots for high-tier aesthetic captures. Regularly shoot with visiting creators, YouTubers, and luxury brands.',
    pricingRate: 450,
    availabilityStatus: 'available',
    instagram: 'leovance_photos',
    website: 'leovance.visuals.com',
    rating: 4.9,
    trustScore: 97,
    projectsCompleted: 58,
    responseTime: '< 30 minutes',
    completionRate: 98,
    repeatClientRate: 25,
    badges: ['🏆 Top Rated', '🔥 Most Hired', '🚀 Fast Responder', '🎥 Travel Specialist']
  },
  {
    id: 'user-prof-2',
    email: 'sarah.chen@retrograde.net',
    name: 'Sarah Chen',
    role: 'professional',
    photoUrl: STOCK_PHOTOS.avatars.sarah,
    coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800',
    country: 'Japan',
    state: 'Tokyo',
    city: 'Tokyo',
    phone: '+81 90 2831 2921',
    joinedAt: '2025-03-01T05:20:00Z',
    professions: ['Photographer', 'Video Editor'],
    experience: 5,
    languages: ['Japanese', 'English', 'Mandarin'],
    about: 'I specialize in street fashion photography, cyber-punk neon styling, and ultra-crisp motion-tracked video editing. If you are a creator visiting Tokyo, let’s paint the night city together. I handle full editing pipelines with customized color grading filters within 24 hours.',
    pricingRate: 520,
    availabilityStatus: 'available',
    instagram: 'sarah_chen_tokyo',
    website: 'sarahchen.tokyo',
    rating: 4.85,
    trustScore: 94,
    projectsCompleted: 39,
    responseTime: '< 1 hour',
    completionRate: 95,
    repeatClientRate: 15,
    badges: ['⭐ Rising Talent', '📸 Photography Expert', '🎬 Editing Expert']
  },
  {
    id: 'user-prof-3',
    email: 'marcus.aurelius@lensroma.it',
    name: 'Marcus Aurelius',
    role: 'professional',
    photoUrl: STOCK_PHOTOS.avatars.marcus,
    coverUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
    country: 'Italy',
    state: 'Lazio',
    city: 'Rome',
    phone: '+39 333 4902 122',
    joinedAt: '2024-11-20T11:45:00Z',
    professions: ['Cameraman', 'Videographer'],
    experience: 12,
    languages: ['Italian', 'English', 'Spanish'],
    about: 'Award-winning travel documentary filmmaker and corporate cameraman working across Rome, Florence, and Amalfi. I possess top-tier audio capture devices, dual Sony FX3 rigs, wireless Lavs, and professional lighting units. Safe logistics and pristine historic shoots.',
    pricingRate: 650,
    availabilityStatus: 'booked',
    instagram: 'marcus_films_rome',
    website: 'marcuscine.it',
    rating: 4.98,
    trustScore: 99,
    projectsCompleted: 112,
    responseTime: '< 2 hours',
    completionRate: 100,
    repeatClientRate: 40,
    badges: ['🏆 Top Rated', '💎 Premium Professional', '🚀 Fast Responder']
  },
  {
    id: 'user-prof-4',
    email: 'elena.rostova@editlondon.io',
    name: 'Elena Rostova',
    role: 'professional',
    photoUrl: STOCK_PHOTOS.avatars.elena,
    coverUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
    country: 'United Kingdom',
    state: 'England',
    city: 'London',
    phone: '+44 7700 900077',
    joinedAt: '2025-04-10T14:15:00Z',
    professions: ['Video Editor'],
    experience: 4,
    languages: ['Russian', 'English'],
    about: 'Fast, modern YouTube vlogger editor specializing in retention-based, high-retention video sequencing. I edit directly inside Premiere Pro and After Effects. Expert at pacing, meme inserts, green-screens, sound effects, and scroll-stopping Instagram Reels conversions.',
    pricingRate: 300,
    availabilityStatus: 'available',
    instagram: 'elena_edits',
    website: 'elenaedits.net',
    rating: 4.75,
    trustScore: 91,
    projectsCompleted: 22,
    responseTime: '< 30 minutes',
    completionRate: 92,
    repeatClientRate: 10,
    badges: ['⭐ Rising Talent', '🎬 Editing Expert']
  },
  {
    id: 'user-prof-5',
    email: 'devon@nyclights.com',
    name: 'Devon Brooks',
    role: 'professional',
    photoUrl: STOCK_PHOTOS.avatars.devon,
    coverUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
    country: 'United States',
    state: 'New York',
    city: 'Brooklyn',
    phone: '+1 (212) 351-9210',
    joinedAt: '2024-09-05T09:00:00Z',
    professions: ['Photographer', 'Cameraman'],
    experience: 8,
    languages: ['English'],
    about: 'Brooklyn-born native visual producer and portrait expert. Perfect shooting options for fitness creators, athletic brands, skate lifestyles, and high-fashion streetwear. I operate across Manhattan, Brooklyn, and Queens. Prompt, high-energy, and modern raw aesthetics.',
    pricingRate: 480,
    availabilityStatus: 'available',
    instagram: 'devon_lens_nyc',
    website: 'devonbrooks.com',
    rating: 4.92,
    trustScore: 96,
    projectsCompleted: 74,
    responseTime: '< 1 hour',
    completionRate: 97,
    repeatClientRate: 30,
    badges: ['🏆 Top Rated', '🔥 Most Hired', '📸 Photography Expert']
  },
  {
    id: 'user-prof-6',
    email: 'amina.diop@visuals.fr',
    name: 'Amina Diop',
    role: 'professional',
    photoUrl: STOCK_PHOTOS.avatars.amina,
    coverUrl: 'https://images.unsplash.com/photo-1499856871958-5b9647a64dbd?auto=format&fit=crop&q=80&w=800',
    country: 'France',
    state: 'Île-de-France',
    city: 'Paris',
    phone: '+33 6 5291 9912',
    joinedAt: '2025-01-20T16:00:00Z',
    professions: ['Videographer', 'Video Editor'],
    experience: 6,
    languages: ['English', 'French', 'Wolof'],
    about: 'I do aesthetic cinematic vlogs, reels, travel-blogs, and editorial videography for luxury creators touring Europe. Let’s create visual masterpieces capturing the historic cafés, towers, and hidden alleyways of Paris. Delivering stylized sequences ready for social media.',
    pricingRate: 500,
    availabilityStatus: 'available',
    instagram: 'amina_visuals_paris',
    website: 'aminadiop.design',
    rating: 4.88,
    trustScore: 95,
    projectsCompleted: 45,
    responseTime: '< 45 minutes',
    completionRate: 96,
    repeatClientRate: 20,
    badges: ['🏆 Top Rated', '🎥 Travel Specialist', '🎬 Editing Expert']
  }
];

// Default seeded portfolio templates
export const SEEDED_PORTFOLIOS: Record<string, { id: string; type: 'image' | 'video'; url: string; title: string; category?: string }[]> = {
  'user-prof-1': [
    { id: 'p1_1', type: 'image', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=500', title: 'Louvre Golden Hour Shoot', category: 'Travel Shoots' },
    { id: 'p1_2', type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500', title: 'Vogue France Editorial', category: 'Portfolio Shoots' },
    { id: 'p1_3', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-under-eiffel-tower-in-paris-4531-large.mp4', title: 'Paris Travel Promo', category: 'Travel Videos' },
    { id: 'p1_4', type: 'image', url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=500', title: 'Eiffel Tower Sunrise Portrait', category: 'Travel Shoots' },
  ],
  'user-prof-2': [
    { id: 'p2_1', type: 'image', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=500', title: 'Shibuya Street Pacing', category: 'Portfolio Shoots' },
    { id: 'p2_2', type: 'image', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=500', title: 'Cyberpunk Tokyo Night Portrait', category: 'Travel Shoots' },
    { id: 'p2_3', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-tokyo-night-street-lights-23114-large.mp4', title: 'Electric Tokyo B-Roll', category: 'Brand Content' },
  ],
  'user-prof-3': [
    { id: 'p3_1', type: 'image', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=500', title: 'Colosseum Majestic Profile', category: 'Events' },
    { id: 'p3_2', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-colosseum-in-rome-sunset-aerial-view-41710-large.mp4', title: 'Rome Documentary Sequence', category: 'Documentaries' },
    { id: 'p3_3', type: 'image', url: 'https://images.unsplash.com/photo-1515542690898-8592c3036291?auto=format&fit=crop&q=80&w=500', title: 'Italian Sunsets Series', category: 'Interviews' },
  ]
};

// Seed Requests
export const INITIAL_REQUESTS: CollabRequest[] = [
  {
    id: 'req-1',
    creatorId: 'user-creator-1',
    creatorName: 'Alex Thorne',
    creatorPhoto: STOCK_PHOTOS.avatars.alex,
    professionalId: 'user-prof-1',
    professionalName: 'Leo Vance',
    professionalPhoto: STOCK_PHOTOS.avatars.leo,
    title: 'Autumn Fashion Shoot near Louvre',
    description: 'Looking to record a 15-second reel and take 10 premium portraits for my streetwear clothing brand. Must be familiar with golden hour framing around the main museum pyramids and gardens.',
    country: 'France',
    city: 'Paris',
    date: '2026-06-15',
    budget: 450,
    requirements: 'Sony camera, fast prime lens, color grading, rapid photo export.',
    status: 'completed',
    createdAt: '2026-06-01T10:00:00Z',
    creatorReviewed: true,
    professionalReviewed: true
  },
  {
    id: 'req-2',
    creatorId: 'user-creator-1',
    creatorName: 'Alex Thorne',
    creatorPhoto: STOCK_PHOTOS.avatars.alex,
    professionalId: 'user-prof-2',
    professionalName: 'Sarah Chen',
    professionalPhoto: STOCK_PHOTOS.avatars.sarah,
    title: 'Cyberpunk Neon Street Shoot',
    description: 'Looking to shoot 3 cinematic reels in Shinjuku and Akihabara at night with heavy neon lighting and rain effects if possible. Need high energy cuts and modern sound design.',
    country: 'Japan',
    city: 'Tokyo',
    date: '2026-07-20',
    budget: 520,
    requirements: 'Gimbal stability, Log recording, fast editing turnaround.',
    status: 'accepted',
    createdAt: '2026-06-03T09:12:00Z',
    creatorReviewed: false,
    professionalReviewed: false
  },
  {
    id: 'req-3',
    creatorId: 'user-creator-1',
    creatorName: 'Alex Thorne',
    creatorPhoto: STOCK_PHOTOS.avatars.alex,
    professionalId: 'user-prof-5',
    professionalName: 'Devon Brooks',
    professionalPhoto: STOCK_PHOTOS.avatars.devon,
    title: 'Brooklyn Bridge Fitness Vlogging',
    description: 'Need dynamic camerawork on Brooklyn bridge at sunrise tracking fitness sprints and athlete lifestyle. High frames-per-second capability required for speed-ramping.',
    country: 'United States',
    city: 'Brooklyn',
    date: '2026-06-12',
    budget: 480,
    requirements: 'Slow-motion capability, active gimbal tracking.',
    status: 'pending',
    createdAt: '2026-06-05T14:30:00Z',
    creatorReviewed: false,
    professionalReviewed: false
  }
];

// Speeded Reviews
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    requestId: 'req-1',
    projectTitle: 'Autumn Fashion Shoot near Louvre',
    reviewerId: 'user-creator-1',
    reviewerName: 'Alex Thorne',
    reviewerPhoto: STOCK_PHOTOS.avatars.alex,
    revieweeId: 'user-prof-1',
    revieweeName: 'Leo Vance',
    type: 'creator-to-professional',
    overallRating: 5,
    writtenReview: 'Leo Vance is absolute genius! He has incredible knowledge of Paris lighting, knew exact corners where tourists do not crowd, and returned beautifully graded raw files in record speed. Absolutely highly recommended for any traveling creators!',
    wouldRecommendAgain: true,
    createdAt: '2026-06-04T18:00:00Z',
    breakdown: {
      professionalism: 5,
      communication: 5,
      quality: 5,
      punctuality: 5,
      valueForMoney: 5
    }
  },
  {
    id: 'rev-2',
    requestId: 'req-1',
    projectTitle: 'Autumn Fashion Shoot near Louvre',
    reviewerId: 'user-prof-1',
    reviewerName: 'Leo Vance',
    reviewerPhoto: STOCK_PHOTOS.avatars.leo,
    revieweeId: 'user-creator-1',
    revieweeName: 'Alex Thorne',
    type: 'professional-to-creator',
    overallRating: 5,
    writtenReview: 'Superb collaboration with Alex. He came with a very clear, organized brief, knew exactly what he wanted but remained highly collaborative. Instant payment and perfect communication throughout. Hope to work again next time you are in France!',
    wouldRecommendAgain: true,
    createdAt: '2026-06-04T18:15:00Z',
    breakdown: {
      communication: 5,
      paymentReliability: 5,
      requirementClarity: 5,
      professionalBehaviour: 5,
      collaborationExperience: 5
    }
  }
];

// Initial Messages
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    requestId: 'req-1',
    senderId: 'user-creator-1',
    senderName: 'Alex Thorne',
    text: 'Hey Leo! I just landed in Paris. Stoked for our Louvre shoot this Friday!',
    createdAt: '2026-06-02T10:00:00Z'
  },
  {
    id: 'msg-2',
    requestId: 'req-1',
    senderId: 'user-prof-1',
    senderName: 'Leo Vance',
    text: 'Welcome to Paris, Alex! Yes, everything is ready on my side. Weather forecast looks perfect for golden hour around 6:00 PM. I’ll meet you directly by the main glass pyramid.',
    createdAt: '2026-06-02T10:15:00Z'
  },
  {
    id: 'msg-3',
    requestId: 'req-1',
    senderId: 'user-creator-1',
    senderName: 'Alex Thorne',
    text: 'Awesome, see you there!',
    createdAt: '2026-06-02T10:17:00Z'
  }
];

// Default admin reports
export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-creator-1',
    reporterName: 'Alex Thorne',
    reportedId: 'user-prof-4',
    reportedName: 'Elena Rostova',
    reportedRole: 'professional',
    reason: 'Spam',
    details: 'Received repeated copy-pasted messages in off-topic discussions. Requesting check.',
    status: 'pending',
    createdAt: '2026-06-05T12:00:00Z'
  }
];

export const INITIAL_ANALYTICS: SystemAnalytics = {
  totalUsers: 240,
  totalProfessionals: 168,
  totalCreators: 72,
  totalRequests: 320,
  topCities: [
    { city: 'Paris, France', count: 94 },
    { city: 'Tokyo, Japan', count: 75 },
    { city: 'London, UK', count: 62 },
    { city: 'New York, USA', count: 50 },
    { city: 'Rome, Italy', count: 39 }
  ],
  topCategories: [
    { category: 'Photographer', count: 145 },
    { category: 'Videographer', count: 112 },
    { category: 'Video Editor', count: 48 },
    { category: 'Cameraman', count: 15 }
  ]
};
