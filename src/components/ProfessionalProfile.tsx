import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { User, PortfolioItem, CollabRequest } from '../types';
import { SEEDED_PORTFOLIOS } from '../data/mockData';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Languages, 
  Award, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  ShieldAlert, 
  AlertCircle, 
  Play, 
  Image as ImageIcon,
  UserCheck2,
  X,
  Sparkles,
  Mail,
  Phone
} from 'lucide-react';

export const ProfessionalProfile: React.FC = () => {
  const { 
    selectedProfessional, 
    activeUser, 
    sendRequest, 
    toggleSaveProfessional, 
    reviews, 
    requests,
    setActiveTab, 
    setCreatorDashboardTab,
    isReviewPendingBlock 
  } = useApp();

  if (!selectedProfessional) {
    return (
      <div className="py-20 text-center text-brand-muted text-sm">
        No professional selected. Please search and select an expert profile.
      </div>
    );
  }

  const prof = selectedProfessional;

  // Form states for booking
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState(prof.country);
  const [city, setCity] = useState(prof.city);
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState(String(prof.pricingRate));
  const [requirements, setRequirements] = useState('');
  
  // UX UI feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<PortfolioItem | null>(null);

  // Filter reviews matching this professional
  const filteredReviews = reviews.filter(
    rev => rev.revieweeId === prof.id && rev.type === 'creator-to-professional'
  );

  // Retrieve portfolio items or fall back to seeded assets and filter out auto-generated "Sample click"
  const portfolioItems = (prof.portfolioItems || SEEDED_PORTFOLIOS[prof.id] || []).filter(
    item => item.title !== 'Sample click'
  );

  const handleShare = () => {
    setCopiedLink(true);
    // Mimic clipboard writing safe for iframes
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!activeUser || activeUser.role !== 'creator') {
      setErrorMsg('Unauthorized: You must switch accounts to Creator role in the top header to send booking proposals.');
      return;
    }

    if (!title || !description || !date || !budget) {
      setErrorMsg('Please populate all compulsory fields (*).');
      return;
    }

    // Call submit request handler
    const response = sendRequest({
      professionalId: prof.id,
      professionalName: prof.name,
      professionalPhoto: prof.photoUrl,
      title,
      description,
      country,
      city,
      date,
      budget: Number(budget),
      requirements
    });

    if (response && !response.success) {
      setErrorMsg(response.error || 'Failed to submit proposal.');
    } else {
      setSuccessMsg('✅ Proposal dispatched successfully! Head to your Dashboard Requests tab to overview updates and chat with Leo Vance.');
      // Reset form fields
      setTitle('');
      setDescription('');
      setDate('');
      setRequirements('');
    }
  };

  const savedList = activeUser?.savedProfessionals || [];
  const isSaved = savedList.includes(prof.id);

  // Review pending block status check
  const reviewLockRequest = isReviewPendingBlock(activeUser?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. TOP PREMIUM COMPACT HERO CONTAINER */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-brand-border/20 rounded-3xl p-6 sm:p-8 text-left text-white shadow-lg mb-8 relative">
        {/* Availability indicator badge */}
        <div className={`absolute top-4 right-4 text-[9px] uppercase font-mono tracking-wider font-extrabold px-3 py-1 rounded-full border shadow-md backdrop-blur-md ${
          prof.availabilityStatus === 'available' 
            ? 'bg-brand-success/20 border-brand-success/30 text-white' 
            : 'bg-brand-warning/20 border-brand-warning/30 text-white'
        }`}>
          ● {prof.availabilityStatus === 'available' ? 'Available' : 'Booked'}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Left Side: Avatar/Photo */}
          <div className="relative shrink-0">
            <img 
              src={prof.photoUrl} 
              alt={prof.name} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-white/20 shadow-md"
            />
          </div>

          {/* Right Side: Primary Info */}
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-mono font-extrabold bg-brand-accent/10 px-2.5 py-0.5 rounded">
                {prof.professions?.join(' • ') || 'Creative Visual Partner'}
              </span>
              {prof.badges?.map((badge, idx) => (
                <span key={idx} className="bg-white/10 text-[9px] uppercase tracking-wider text-slate-200 font-mono font-bold px-2 py-0.5 rounded">
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight truncate">
              {prof.name}
            </h1>

            {/* Quick Metadata Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-accent" /> {prof.city}, {prof.country}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 font-mono"><Mail className="w-3.5 h-3.5 text-brand-accent" /> {prof.email}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 font-mono"><Phone className="w-3.5 h-3.5 text-brand-accent" /> {prof.phone || '+1 (555) 234-5678'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-brand-warning fill-brand-warning" />
                <strong className="text-white">{prof.rating.toFixed(2)}</strong> Rating
              </span>
              <span className="text-slate-500">•</span>
              <span><strong>{prof.experience}</strong> Years Exp</span>
              <span className="text-slate-500">•</span>
              <span><strong>{prof.projectsCompleted}</strong> Shoots</span>
              <span className="text-slate-500">•</span>
              <span>Trust Score: <strong>{prof.trustScore}%</strong></span>
              <span className="text-slate-500">•</span>
              <span>Languages: {prof.languages?.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Bottom row: Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 mt-6">
          <p className="text-xs text-slate-400 font-sans italic max-w-md line-clamp-1">
            {prof.about}
          </p>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleShare}
              className="h-9 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-300" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button 
              onClick={() => toggleSaveProfessional(prof.id)}
              className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center transition cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'text-brand-danger fill-brand-danger' : 'text-slate-300'}`} />
            </button>
            <a 
              href="#booking-proposal"
              className="h-9 px-4 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition scroll-smooth cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Book / Hire</span>
            </a>
          </div>
        </div>
      </div>


      {/* Container 2: Booking widget / block */}
      <div id="booking-proposal" className="mt-8">
        {reviewLockRequest ? (
          <div className="bg-brand-danger/10 border border-brand-danger/35 rounded-3xl p-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-brand-danger">
              <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce" />
              <h4 className="font-display font-extrabold text-sm tracking-wide uppercase">Reviews Blockade Mode</h4>
            </div>
            <p className="text-xs text-brand-danger/90 leading-relaxed font-sans">
              ⚠️ Double-blind lock activated! You cannot hire creatives or dispatch proposals until you have completed your assessment review feedback for project <strong>"{reviewLockRequest.title}"</strong>.
            </p>
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setCreatorDashboardTab('requests');
              }}
              className="w-full bg-brand-danger hover:bg-brand-danger/95 text-white text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer text-center"
            >
              Go Submit Review Pending
            </button>
          </div>
        ) : (
          <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-sm">
            <div className="border-b border-brand-border pb-3 flex justify-between items-center">
              <h3 id="request-placement-panel" className="font-display font-extrabold text-sm text-brand-text uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary" /> Book Local Expert
              </h3>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-mono font-bold px-2 py-0.5 rounded">Escrow Secured</span>
            </div>

            {activeUser?.role !== 'creator' && (
              <div className="bg-brand-warning/10 border border-brand-warning/30 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-brand-warning">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold underline block">Simulated Mode alert:</span>
                  <span>To schedule, switch active account to <strong className="uppercase">Creator</strong> via account switcher.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSendProposal} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Title */}
              <div className="col-span-12 md:col-span-4 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase tracking-wide block font-mono">Project Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Louvre Autumn Editorial"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                />
              </div>

              {/* Shoot Date */}
              <div className="col-span-12 md:col-span-4 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase tracking-wide block font-mono">Shoot Date *</label>
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden font-mono"
                />
              </div>

              {/* Budget ($) */}
              <div className="col-span-12 md:col-span-4 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase tracking-wide block font-mono">Budget ($) *</label>
                <input 
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden font-mono"
                />
              </div>

              {/* Description */}
              <div className="col-span-12 md:col-span-6 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase tracking-wide block font-mono">Project Description *</label>
                <input 
                  type="text"
                  required
                  placeholder="Timeline goals, scenery choices, camera outputs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                />
              </div>

              {/* Specific Gear / Deliverables */}
              <div className="col-span-12 md:col-span-6 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase tracking-wide block font-mono">Specific Gear / Deliverables</label>
                <input 
                  type="text"
                  placeholder="e.g. Sony a7R V, Drone footage, 24 hr edit"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                />
              </div>

              {/* City Destination */}
              <div className="col-span-12 md:col-span-4 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">City Destination</label>
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                />
              </div>

              {/* Country */}
              <div className="col-span-12 md:col-span-4 space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-brand-text uppercase block font-mono">Country</label>
                <input 
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-brand-bg-cream/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
                />
              </div>

              {/* Submit button */}
              <div className="col-span-12 md:col-span-4 text-left">
                <button 
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/95 text-xs text-white font-bold h-10 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 shrink-0" /> Dispatch Collab Proposal
                </button>
              </div>

              {/* Logging handlers feedback messages alerts */}
              {(errorMsg || successMsg) && (
                <div className="col-span-12 text-left pt-2">
                  {errorMsg && (
                    <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs p-3 rounded-2xl flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  {successMsg && (
                    <div className="bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs p-3.5 rounded-2xl">
                      {successMsg}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Visual media preview Lightbox overlay modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
          <button 
            onClick={() => setActiveMediaModal(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="max-w-3xl w-full flex flex-col items-center">
            {activeMediaModal.type === 'video' ? (
              <video 
                src={activeMediaModal.url} 
                controls 
                autoPlay 
                className="w-full max-h-[80vh] object-contain rounded-2xl border border-white/10"
              />
            ) : (
              <img 
                src={activeMediaModal.url} 
                className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10"
                alt={activeMediaModal.title}
              />
            )}
            <div className="text-center mt-4">
              <span className="text-brand-accent text-xs uppercase font-bold tracking-widest block font-mono">
                {activeMediaModal.category || 'Portfolio Shoots'}
              </span>
              <h4 className="font-display font-extrabold text-base text-white">{activeMediaModal.title}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
