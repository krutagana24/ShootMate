import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { CollabRequest, User } from '../types';
import { SearchProfessionals } from './SearchProfessionals';
import { ProfessionalProfile } from './ProfessionalProfile';
import { ChatSystem } from './ChatSystem';
import { ReviewModal } from './ReviewModal';
import { 
  PlusCircle, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  FileText, 
  Heart, 
  TrendingUp, 
  BarChart2, 
  UserCircle, 
  Grid, 
  MessageSquare, 
  AlertCircle,
  FolderLock,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Home,
  LogOut
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const { 
    activeUser, 
    requests, 
    creatorDashboardTab, 
    setCreatorDashboardTab, 
    professionals, 
    setSelectedProfessional, 
    setActiveTab,
    activeTab,
    toggleSaveProfessional,
    updateActiveUser,
    isReviewPendingBlock,
    logoutUser,
    setCameFromLanding
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRequestFilter, setActiveRequestFilter] = useState<'All' | 'pending' | 'accepted' | 'rejected' | 'completed'>('All');
  const [selectedRequestIdForChat, setSelectedRequestIdForChat] = useState<string | null>(null);
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<CollabRequest | null>(null);

  const [editName, setEditName] = useState(activeUser.name);
  const [editCountry, setEditCountry] = useState(activeUser.country);
  const [editCity, setEditCity] = useState(activeUser.city);
  const [editPhone, setEditPhone] = useState(activeUser.phone || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(activeUser.photoUrl || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Count items stats
  const creatorRequests = requests.filter(r => r.creatorId === activeUser.id);
  const filterRequests = creatorRequests.filter(r => activeRequestFilter === 'All' || r.status === activeRequestFilter);
  
  const sentCount = creatorRequests.length;
  const acceptedCount = creatorRequests.filter(r => r.status === 'accepted').length;
  const completedCount = creatorRequests.filter(r => r.status === 'completed').length;
  const savedCount = activeUser.savedProfessionals?.length || 0;

  // Retrieve matching saved professionals details
  const savedProDetails = professionals.filter(p => activeUser.savedProfessionals?.includes(p.id));

  // Determine places of interaction dynamically (requests + registered professionals)
  const requestCities = creatorRequests
    .filter(r => r.city && r.country)
    .map(r => ({
      city: r.city,
      country: r.country,
      key: `${r.city}, ${r.country}`
    }));

  const counts: Record<string, { city: string; country: string; count: number }> = {};
  requestCities.forEach(item => {
    if (!counts[item.key]) {
      counts[item.key] = { city: item.city, country: item.country, count: 0 };
    }
    counts[item.key].count += 1;
  });

  const sortedHubs = Object.values(counts).sort((a, b) => b.count - a.count);
  const topDestinationHubs = sortedHubs.map(item => ({
    label: `${item.city}, ${item.country}`,
    searches: item.count
  }));

  if (topDestinationHubs.length < 3) {
    const proCities = professionals
      .filter(p => p.city && p.country)
      .map(p => `${p.city}, ${p.country}`);
    const uniqueProCities = Array.from(new Set(proCities));
    for (const cityStr of uniqueProCities) {
      if (topDestinationHubs.length >= 3) break;
      if (!topDestinationHubs.some(r => r.label.toLowerCase() === cityStr.toLowerCase())) {
        topDestinationHubs.push({
          label: cityStr,
          searches: 0
        });
      }
    }
  }

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateActiveUser({
      name: editName,
      country: editCountry,
      city: editCity,
      phone: editPhone,
      photoUrl: editPhotoUrl
    });
    setProfileSuccessMsg('Profile changes updated locally!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const reviewBlockStatus = isReviewPendingBlock(activeUser.id);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid },
    { id: 'find', label: 'Find Professionals', icon: PlusCircle },
    { id: 'requests', label: 'Requests', icon: MessageSquare, badge: creatorRequests.filter(r => r.status === 'pending' || r.status === 'accepted').length },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'profile', label: 'Profile Settings', icon: UserCircle }
  ];

  return (
    <div className="flex h-screen w-full bg-brand-bg-cream overflow-hidden text-left font-sans">
      
      {/* Sidebar Container */}
      <div 
        className={`h-full bg-white border-r border-brand-border/60 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative ${
          isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
        }`}
      >
        {isSidebarOpen && (
          <div className="flex flex-col h-full justify-between p-5">
            <div className="space-y-4">
              <div className="pb-4 mb-3 border-b border-brand-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img src={activeUser.photoUrl} alt="Creator avatar" className="w-10 h-10 rounded-xl object-cover border shrink-0" />
                  <div className="truncate text-left">
                    <span className="text-[10px] font-bold text-brand-primary uppercase font-mono tracking-wider block">Logged as Creator</span>
                    <h3 className="font-display font-extrabold text-sm text-brand-text leading-tight truncate">{activeUser.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map(item => {
                  const Icon = item.icon;
                  const isSelected = creatorDashboardTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCreatorDashboardTab(item.id as any);
                        setSelectedRequestIdForChat(null);
                        setCameFromLanding(false);
                      }}
                      className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-bold font-sans transition cursor-pointer ${
                        isSelected 
                          ? 'bg-brand-primary text-white shadow-xs' 
                          : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg-soft'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className={`text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold ${
                          isSelected ? 'bg-white text-brand-primary' : 'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 mt-4 border-t border-brand-border/60 space-y-1">
              <button
                onClick={() => setActiveTab('home')}
                className="w-full flex items-center gap-2.5 py-2 px-3.5 rounded-xl text-xs font-bold font-sans text-brand-muted hover:text-brand-text hover:bg-brand-bg-soft transition cursor-pointer"
              >
                <Home className="w-4 h-4 shrink-0 text-slate-500" />
                <span>Go to Website</span>
              </button>
              <button
                onClick={() => logoutUser()}
                className="w-full flex items-center gap-2.5 py-2 px-3.5 rounded-xl text-xs font-bold font-sans text-brand-danger hover:text-red-600 hover:bg-red-50/50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0 text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content pane */}
      <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 text-left relative space-y-8">
        
        {/* Sleek dashboard header with expand toggle */}
        <div className="flex items-start gap-4 mb-4">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mt-1 p-2 bg-white border border-brand-border/60 rounded-xl hover:bg-brand-bg-soft transition text-slate-500 hover:text-slate-800 cursor-pointer shadow-xs flex items-center justify-center shrink-0"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-[9px] font-mono font-bold text-brand-primary uppercase tracking-wider block mb-1">
              ShootMate Workspace
            </span>
            <h1 className="font-display font-black text-2xl lg:text-3xl text-brand-text leading-tight">
              {activeTab === 'professional-profile' ? 'Vetted Expert Profile' : (
                <>
                  {creatorDashboardTab === 'dashboard' && 'Workspace Studio'}
                  {creatorDashboardTab === 'find' && 'Vetted Creative Catalogs'}
                  {creatorDashboardTab === 'requests' && 'Collaboration Workspace'}
                  {creatorDashboardTab === 'insights' && 'Audience & Work Insights'}
                  {creatorDashboardTab === 'profile' && 'Studio Profile Settings'}
                </>
              )}
            </h1>
            <p className="text-xs text-brand-muted mt-0.5 font-sans font-medium">
              {activeTab === 'professional-profile' ? 'Review portfolio collections, ratings, response time, and dispatch booking requests.' : (
                <>
                  {creatorDashboardTab === 'dashboard' && 'Manage your active gigs, bookmarked creatives, and daily creator analytics.'}
                  {creatorDashboardTab === 'find' && 'Find local models, photographers, content managers, and cinematographers.'}
                  {creatorDashboardTab === 'requests' && 'Communicate, collaborate, and execute active projects.'}
                  {creatorDashboardTab === 'insights' && 'Visualize custom platform usage indices, conversion performance, and work trends.'}
                  {creatorDashboardTab === 'profile' && 'Maintain and record your active creator identity.'}
                </>
              )}
            </p>
          </div>
        </div>
          
          {/* SECURE FORCE-BLOCK BANNER GIVING MANDATORY REVIEW ALERTS */}
          {reviewBlockStatus && (
            <div className="bg-brand-danger/10 border border-brand-danger/35 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-brand-danger shrink-0 mt-0.5 animate-pulse" />
                <div className="text-left">
                  <h4 className="font-display font-black text-xs uppercase tracking-wide text-brand-danger">Compulsory Peer Review Locked</h4>
                  <p className="text-[11px] text-brand-danger/90 leading-tight">
                    ShootMate community guidelines require completing pending feedback. Under double-blind policies, you must grade <strong>"{reviewBlockStatus.title}"</strong> before booking other creatives.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setCreatorDashboardTab('requests');
                  setActiveRequestFilter('completed');
                }}
                className="bg-brand-danger text-white text-[10px] uppercase tracking-wider font-extrabold h-9 px-4 rounded-lg hover:bg-brand-danger/95 transition cursor-pointer"
              >
                Go rate professional
              </button>
            </div>
          )}

          {activeTab === 'professional-profile' ? (
            <div className="space-y-4 animate-fadeIn">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 border border-brand-border/85 hover:bg-slate-50 px-4.5 py-2 rounded-xl text-xs font-bold text-brand-text transition cursor-pointer mb-2"
              >
                ← Back to Find Professionals
              </button>
              <ProfessionalProfile />
            </div>
          ) : (
            <>
              {/* TAB 1: MAIN METRICS BOARD */}
              {creatorDashboardTab === 'dashboard' && (
                <div className="space-y-8">
              
              {/* Overviews metrics grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Requests Sent</span>
                  <span className="font-display font-black text-2xl text-brand-text">{sentCount}</span>
                </div>
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Accepted Gigs</span>
                  <span className="font-display font-black text-2xl text-brand-secondary">{acceptedCount}</span>
                </div>
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Completed Projects</span>
                  <span className="font-display font-black text-2xl text-brand-success">{completedCount}</span>
                </div>
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Saved Professionals</span>
                  <span className="font-display font-black text-2xl text-brand-accent">{savedCount}</span>
                </div>
              </div>

              {/* Saved Professionals Row Layout */}
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Saved Creative Experts ({savedProDetails.length})</h3>
                {savedProDetails.length === 0 ? (
                  <p className="text-xs text-brand-muted p-6 bg-white border border-brand-border/60 rounded-2xl text-center">
                    You have not bookmarked any creative portfolios yet. Bookmarked experts appear here for easy dispatching.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedProDetails.map(pro => (
                      <div key={pro.id} className="bg-white border p-4 rounded-2xl flex gap-4 items-center justify-between hover:shadow-xs transition">
                        <div className="flex gap-3 items-center">
                          <img src={pro.photoUrl} alt={pro.name} className="w-11 h-11 rounded-xl object-cover shrink-0 border" />
                          <div>
                            <h4 className="font-bold text-xs text-brand-text leading-tight">{pro.name}</h4>
                            <span className="text-[10px] text-brand-muted block">{pro.city}, {pro.country}</span>
                            <span className="text-[10px] text-slate-500 block leading-tight">{pro.phone || '+1 (555) 234-5678'}</span>
                            <span className="text-[10px] text-brand-primary block truncate max-w-[130px] leading-tight" title={pro.email}>{pro.email}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedProfessional(pro);
                            setActiveTab('professional-profile');
                          }}
                          className="bg-brand-primary text-white text-[10px] font-extrabold h-8 px-3 rounded-lg hover:bg-brand-primary/95 cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          Book <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Professionals Seed */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Recommended Local Talents</h3>
                  <button 
                    onClick={() => setCreatorDashboardTab('find')}
                    className="text-xs text-brand-primary hover:underline font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {professionals.slice(0, 2).map((p) => (
                    <div key={p.id} className="bg-white border p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between gap-4">
                        <div className="flex gap-3 items-center">
                          <img src={p.photoUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border" />
                          <div>
                            <h4 className="font-bold text-xs text-brand-text flex items-center gap-1">{p.name} <span className="text-brand-success text-[10px]">●</span></h4>
                            <span className="text-[10px] text-brand-muted block">{p.city}, {p.country}</span>
                            <span className="text-[10px] text-slate-500 block leading-tight">{p.phone || '+1 (555) 234-5678'}</span>
                            <span className="text-[10px] text-brand-primary block truncate max-w-[140px] leading-tight" title={p.email}>{p.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-brand-bg-cream px-2 py-0.5 rounded-lg border text-xs">
                          <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                          <span className="font-bold text-[11px]">{p.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {p.about}
                      </p>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedProfessional(p);
                            setActiveTab('professional-profile');
                          }}
                          className="flex-1 bg-slate-50 hover:bg-slate-100 border py-1.5 rounded-lg text-center text-xs font-bold text-brand-text cursor-pointer"
                        >
                          Evaluate Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIND PROFESSIONALS GRID (COMPACT EMBED) */}
          {creatorDashboardTab === 'find' && (
            <SearchProfessionals />
          )}

          {/* TAB 3: PROPOSALS / WORK ORDERS SYSTEM INLINE WITH MESSENGER */}
          {creatorDashboardTab === 'requests' && (
            <div className="space-y-6">
              
              {/* Requests Sub-filters */}
              <div className="flex flex-wrap bg-white p-1 rounded-xl border max-w-sm gap-1 text-[11px] font-bold">
                {(['All', 'pending', 'accepted', 'rejected', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setActiveRequestFilter(f);
                      setSelectedRequestIdForChat(null);
                    }}
                    className={`flex-1 py-1 px-3.5 rounded-lg cursor-pointer uppercase font-mono ${
                      activeRequestFilter === f 
                        ? 'bg-brand-primary text-white shadow-xs' 
                        : 'text-brand-muted hover:text-brand-text'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {selectedRequestIdForChat ? (
                /* MESSENGER ACTIVE CHAT BOARD */
                <div className="space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                    <button 
                      onClick={() => setSelectedRequestIdForChat(null)}
                      className="text-xs text-brand-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Proposals Grid
                    </button>
                    <span className="text-xs text-brand-muted font-mono uppercase tracking-widest font-extrabold">Active negotiation chat</span>
                  </div>
                  <ChatSystem requestId={selectedRequestIdForChat} />
                </div>
              ) : (
                /* PROPOSALS LIST GRID PANEL */
                <div className="space-y-4">
                  {filterRequests.length === 0 ? (
                    <div className="bg-white border rounded-2xl p-8 text-center text-brand-muted text-xs">
                      No proposals log found matching active filter. Click **Find Professionals** above to issue bookings.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filterRequests.map(req => {
                        return (
                          <div key={req.id} className="bg-white border p-5 rounded-2xl shadow-xs space-y-4 text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/60 pb-3">
                              <div className="flex gap-3 items-center">
                                <img src={req.professionalPhoto} alt={req.professionalName} className="w-10 h-10 rounded-xl object-cover shrink-0 border" />
                                <div>
                                  <span className="text-[10px] text-brand-muted uppercase font-mono block">Creative Hire</span>
                                  <h4 className="font-bold text-xs text-brand-text leading-tight">{req.professionalName}</h4>
                                </div>
                              </div>

                              {/* Proposal Status Badge */}
                              <span className={`text-[9px] uppercase font-mono font-bold py-1 px-3 rounded-full border ${
                                req.status === 'pending' ? 'bg-brand-warning/10 text-brand-warning border-brand-warning/20 animate-pulse'
                                : req.status === 'accepted' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                : req.status === 'completed' ? 'bg-brand-success/15 text-brand-success border-brand-success/30'
                                : 'bg-brand-danger/10 text-brand-danger border-brand-danger/20'
                              }`}>
                                ● {req.status}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <h5 className="font-display font-extrabold text-sm text-brand-text">{req.title}</h5>
                              <p className="text-xs text-brand-muted font-sans leading-relaxed">
                                {req.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-[11px] text-brand-muted">
                                <span>📅 Date Checklist: <strong>{req.date}</strong></span>
                                <span>📍 Destination Base: <strong>{req.city}, {req.country}</strong></span>
                                <span>💰 Project Fee: <strong>${req.budget}</strong></span>
                              </div>
                            </div>

                            {/* Actions toolbar */}
                            <div className="pt-2 border-t border-brand-border/40 flex flex-wrap gap-2 justify-between items-center text-xs">
                              <button 
                                onClick={() => setSelectedRequestIdForChat(req.id)}
                                className="bg-brand-bg-soft hover:bg-brand-bg-warm border py-1.5 px-4 rounded-lg font-bold text-brand-text cursor-pointer flex items-center gap-1"
                              >
                                <MessageSquare className="w-4 h-4 text-brand-primary" /> Open Chat Messenger
                              </button>

                              {/* Special Double-blind Compulsory Review Buttons */}
                              {req.status === 'completed' && !req.creatorReviewed && (
                                <button 
                                  onClick={() => setSelectedRequestForReview(req)}
                                  className="bg-brand-danger hover:bg-brand-danger/95 text-white py-1.5 px-4 rounded-lg font-bold cursor-pointer"
                                >
                                  Rating Required! SubmissionCompulsory
                                </button>
                              )}

                              {req.status === 'completed' && req.creatorReviewed && (
                                <span className="text-[10px] text-brand-success font-mono font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" /> Assessment recorded. Lock checked.
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: METRICS & SYSTEM INSIGHTS */}
          {creatorDashboardTab === 'insights' && (
            <div className="bg-white border rounded-3xl p-6 sm:p-8 space-y-8">
              <div className="border-b pb-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Creative Logistics Insights</h3>
                <p className="text-xs text-brand-muted">Simulated analysis regarding destination hiring frequencies, savings rates and budget allocations.</p>
              </div>

              {/* Row 1: Spending & Requests Sent Graphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Monthly Spending (USD $) Bar Chart */}
                <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-5 space-y-4 text-center">
                  <h4 className="font-bold text-xs uppercase text-brand-text">Monthly Spending (USD $)</h4>
                  <div className="flex h-32 items-end justify-between px-6 pt-4">
                    {/* April */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">$0</span>
                      <div className="w-8 bg-slate-300 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">Apr</span>
                    </div>
                    {/* May */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">$0</span>
                      <div className="w-8 bg-slate-400 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">May</span>
                    </div>
                    {/* June */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-primary">$0</span>
                      <div className="w-8 bg-brand-primary rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-text font-bold">Jun</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Requests Sent & Handled Bar Chart */}
                <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-5 space-y-4 text-center">
                  <h4 className="font-bold text-xs uppercase text-brand-text">Monthly Requests Sent & Handled</h4>
                  <div className="flex h-32 items-end justify-between px-6 pt-4">
                    {/* April */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">0</span>
                      <div className="w-8 bg-slate-300 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">Apr</span>
                    </div>
                    {/* May */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">0</span>
                      <div className="w-8 bg-slate-400 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">May</span>
                    </div>
                    {/* June */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-secondary">0</span>
                      <div className="w-8 bg-brand-secondary rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-text font-bold">Jun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid layout of original charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SVG Hired categories breakdown chart */}
                <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-5 space-y-4 text-center">
                  <h4 className="font-bold text-xs uppercase text-brand-text">Most Hired Profession Types (%)</h4>
                  <div className="flex h-32 items-end justify-center gap-6 pt-4">
                    {/* Photographers */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold text-brand-primary">0%</span>
                      <div className="w-8 bg-brand-primary rounded-t-lg" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted">Photos</span>
                    </div>
                    {/* Videographers */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold text-brand-secondary">0%</span>
                      <div className="w-8 bg-brand-secondary rounded-t-lg" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted">Videos</span>
                    </div>
                    {/* Editors */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold text-brand-accent">0%</span>
                      <div className="w-8 bg-brand-accent rounded-t-lg" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted">Editors</span>
                    </div>
                    {/* Cameraman */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold text-brand-text">0%</span>
                      <div className="w-8 bg-brand-text rounded-t-lg" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted">Cam</span>
                    </div>
                  </div>
                </div>

                {/* City searches volumes card */}
                <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-xs uppercase text-brand-text text-center">Top Searched Destination Hubs</h4>
                  <div className="space-y-3 pt-2">
                    {topDestinationHubs.length === 0 ? (
                      <p className="text-xs text-brand-muted text-center py-4">No professional hubs registered yet.</p>
                    ) : (
                      topDestinationHubs.map((hub, idx) => {
                        const maxSearches = Math.max(...topDestinationHubs.map(h => h.searches), 1);
                        const pct = Math.round((hub.searches / maxSearches) * 100);
                        const barColor = idx === 0 ? 'bg-brand-primary' : idx === 1 ? 'bg-brand-secondary' : 'bg-brand-accent';
                        return (
                          <div key={hub.label} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span>{hub.label}</span>
                              <strong>{hub.searches} searches</strong>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`${barColor} h-full rounded-full`} style={{ width: `${hub.searches > 0 ? pct : 0}%` }}></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* TAB 5: PROFILE EDIT SETTINGS */}
          {creatorDashboardTab === 'profile' && (
            <div className="bg-white border rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b pb-4">
                <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Account & Core Settings</h2>
                <p className="text-xs text-brand-muted">Review, refine, or update your contact details and geographic listings parameters.</p>
              </div>

              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 font-sans max-w-md text-left">
                {/* Profile Header / Photo Upload Display */}
                <div className="flex items-center gap-4 bg-brand-bg-cream/20 border border-brand-border/40 p-4 rounded-2xl mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                    <img 
                      src={editPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=155'} 
                      alt="avatar" 
                      className="w-full h-full object-cover" 
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition cursor-pointer text-[10px] font-bold">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      Upload
                    </label>
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-display font-black text-sm text-brand-text leading-tight">{editName || activeUser.name}</h3>
                    <p className="text-[11px] text-brand-muted mt-0.5">{activeUser.email}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">My Display Name</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-brand-bg-cream/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">City Location</label>
                    <input 
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">Country Location</label>
                    <input 
                      type="text"
                      required
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">My Phone Number</label>
                  <input 
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-brand-bg-cream/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                  />
                </div>

                {profileSuccessMsg && (
                  <div className="bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs p-3 rounded-xl">
                    ✓ {profileSuccessMsg}
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs h-10 px-6 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Save Changes locally
                  </button>
                </div>
              </form>
            </div>
          )}
            </>
          )}
        </div>

      {/* OVERLAY COMPULSORY REVIEW INITIATION SUBMITTER MODAL */}
      {selectedRequestForReview && (
        <ReviewModal 
          request={selectedRequestForReview} 
          onClose={() => setSelectedRequestForReview(null)} 
        />
      )}
    </div>
  );
};
