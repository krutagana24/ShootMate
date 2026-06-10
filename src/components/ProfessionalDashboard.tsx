import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { CollabRequest, User } from '../types';
import { ChatSystem } from './ChatSystem';
import { ReviewModal } from './ReviewModal';
import { 
  Check, 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  User as UserIcon, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  CheckCircle,
  Eye,
  AlertCircle,
  Calendar,
  Layers,
  Activity,
  Plus,
  Compass,
  Briefcase,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ProfessionalDashboard: React.FC = () => {
  const { 
    activeUser, 
    requests, 
    updateRequestStatus, 
    professionalDashboardTab, 
    setProfessionalDashboardTab,
    profiles, 
    updateActiveUser,
    reviews,
    isReviewPendingBlock,
    setActiveTab,
    logoutUser
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRequestFilter, setActiveRequestFilter] = useState<'All' | 'pending' | 'accepted' | 'completed'>('All');
  const [selectedRequestIdForChat, setSelectedRequestIdForChat] = useState<string | null>(null);
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<CollabRequest | null>(null);

  // Edit states for Pro Profile tab
  const [editName, setEditName] = useState(activeUser.name || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(activeUser.photoUrl || '');
  const [editRate, setEditRate] = useState(activeUser.pricingRate || 350);
  const [editAbout, setEditAbout] = useState(activeUser.about || '');
  const [editCity, setEditCity] = useState(activeUser.city);
  const [editCountry, setEditCountry] = useState(activeUser.country);
  const [editLanguages, setEditLanguages] = useState(activeUser.languages?.join(', ') || 'English');
  const [editAvailability, setEditAvailability] = useState<'available' | 'booked' | 'unavailable'>(activeUser.availabilityStatus || 'available');
  
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Pro specific requests
  const proRequests = requests.filter(r => r.professionalId === activeUser.id);
  const filterRequests = proRequests.filter(r => activeRequestFilter === 'All' || r.status === activeRequestFilter);

  // Metrics counts
  const incomingCount = proRequests.filter(r => r.status === 'pending').length;
  const acceptedCount = proRequests.filter(r => r.status === 'accepted').length;
  const completedCount = proRequests.filter(r => r.status === 'completed').length;
  const ratingLockBlock = isReviewPendingBlock(activeUser.id);

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

  const handleUpdateProProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateActiveUser({
      name: editName,
      photoUrl: editPhotoUrl,
      pricingRate: Number(editRate),
      about: editAbout,
      city: editCity,
      country: editCountry,
      languages: editLanguages.split(',').map(s => s.trim()),
      availabilityStatus: editAvailability
    });
    setProfileSuccessMsg('Professional catalog settings recorded!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: Briefcase },
    { id: 'requests', label: 'Incoming Job Offers', icon: MessageSquare, badge: incomingCount },
    { id: 'insights', label: 'Insights & Earnings', icon: BarChart3 },
    { id: 'profile', label: 'Catalog Settings', icon: Settings }
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
                  <img src={activeUser.photoUrl} alt="Professional avatar" className="w-10 h-10 rounded-xl object-cover border shrink-0" />
                  <div className="truncate text-left">
                    <span className="text-[10px] bg-brand-secondary/15 text-brand-secondary font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider block max-w-max mb-0.5">Vetted Creative Pro</span>
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
                  const isSelected = professionalDashboardTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setProfessionalDashboardTab(item.id as any);
                        setSelectedRequestIdForChat(null);
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
            <span className="text-[9px] font-mono font-bold text-brand-secondary uppercase tracking-wider block mb-1">
              Vetted Professional workspace
            </span>
            <h1 className="font-display font-black text-2xl lg:text-3xl text-brand-text leading-tight">
              {professionalDashboardTab === 'dashboard' && 'Overview Studio'}
              {professionalDashboardTab === 'requests' && 'Incoming Job Offers'}
              {professionalDashboardTab === 'insights' && 'Audience Insights & Earnings'}
              {professionalDashboardTab === 'profile' && 'Studio Catalog Settings'}
            </h1>
            <p className="text-xs text-brand-muted mt-0.5 font-sans font-medium">
              {professionalDashboardTab === 'dashboard' && 'Manage your incoming proposals, active client chats, and review platform ratings.'}
              {professionalDashboardTab === 'requests' && 'Collaborate, accept assignments, and finish ongoing projects.'}
              {professionalDashboardTab === 'insights' && 'Review your profile impressions, conversion ratios, and projected local job pools.'}
              {professionalDashboardTab === 'profile' && 'Publish customized availability, price quote triggers, and catalog tags.'}
            </p>
          </div>
        </div>
          
          {/* SECURE FORCE-BLOCK DOUBLE-BLIND RATING PENDING MESSAGE */}
          {ratingLockBlock && (
            <div className="bg-brand-warning/10 border border-brand-warning/35 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-brand-warning shrink-0 mt-0.5 animate-pulse" />
                <div className="text-left select-none">
                  <h4 className="font-display font-black text-xs uppercase tracking-wide text-brand-warning">Double-blind rating lockdown active</h4>
                  <p className="text-[11px] text-brand-muted leading-tight">
                    You have finished project <strong>"{ratingLockBlock.title}"</strong> with traveling creator Alex Thorne. ShootMate rules require leaving your peer review before accepting or handling subsequent work proposals.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setProfessionalDashboardTab('requests');
                  setActiveRequestFilter('completed');
                }}
                className="bg-brand-secondary text-white text-[10px] uppercase tracking-wider font-extrabold h-9 px-4 rounded-lg hover:bg-brand-secondary/95 transition cursor-pointer"
              >
                Go rate creator
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW METRICS BOARD */}
          {professionalDashboardTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Core numbers grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Incoming Job Proposals</span>
                  <span className="font-display font-black text-2xl text-brand-text">{incomingCount}</span>
                </div>
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-text uppercase font-mono">Accepted Gigs</span>
                  <span className="font-display font-black text-2xl text-brand-primary">{acceptedCount}</span>
                </div>
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Finished Shoots</span>
                  <span className="font-display font-black text-2xl text-brand-success">{completedCount}</span>
                </div>
                <div className="bg-white border p-5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-brand-muted uppercase font-mono">Mock Profile Views</span>
                  <span className="font-display font-black text-2xl text-brand-accent">1,240</span>
                </div>
              </div>

              {/* Outstanding Proposals Stream queue */}
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Active Client Negotiations</h3>
                {proRequests.filter(r => r.status === 'pending' || r.status === 'accepted').length === 0 ? (
                  <p className="text-xs text-brand-muted p-6 bg-white border border-brand-border/60 rounded-2xl text-center">
                    No active bookings at the moment. Update your catalog tags to increase search appearances!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {proRequests.filter(r => r.status === 'pending' || r.status === 'accepted').slice(0, 2).map((req) => (
                      <div key={req.id} className="bg-white border p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition">
                        <div className="space-y-2 text-left">
                          <span className={`text-[9px] uppercase font-mono font-bold py-0.5 px-2.5 rounded-full border ${
                            req.status === 'pending' ? 'bg-brand-warning/10 text-brand-warning border-brand-warning/10 animate-pulse' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/10'
                          }`}>
                            ● {req.status}
                          </span>
                          <h4 className="font-display font-extrabold text-sm text-brand-text">{req.title}</h4>
                          <p className="text-xs text-brand-muted line-clamp-1 leading-relaxed">Creator: <strong>{req.creatorName}</strong> • Date: {req.date}</p>
                        </div>
                        
                        <div className="flex gap-2 self-start sm:self-center shrink-0">
                          <button 
                            onClick={() => {
                              setProfessionalDashboardTab('requests');
                              setSelectedRequestIdForChat(req.id);
                            }}
                            className="bg-brand-bg-cream text-brand-text hover:bg-brand-bg-soft text-[10px] uppercase font-mono font-bold h-8 px-4 rounded-lg transition"
                          >
                            Open Messenger
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Performance Scores Index */}
              <div className="bg-white border p-6 rounded-3xl space-y-4 text-left">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Local Expert Quality Indicators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-brand-muted uppercase block font-mono">Completion Rate</span>
                    <strong className="text-xl text-brand-success block font-mono">98%</strong>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-success h-full rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-brand-muted uppercase block font-mono">Response Duration</span>
                    <strong className="text-xl text-brand-text block font-sans">Under 30 minutes</strong>
                    <span className="text-[10px] text-brand-muted">Top 10% response category locally</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-brand-muted uppercase block font-mono">Repeat Clients Rate</span>
                    <strong className="text-xl text-brand-primary block font-mono">25%</strong>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-primary h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURE WORK ORDERS OFFER PIPELINE */}
          {professionalDashboardTab === 'requests' && (
            <div className="space-y-6">
              
              {/* Proposals System sub-filters */}
              <div className="flex bg-white p-1 rounded-xl border max-w-xs gap-1 text-[11px] font-bold font-mono">
                {(['All', 'pending', 'accepted', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setActiveRequestFilter(f);
                      setSelectedRequestIdForChat(null);
                    }}
                    className={`flex-1 py-1 px-3.5 rounded-lg cursor-pointer uppercase ${
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
                /* MESSENGER ACTIVE DIALOGUE INJECT */
                <div className="space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                    <button 
                      onClick={() => setSelectedRequestIdForChat(null)}
                      className="text-xs text-brand-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Job Offers
                    </button>
                    <span className="text-xs text-brand-muted font-mono uppercase tracking-widest font-extrabold">Creative production lines</span>
                  </div>
                  <ChatSystem requestId={selectedRequestIdForChat} />
                </div>
              ) : (
                /* OFFERS GRID LIST */
                <div className="space-y-4">
                  {filterRequests.length === 0 ? (
                    <div className="bg-white border rounded-2xl p-8 text-center text-brand-muted text-xs">
                      No incoming offers logged matching selecting category. Traveling creators search parameters appear.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filterRequests.map(req => {
                        return (
                          <div key={req.id} className="bg-white border p-5 rounded-2xl shadow-xs space-y-4 text-left relative">
                            
                            <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
                              <div className="flex gap-2.5 items-center">
                                <img src={req.creatorPhoto} alt={req.creatorName} className="w-10 h-10 rounded-xl object-cover shrink-0 border" />
                                <div>
                                  <span className="text-[10px] text-brand-muted uppercase font-mono block">Proposed by client</span>
                                  <h4 className="font-bold text-xs text-brand-text leading-tight">{req.creatorName}</h4>
                                </div>
                              </div>

                              <span className={`text-[9px] uppercase font-mono font-bold py-1 px-3 rounded-full border ${
                                req.status === 'pending' ? 'bg-brand-warning/10 text-brand-warning border-brand-warning/10'
                                : req.status === 'accepted' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/10'
                                : 'bg-brand-success/15 text-brand-success border-brand-success/20'
                              }`}>
                                {req.status}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <h5 className="font-display font-extrabold text-sm text-brand-text">{req.title}</h5>
                              <p className="text-xs text-brand-muted font-sans leading-relaxed">
                                {req.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-[11px] text-brand-muted font-medium">
                                <span>📅 Date Checklist: <strong>{req.date}</strong></span>
                                <span>📍 Location Coordinate: <strong>{req.city}, {req.country}</strong></span>
                                <span>💰 Payout Target: <strong>${req.budget}</strong></span>
                              </div>
                            </div>

                            {/* Job actions panels triggers */}
                            <div className="pt-2 border-t border-brand-border/40 flex flex-wrap gap-2 justify-between items-center text-xs">
                              <button 
                                onClick={() => setSelectedRequestIdForChat(req.id)}
                                className="bg-brand-bg-soft hover:bg-brand-bg-warm border py-1.5 px-4 rounded-lg font-bold text-brand-text cursor-pointer flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-4 h-4 text-brand-primary shrink-0" /> Open Discussion logs
                              </button>

                              <div className="flex gap-2 shrink-0">
                                {/* PENDING TRIGGERS */}
                                {req.status === 'pending' && (
                                  <>
                                    <button 
                                      disabled={!!ratingLockBlock}
                                      onClick={() => updateRequestStatus(req.id, 'accepted')}
                                      className="bg-brand-primary text-white hover:bg-brand-primary/95 py-1.5 px-4 rounded-lg font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Accept Proposal
                                    </button>
                                    <button 
                                      onClick={() => updateRequestStatus(req.id, 'rejected')}
                                      className="bg-slate-100 hover:bg-slate-200 text-brand-muted font-semibold py-1.5 px-3 rounded-lg cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}

                                {/* ACCEPTED GIG CONTROLS */}
                                {req.status === 'accepted' && (
                                  <button 
                                    onClick={() => updateRequestStatus(req.id, 'completed')}
                                    className="bg-brand-success text-white hover:bg-brand-secondary/95 py-1.5 px-4 rounded-lg font-bold transition cursor-pointer"
                                  >
                                    Finish & Mark Completed
                                  </button>
                                )}

                                {/* WORK DELIVERED - DOUBLE BLIND COMPULSORY RATING BLOCK GIGS */}
                                {req.status === 'completed' && !req.professionalReviewed && (
                                  <button 
                                    onClick={() => setSelectedRequestForReview(req)}
                                    className="bg-brand-danger hover:bg-brand-danger/95 text-white py-1.5 px-4 rounded-lg font-bold cursor-pointer animate-pulse"
                                  >
                                    Evaluate Creator Compulsory
                                  </button>
                                )}

                                {req.status === 'completed' && req.professionalReviewed && (
                                  <span className="text-[10px] text-brand-success font-semibold font-mono flex items-center gap-1">
                                    ✓ Evaluation recorded. Active catalogs checked.
                                  </span>
                                )}
                              </div>
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

          {/* TAB 3: INSIGHTS & EARNINGS METRICS CARDS */}
          {professionalDashboardTab === 'insights' && (
            <div className="bg-white border rounded-3xl p-6 sm:p-8 space-y-8">
              <div className="border-b pb-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Studio Logistics Analytics</h3>
                <p className="text-xs text-brand-muted">Understand your catalog impression values, acceptance ratios, and monthly payouts.</p>
              </div>

              {/* Grid Layout stats cards list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SVG Payout Trends progress bar */}
                <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-xs uppercase text-brand-text text-center">Simulated Monthly Income (USD $)</h4>
                  <div className="flex h-32 items-end justify-between px-3 pt-4">
                    {/* Month 1 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">$0</span>
                      <div className="w-6 bg-slate-300 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">Apr</span>
                    </div>
                    {/* Month 2 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">$0</span>
                      <div className="w-6 bg-slate-400 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">May</span>
                    </div>
                    {/* Month 3 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-primary">$0</span>
                      <div className="w-6 bg-brand-primary rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-text font-bold">Jun</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Requests Handled Bar Chart */}
                <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-5 space-y-4 text-center">
                  <h4 className="font-bold text-xs uppercase text-brand-text">Monthly Requests Handled</h4>
                  <div className="flex h-32 items-end justify-between px-6 pt-4">
                    {/* April */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">0</span>
                      <div className="w-6 bg-slate-300 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">Apr</span>
                    </div>
                    {/* May */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-text">0</span>
                      <div className="w-6 bg-slate-400 rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-muted font-bold">May</span>
                    </div>
                    {/* June */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-brand-secondary">0</span>
                      <div className="w-6 bg-brand-secondary rounded-t-sm" style={{ height: '0px' }}></div>
                      <span className="text-[9px] font-mono text-brand-text font-bold">Jun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Funnel Benchmarks Card */}
              <div className="bg-brand-bg-cream/40 border border-brand-border/40 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-xs text-brand-text uppercase block font-mono text-left">Conversion funnel benchmarks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-brand-muted">
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between">
                      <span>Profile search appearances</span>
                      <strong>0 counts</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-text h-full rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between">
                      <span>Job booking conversion rate</span>
                      <strong>0%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-secondary h-full rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between">
                      <span>Proposal acceptance ratio</span>
                      <strong>0%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-success h-full rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips content metrics card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-primary text-white space-y-3 text-left">
                <span className="text-[9px] font-bold font-mono bg-white/20 px-2 py-0.5 rounded uppercase">Optimization Tip</span>
                <h4 className="font-display font-extrabold text-sm block font-sans">How to boost {activeUser.city || 'local'} booking rates</h4>
                <p className="text-xs text-brand-bg-cream/80 leading-relaxed font-sans">
                  The vacation season in {activeUser.city || 'your city'} starts next week! Creators traveling to {activeUser.city || 'your area'} regularly seek Photographers and Videographers with fast 24-hour video edits presets. Update your skills list to reflect "Color Grading" and "Social Reels" to secure 2.5x more booking leads.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PROF CATALOG SETTINGS (PROFILE EDIT) */}
          {professionalDashboardTab === 'profile' && (
            <div className="bg-white border rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b pb-4">
                <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text">Creative Catalog settings</h2>
                <p className="text-xs text-brand-muted">Modify geo parameters, day rates, and spoken languages to match traveling matching queries.</p>
              </div>

              <form onSubmit={handleUpdateProProfile} className="space-y-4 max-w-lg text-left">
                 {/* Profile Header Display */}
                <div className="flex items-center gap-4 bg-brand-bg-cream/20 border border-brand-border/40 p-4 rounded-2xl mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                    <img 
                      src={editPhotoUrl || activeUser.photoUrl} 
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
                    <p className="text-xs text-brand-muted mt-0.5">{activeUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">My Display Name</label>
                    <input 
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">Profile Photo URL</label>
                    <input 
                      type="text"
                      required
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                {/* Availability status toggle banner */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">My Global availability status</label>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <button 
                      type="button" 
                      onClick={() => setEditAvailability('available')}
                      className={`py-2 border rounded-xl cursor-pointer transition ${
                        editAvailability === 'available' ? 'bg-brand-success text-white border-brand-success' : 'bg-slate-50 text-brand-muted hover:bg-slate-100'
                      }`}
                    >
                      ✓ Available now
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditAvailability('booked')}
                      className={`py-2 border rounded-xl cursor-pointer transition ${
                        editAvailability === 'booked' ? 'bg-brand-warning text-white border-brand-warning' : 'bg-slate-50 text-brand-muted hover:bg-slate-100'
                      }`}
                    >
                      ● Booked
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditAvailability('unavailable')}
                      className={`py-2 border rounded-xl cursor-pointer transition ${
                        editAvailability === 'unavailable' ? 'bg-brand-danger text-white border-brand-danger' : 'bg-slate-50 text-brand-muted hover:bg-slate-100'
                      }`}
                    >
                      ✗ Offline
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">Daily Pricing rate ($)</label>
                    <input 
                      type="number"
                      required
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      className="w-full bg-brand-bg-cream/40 px-3 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden font-bold font-mono text-brand-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">Spoken languages spoken</label>
                    <input 
                      type="text"
                      required
                      value={editLanguages}
                      onChange={(e) => setEditLanguages(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">My City Headquarters</label>
                    <input 
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">My Country</label>
                    <input 
                      type="text"
                      required
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full bg-brand-bg-cream/40 px-3 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">Detailed catalog description bio *</label>
                  <textarea 
                    rows={4}
                    required
                    value={editAbout}
                    onChange={(e) => setEditAbout(e.target.value)}
                    className="w-full bg-brand-bg-cream/40 p-3 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden font-sans resize-none"
                  />
                </div>

                {profileSuccessMsg && (
                  <div className="bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs p-3.5 rounded-xl">
                    ✓ {profileSuccessMsg}
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="bg-brand-secondary hover:bg-brand-secondary/95 text-white font-extrabold text-xs h-10 px-6 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Commit settings locally
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      {/* COMPULSORY REVIEW DIALOGUE PURE OVERLAY */}
      {selectedRequestForReview && (
        <ReviewModal 
          request={selectedRequestForReview} 
          onClose={() => setSelectedRequestForReview(null)} 
        />
      )}
    </div>
  );
};
