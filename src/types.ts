export type Role = 'creator' | 'professional' | 'admin';

export type Profession = 'Photographer' | 'Videographer' | 'Cameraman' | 'Video Editor';

export interface UserRatingBreakdown {
  professionalism?: number;
  communication?: number;
  quality?: number;
  punctuality?: number;
  value?: number;
  paymentReliability?: number;
  requirementClarity?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  photoUrl: string;
  coverUrl?: string;
  country: string;
  state: string;
  city: string;
  phone?: string;
  joinedAt: string;
  
  // Professional-specific properties
  professions?: Profession[];
  experience?: number; // years
  languages?: string[];
  about?: string;
  pricingRate?: number; // base pricing (e.g. per day or project)
  availabilityStatus?: 'available' | 'booked' | 'unavailable';
  portfolioItems?: PortfolioItem[];
  instagram?: string;
  website?: string;
  
  // Scoring & Performance
  rating: number;
  trustScore?: number; // For professional (0 - 100)
  reputationScore?: number; // For creator (0 - 100)
  projectsCompleted: number;
  responseTime: string; // e.g. "< 1 hour"
  completionRate?: number; // percentage
  repeatClientRate?: number; // percentage
  badges: string[]; // e.g. "🏆 Top Rated", "⭐ Rising Talent", etc.
  
  // State for saved profiles list
  savedProfessionals?: string[]; // IDs
}

export interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  category?: string;
}

export interface CollabRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorPhoto: string;
  professionalId: string;
  professionalName: string;
  professionalPhoto: string;
  title: string;
  description: string;
  country: string;
  city: string;
  date: string;
  budget: number;
  requirements: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  
  // Review Status to prevent bypasses
  creatorReviewed: boolean;
  professionalReviewed: boolean;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  text: string;
  image?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  requestId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto: string;
  revieweeId: string;
  revieweeName: string;
  type: 'creator-to-professional' | 'professional-to-creator';
  overallRating: number;
  writtenReview: string;
  wouldRecommendAgain: boolean; // Yes/No
  createdAt: string;
  
  // Specific category scores
  breakdown: {
    professionalism?: number;
    communication?: number;
    quality?: number;
    punctuality?: number;
    valueForMoney?: number;
    paymentReliability?: number;
    requirementClarity?: number;
    professionalBehaviour?: number;
    collaborationExperience?: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'message' | 'review' | 'system';
  read: boolean;
  createdAt: string;
  linkId?: string; // e.g. request ID or message ID
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedId: string;
  reportedName: string;
  reportedRole: Role;
  reason: 'Fake Profile' | 'Spam' | 'Abusive Behaviour' | 'Non-Payment' | 'No Show' | 'Fraud' | 'Other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface SystemAnalytics {
  totalUsers: number;
  totalProfessionals: number;
  totalCreators: number;
  totalRequests: number;
  topCities: { city: string; count: number }[];
  topCategories: { category: string; count: number }[];
}

export interface CountryConfig {
  name: string;
  code: string;
  cities: string[];
  digitsCount: number;
}
