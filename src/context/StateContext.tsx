import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CollabRequest, ChatMessage, Review, Notification, Report, SystemAnalytics, Profession, CountryConfig } from '../types';
import { INITIAL_CREATOR, INITIAL_PROFESSIONALS, INITIAL_REQUESTS, INITIAL_REVIEWS, INITIAL_MESSAGES, INITIAL_REPORTS, INITIAL_ANALYTICS, SEEDED_PORTFOLIOS } from '../data/mockData';
import { countriesList as INITIAL_COUNTRIES_LIST } from '../data/countries';

const API_URL = import.meta.env.VITE_API_URL || "https://shootmate.onrender.com";

interface StateContextType {
  activeUser: User;
  activeRole: 'creator' | 'professional' | 'admin';
  professionals: User[];
  requests: CollabRequest[];
  messages: ChatMessage[];
  reviews: Review[];
  notifications: Notification[];
  reports: Report[];
  analytics: SystemAnalytics;
  selectedProfessional: User | null;
  countriesList: CountryConfig[];
  
  // Login & Session states
  isLoggedIn: boolean;
  registeredUsers: User[];
  loginUser: (email: string, password?: string) => Promise<boolean>;
  signUpUser: (newUser: User) => void;
  logoutUser: () => void;
  
  // Navigation & UI State
  activeTab: string;
  creatorDashboardTab: 'dashboard' | 'find' | 'requests' | 'insights' | 'profile';
  professionalDashboardTab: 'dashboard' | 'requests' | 'insights' | 'profile';
  
  // Setter actions
  switchUserRole: (role: 'creator' | 'professional' | 'admin') => void;
  updateActiveUser: (updated: Partial<User>) => void;
  updateProfessional: (profId: string, updated: Partial<User>) => void;
  sendRequest: (req: Omit<CollabRequest, 'id' | 'creatorId' | 'creatorName' | 'creatorPhoto' | 'createdAt' | 'status' | 'creatorReviewed' | 'professionalReviewed'>) => { success: boolean; error?: string };
  updateRequestStatus: (reqId: string, status: 'accepted' | 'rejected' | 'completed') => void;
  sendMessage: (requestId: string, text: string, files?: { name: string; url: string; type: string }) => void;
  submitReview: (reviewData: Omit<Review, 'id' | 'reviewerId' | 'reviewerName' | 'reviewerPhoto' | 'createdAt'>) => void;
  toggleSaveProfessional: (profId: string) => void;
  addNotification: (userId: string, title: string, message: string, type: 'request' | 'message' | 'review' | 'system', linkId?: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  submitReport: (reporterId: string, reportedId: string, reason: Report['reason'], details: string) => void;
  resolveReport: (reportId: string) => void;
  setSelectedProfessional: (prof: User | null) => void;
  setCreatorDashboardTab: (tab: 'dashboard' | 'find' | 'requests' | 'insights' | 'profile') => void;
  setProfessionalDashboardTab: (tab: 'dashboard' | 'requests' | 'insights' | 'profile') => void;
  setActiveTab: (tab: string) => void;
  triggerSearchFlow: (fromLanding?: boolean) => void;
  cameFromLanding: boolean;
  setCameFromLanding: (val: boolean) => void;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (val: string | null) => void;
  
  // Guard & Review Lock Helpers
  isReviewPendingBlock: (userId: string) => CollabRequest | null; // returns the blocking completed request if exists
  calculateTrustScore: (profId: string) => number;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countriesList, setCountriesList] = useState<CountryConfig[]>(INITIAL_COUNTRIES_LIST);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/locations`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCountriesList(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic locations:', err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch(`${API_URL}/api/professionals`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped = data.map((p: User) => {
              if (!p.portfolioItems || p.portfolioItems.length === 0) {
                return {
                  ...p,
                  portfolioItems: [
                    { id: `custom-${p.id}-1`, type: 'image', url: p.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', title: 'Sample click' }
                  ]
                };
              }
              return p;
            });
            setProfessionals(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic professionals from MongoDB:', err);
      }
    };
    fetchProfessionals();
  }, []);

  // Listen to storage event to keep tabs in sync for local storage fallback features
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'shootmate_messages') {
          setMessages(JSON.parse(e.newValue));
        } else if (e.key === 'shootmate_requests') {
          setRequests(JSON.parse(e.newValue));
        } else if (e.key === 'shootmate_notifications') {
          setNotifications(JSON.parse(e.newValue));
        } else if (e.key === 'shootmate_reviews') {
          setReviews(JSON.parse(e.newValue));
        } else if (e.key === 'shootmate_reports') {
          setReports(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error(`Failed to sync storage key ${e.key}:`, err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 1. Initial State Loading from LocalStorage/SessionStorage or Seeds
  const [activeRole, setActiveRole] = useState<'creator' | 'professional' | 'admin'>(() => {
    return (sessionStorage.getItem('shootmate_role') as 'creator' | 'professional' | 'admin') || 'creator';
  });

  const [activeUser, setActiveUser] = useState<User>(() => {
    const saved = sessionStorage.getItem('shootmate_active_user');
    if (saved) return JSON.parse(saved);
    return INITIAL_CREATOR; // default starting user is Alex Thorne (creator)
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('shootmate_logged_in') === 'true';
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('shootmate_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Dynamic filter: only show custom logged in / signed up accounts
          return parsed.filter((u: User) => u && u.id && u.id.startsWith('user-custom-'));
        }
      } catch (e) {
        console.error('Error parsing registered users', e);
      }
    }
    return []; // No default preloaded/fake users!
  });

  const [professionals, setProfessionals] = useState<User[]>([]);

  const [requests, setRequests] = useState<CollabRequest[]>(() => {
    const saved = localStorage.getItem('shootmate_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('shootmate_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('shootmate_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('shootmate_notifications');
    if (saved) return JSON.parse(saved);
    // Seed initial notifications based on requests
    return [
      {
        id: 'notif-seed-1',
        userId: 'user-creator-1',
        title: 'Project Proposal Accepted',
        message: 'Leo Vance accepted your request "Autumn Fashion Shoot near Louvre"',
        type: 'request',
        read: false,
        createdAt: new Date().toISOString(),
        linkId: 'req-1'
      },
      {
        id: 'notif-seed-2',
        userId: 'user-prof-1',
        title: 'New Booking Request',
        message: 'Alex Thorne sent a booking request for "Brooklyn Bridge Fitness"',
        type: 'request',
        read: false,
        createdAt: new Date().toISOString(),
        linkId: 'req-3'
      }
    ];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('shootmate_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [analytics, setAnalytics] = useState<SystemAnalytics>(() => {
    const saved = localStorage.getItem('shootmate_analytics');
    return saved ? JSON.parse(saved) : INITIAL_ANALYTICS;
  });

  // Navigation & Sub-UI Toggles
  const [activeTab, setActiveTab] = useState<string>('home');
  const [creatorDashboardTab, setCreatorDashboardTab] = useState<'dashboard' | 'find' | 'requests' | 'insights' | 'profile'>('dashboard');
  const [professionalDashboardTab, setProfessionalDashboardTab] = useState<'dashboard' | 'requests' | 'insights' | 'profile'>('dashboard');
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  const [cameFromLanding, setCameFromLanding] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // 2. Synchronize to Local Storage / Session Storage on modifications
  useEffect(() => {
    sessionStorage.setItem('shootmate_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    sessionStorage.setItem('shootmate_active_user', JSON.stringify(activeUser));
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem('shootmate_professionals', JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem('shootmate_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('shootmate_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('shootmate_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('shootmate_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('shootmate_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('shootmate_analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    sessionStorage.setItem('shootmate_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('shootmate_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // 3. Guards & Block calculations
  // Checks if user is blocked because of an outstanding completed project review
  const isReviewPendingBlock = (userId: string): CollabRequest | null => {
    // Look up completed requests touching this user where they haven't submitted a review yet.
    // Ensure both parties MUST leave reviews before creator can start new requests,
    // and professional can accept new requests.
    const unmatched = requests.find(r => {
      if (r.status !== 'completed') return false;
      if (r.creatorId === userId && !r.creatorReviewed) return true;
      if (r.professionalId === userId && !r.professionalReviewed) return true;
      return false;
    });
    return unmatched || null;
  };

  const calculateTrustScore = (profId: string): number => {
    const profReviews = reviews.filter(rev => rev.revieweeId === profId && rev.type === 'creator-to-professional');
    const bookingsCount = requests.filter(r => r.professionalId === profId && r.status === 'completed').length;
    
    let baseScore = 75; // average default starting score
    if (profReviews.length > 0) {
      const avgStars = profReviews.reduce((sum, r) => sum + r.overallRating, 0) / profReviews.length;
      baseScore = Math.floor(avgStars * 20); // convert 5 stars to 100 base
    }
    
    // Boost score based on number of completed bookings & response speed
    const projectBoost = Math.min(bookingsCount * 1.5, 10);
    const result = Math.min(Math.floor(baseScore + projectBoost), 100);
    return Math.max(result, 60); // minimum starting score
  };

  // Switch demo account profiles
  const switchUserRole = (role: 'creator' | 'professional' | 'admin') => {
    setActiveRole(role);
    if (role === 'creator') {
      const customCreator = registeredUsers.find(u => u.role === 'creator' && u.id.startsWith('user-custom-'));
      if (customCreator) {
        setActiveUser(customCreator);
      } else {
        setActiveUser({
          id: 'user-custom-fallback-creator',
          email: 'creator@shootmate.io',
          name: 'Content Creator',
          role: 'creator',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=155',
          joinedAt: new Date().toISOString(),
          country: '',
          city: '',
          rating: 5.0,
          reputationScore: 100,
          projectsCompleted: 0,
          responseTime: 'Instant',
          badges: ['🏆 Trusted Creator'],
          savedProfessionals: []
        });
      }
    } else if (role === 'professional') {
      const customPro = professionals.find(p => p.id.startsWith('user-custom-'));
      if (customPro) {
        setActiveUser(customPro);
      } else {
        setActiveUser({
          id: 'user-custom-fallback-pro',
          email: 'pro@shootmate.io',
          name: 'Professional Expert',
          role: 'professional',
          photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
          joinedAt: new Date().toISOString(),
          country: 'United States',
          city: 'New York',
          rating: 5.0,
          trustScore: 100,
          projectsCompleted: 0,
          responseTime: 'Instant',
          completionRate: 100,
          badges: ['⭐ Expert Finder'],
          savedProfessionals: []
        });
      }
    } else {
      // Admin account
      setActiveUser({
        id: 'user-admin-1',
        email: 'admin@shootmate.io',
        name: 'ShootMate Administrator',
        role: 'admin',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        joinedAt: '2024-01-01T00:00:00Z',
        country: 'Worldwide',
        city: 'Global',
        rating: 5.0,
        reputationScore: 100,
        projectsCompleted: 1000,
        responseTime: 'Instant',
        completionRate: 100,
        badges: ['💻 Operator', '🛡️ Secure Moderator'],
        savedProfessionals: []
      });
    }
  };

  // Real login, signup, and logout actions
  const loginUser = async (email: string, password?: string): Promise<boolean> => {
    if (password) {
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const dbUser = data.user;
            setActiveUser(dbUser);
            setActiveRole(dbUser.role);
            setIsLoggedIn(true);
            return true;
          }
        } else {
          const errData = await res.json();
          throw new Error(errData.error || 'Authentication failed');
        }
      } catch (err: any) {
        console.error('Login error:', err);
        throw err;
      }
    }

    // Fallback/Local login for Google session redirects or if password is not supplied
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setActiveUser(found);
      setActiveRole(found.role);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const signUpUser = async (newUser: User) => {
    setActiveUser(newUser);
    setActiveRole(newUser.role);
    setIsLoggedIn(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const savedUser = data.user;
          setActiveUser(savedUser);
          setRegisteredUsers(prev => {
            const exists = prev.some(u => u.email.toLowerCase() === savedUser.email.toLowerCase());
            if (exists) {
              return prev.map(u => u.email.toLowerCase() === savedUser.email.toLowerCase() ? savedUser : u);
            }
            return [...prev, savedUser];
          });

          if (savedUser.role === 'professional') {
            setProfessionals(prev => {
              const exists = prev.some(p => p.id === savedUser.id || p.email.toLowerCase() === savedUser.email.toLowerCase());
              if (exists) {
                return prev.map(p => p.email.toLowerCase() === savedUser.email.toLowerCase() ? savedUser : p);
              }
              return [...prev, savedUser];
            });
          }
          return;
        }
      }
    } catch (err) {
      console.error('Error syncing signup with MongoDB:', err);
    }

    // Fallback to local storage if server is offline/unavailable
    setRegisteredUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (exists) {
        return prev.map(u => u.email.toLowerCase() === newUser.email.toLowerCase() ? newUser : u);
      }
      return [...prev, newUser];
    });

    if (newUser.role === 'professional') {
      setProfessionals(prev => {
        const exists = prev.some(p => p.id === newUser.id || p.email.toLowerCase() === newUser.email.toLowerCase());
        if (exists) {
          return prev.map(p => p.email.toLowerCase() === newUser.email.toLowerCase() ? newUser : p);
        }
        return [...prev, newUser];
      });
    }
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setActiveUser(INITIAL_CREATOR);
    setActiveRole('creator');
    setActiveTab('home');
  };

  // Update active account profile
  const updateActiveUser = (updatedData: Partial<User>) => {
    setActiveUser(prev => {
      const newUser = { ...prev, ...updatedData };
      
      // If active user is professional, also update in professionals directory
      if (prev.role === 'professional') {
        setProfessionals(profs => 
          profs.map(p => p.id === prev.id ? { ...p, ...updatedData } : p)
        );
      }

      // Sync with MongoDB backend
      fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      }).catch(err => console.error('Error syncing profile update with MongoDB:', err));

      return newUser;
    });
  };

  // Update other professional records (e.g. for mock ratings)
  const updateProfessional = (profId: string, updated: Partial<User>) => {
    setProfessionals(prev => 
      prev.map(p => p.id === profId ? { ...p, ...updated } : p)
    );
  };

  // Toggle saving professionals
  const toggleSaveProfessional = (profId: string) => {
    const list = activeUser.savedProfessionals || [];
    const isSaved = list.includes(profId);
    const newList = isSaved ? list.filter(id => id !== profId) : [...list, profId];
    
    updateActiveUser({ savedProfessionals: newList });
    addNotification(
      activeUser.id,
      isSaved ? 'Professional Removed' : 'Professional Saved',
      `You ${isSaved ? 'removed' : 'saved'} professional profile reference on your dashboard.`,
      'system'
    );
  };

  // Send request from Creator to Professional
  const sendRequest = (reqData: any): { success: boolean; error?: string } => {
    // CHECK FIRST: Review penalty lock!
    const block = isReviewPendingBlock(activeUser.id);
    if (block) {
      return {
        success: false,
        error: `Review Required: You must submit your review for "${block.title}" before starting another collaboration.`
      };
    }

    const newRequest: CollabRequest = {
      id: `req-${Date.now()}`,
      creatorId: activeUser.id,
      creatorName: activeUser.name,
      creatorPhoto: activeUser.photoUrl,
      professionalId: reqData.professionalId,
      professionalName: reqData.professionalName,
      professionalPhoto: reqData.professionalPhoto,
      title: reqData.title,
      description: reqData.description,
      country: reqData.country,
      city: reqData.city,
      date: reqData.date,
      budget: Number(reqData.budget),
      requirements: reqData.requirements || 'Standard high-res files.',
      status: 'pending',
      createdAt: new Date().toISOString(),
      creatorReviewed: false,
      professionalReviewed: false
    };

    setRequests(prev => [newRequest, ...prev]);

    // Sync with MongoDB Project collection
    fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newRequest.id,
        title: newRequest.title,
        date: newRequest.date,
        creatorId: newRequest.creatorId,
        professionalId: newRequest.professionalId
      }),
    }).catch(err => console.error('Error syncing project to MongoDB:', err));

    // Send notification to the designated professional
    addNotification(
      reqData.professionalId,
      'New Shoot proposal received! 📸',
      `${activeUser.name} requested a "${reqData.title}" collab in ${reqData.city} on ${reqData.date}. Budget: $${reqData.budget}`,
      'request',
      newRequest.id
    );

    // Increment Analytics
    setAnalytics(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1
    }));

    return { success: true };
  };

  // Update proposal status (Accept, Reject, Complete)
  const updateRequestStatus = (reqId: string, status: 'accepted' | 'rejected' | 'completed') => {
    // If status change is completed, we update metrics
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        // Send state alerts
        const otherPartyId = activeRole === 'creator' ? req.professionalId : req.creatorId;
        const otherPartyName = activeRole === 'creator' ? req.professionalName : req.creatorName;
        
        let notifTitle = '';
        let notifMsg = '';
        
        if (status === 'accepted') {
          notifTitle = 'Shoot Proposal Accepted! 🎉';
          notifMsg = `${req.professionalName} accepted your project "${req.title}"! Open chat to coordinate logs.`;
        } else if (status === 'rejected') {
          notifTitle = 'Shoot Proposal Declined';
          notifMsg = `${req.professionalName} declined your request for "${req.title}". Try another creative!`;
        } else if (status === 'completed') {
          notifTitle = 'Shoot Marked as Finished! 🎬';
          notifMsg = `Please leave feedback on "${req.title}". Compulsory rating guarantees community standards on ShootMate.`;
        }

        addNotification(otherPartyId, notifTitle, notifMsg, 'request', reqId);

        // Update counts if completed
        if (status === 'completed') {
          // Increment completed projects in professionals list
          setProfessionals(profs => 
            profs.map(p => p.id === req.professionalId ? { ...p, projectsCompleted: p.projectsCompleted + 1 } : p)
          );
        }

        return { ...req, status };
      }
      return req;
    }));
  };

  // Post chat message inside Requests messenger
  const sendMessage = (requestId: string, text: string, optionalFile?: { name: string; url: string; type: string }) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      text,
      image: optionalFile?.type.includes('image') ? optionalFile.url : undefined,
      fileUrl: !optionalFile?.type.includes('image') ? optionalFile?.url : undefined,
      fileName: optionalFile?.name,
      createdAt: new Date().toISOString()
    };

    // Load latest messages from localStorage to prevent overwriting other tab's concurrent messages
    let latestMessages: ChatMessage[] = [];
    const saved = localStorage.getItem('shootmate_messages');
    if (saved) {
      try {
        latestMessages = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing latest messages', e);
      }
    }
    if (!Array.isArray(latestMessages)) {
      latestMessages = [];
    }

    const updated = [...latestMessages, newMessage];
    setMessages(updated);
    localStorage.setItem('shootmate_messages', JSON.stringify(updated));

    // Send notifications to corresponding counterpart
    const associatedReq = requests.find(r => r.id === requestId);
    if (associatedReq) {
      const recipientId = activeUser.id === associatedReq.creatorId 
        ? associatedReq.professionalId 
        : associatedReq.creatorId;
      addNotification(
        recipientId,
        `New Message from ${activeUser.name}`,
        text ? (text.length > 50 ? text.substring(0, 47) + '...' : text) : 'Sent a file preview block.',
        'message',
        requestId
      );
    }
  };

  // Submit double-blind review
  const submitReview = (revData: Omit<Review, 'id' | 'reviewerId' | 'reviewerName' | 'reviewerPhoto' | 'createdAt'>) => {
    const newReview: Review = {
      ...revData,
      id: `rev-${Date.now()}`,
      reviewerId: activeUser.id,
      reviewerName: activeUser.name,
      reviewerPhoto: activeUser.photoUrl,
      createdAt: new Date().toISOString()
    };

    // Append to local state list
    setReviews(prev => [newReview, ...prev]);

    // Update request state reviewed true
    setRequests(prev => prev.map(req => {
      if (req.id === revData.requestId) {
        const upReq = { ...req };
        if (revData.type === 'creator-to-professional') {
          upReq.creatorReviewed = true;
        } else {
          upReq.professionalReviewed = true;
        }

        // Check if both sides submitted review to notify peers
        if (upReq.creatorReviewed && upReq.professionalReviewed) {
          addNotification(
            req.creatorId,
            'New double-blind review published! 🌟',
            `Both reviews for "${req.title}" are now unlocked and public. Check your reputation score!`,
            'review',
            req.id
          );
          addNotification(
            req.professionalId,
            'New double-blind review published! 🌟',
            `Both reviews for "${req.title}" are now unlocked and public. Your trust score has been updated!`,
            'review',
            req.id
          );

          // Re-calculate professional ratings
          const relevantReviews = [...reviews, newReview].filter(
            rev => rev.revieweeId === req.professionalId && rev.type === 'creator-to-professional'
          );
          if (relevantReviews.length > 0) {
            const sumOfOverall = relevantReviews.reduce((sum, r) => sum + r.overallRating, 0);
            const finalRating = Number((sumOfOverall / relevantReviews.length).toFixed(2));
            
            setProfessionals(profs => profs.map(p => {
              if (p.id === req.professionalId) {
                const finishedRate = finalRating;
                const scores = calculateTrustScore(p.id);
                return {
                  ...p,
                  rating: finishedRate,
                  trustScore: scores
                };
              }
              return p;
            }));
          }

          // Re-calculate creator ratings
          const creatorReviews = [...reviews, newReview].filter(
            rev => rev.revieweeId === req.creatorId && rev.type === 'professional-to-creator'
          );
          if (creatorReviews.length > 0) {
            const sumOfCreatorOverall = creatorReviews.reduce((sum, r) => sum + r.overallRating, 0);
            const creatorAvg = Number((sumOfCreatorOverall / creatorReviews.length).toFixed(2));
            const repScore = Math.min(Math.floor(creatorAvg * 20), 100);
            
            // If active user is creator, update state details
            if (activeUser.id === req.creatorId) {
              updateActiveUser({ rating: creatorAvg, reputationScore: repScore });
            }
          }
        }
        return upReq;
      }
      return req;
    }));

    // Trigger notification regarding feedback filing
    const targetUserId = activeUser.id;
    addNotification(
      targetUserId,
      'Feedback recorded successfully!',
      `You completed peer grading for project "${revData.projectTitle}".`,
      'review'
    );
  };

  // Submit User Report (Abuse, spam, non-payment)
  const submitReport = (reporterId: string, reportedId: string, reason: Report['reason'], details: string) => {
    const reportedUser = professionals.find(p => p.id === reportedId) || 
                         (reportedId === INITIAL_CREATOR.id ? INITIAL_CREATOR : null);
    
    if (!reportedUser) return;

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId,
      reporterName: activeUser.name,
      reportedId,
      reportedName: reportedUser.name,
      reportedRole: reportedUser.role,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);

    addNotification(
      'user-admin-1',
      '🚨 New User Violation Reported!',
      `Reporter: ${activeUser.name} accused ${reportedUser.name} of "${reason}".`,
      'system'
    );
  };

  const resolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    addNotification(
      activeUser.id,
      'Report Handled',
      'The moderation team has handled your reported incident. Thanks for keeping our creatives community safe!',
      'system'
    );
  };

  // Add Notification to user feed
  const addNotification = (userId: string, title: string, message: string, type: 'request' | 'message' | 'review' | 'system', linkId?: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      linkId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Read mark helper
  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  // Quick navigation helpers
  const triggerSearchFlow = (fromLanding: boolean = false) => {
    setActiveTab('search');
    setSelectedProfessional(null);
    setCameFromLanding(fromLanding);
  };

  return (
    <StateContext.Provider value={{
      activeUser,
      activeRole,
      professionals,
      requests,
      messages,
      reviews,
      notifications,
      reports,
      analytics,
      selectedProfessional,
      countriesList,
      activeTab,
      creatorDashboardTab,
      professionalDashboardTab,
      cameFromLanding,
      setCameFromLanding,
      redirectAfterLogin,
      setRedirectAfterLogin,
      
      isLoggedIn,
      registeredUsers,
      loginUser,
      signUpUser,
      logoutUser,
      
      switchUserRole,
      updateActiveUser,
      updateProfessional,
      sendRequest,
      updateRequestStatus,
      sendMessage,
      submitReview,
      toggleSaveProfessional,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      submitReport,
      resolveReport,
      setSelectedProfessional,
      setCreatorDashboardTab,
      setProfessionalDashboardTab,
      setActiveTab,
      triggerSearchFlow,
      
      isReviewPendingBlock,
      calculateTrustScore
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useApp must be used inside a StateProvider context wrapper.');
  }
  return context;
};
