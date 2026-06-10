import React from 'react';
import { useApp } from '../context/StateContext';
import { motion } from 'motion/react';
import { 
  Camera, 
  Video, 
  Film, 
  Scissors, 
  Plane, 
  MapPin, 
  Star, 
  Zap, 
  Handshake, 
  Globe, 
  Search, 
  Users, 
  Clock, 
  BarChart3,
  Share2,
  MessageSquare,
  Play,
  Mail,
  ArrowRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { triggerSearchFlow, setActiveTab, isLoggedIn, setRedirectAfterLogin, setCreatorDashboardTab, setCameFromLanding } = useApp();

  const handleCategoryExplore = (category: string) => {
    if (!isLoggedIn) {
      triggerSearchFlow(true);
    } else {
      setCameFromLanding(false);
      setActiveTab('dashboard');
      setCreatorDashboardTab('find');
    }
  };

  const bentoFeatures = [
    {
      icon: Plane,
      iconBg: 'bg-indigo-50 text-indigo-600',
      title: 'Save Travel Costs',
      desc: 'Hire local talent instead of flying your entire team.'
    },
    {
      icon: MapPin,
      iconBg: 'bg-rose-50 text-rose-600',
      title: 'Discover Nearby',
      desc: 'Find professionals in any city or country within minutes.'
    },
    {
      icon: Star,
      iconBg: 'bg-amber-50 text-amber-600',
      title: 'Verified Ratings',
      desc: 'Browse real ratings, reviews and experience levels.'
    },
    {
      icon: Zap,
      iconBg: 'bg-emerald-50 text-emerald-600',
      title: 'Connect Instantly',
      desc: 'Send a request and start collaborating right away.'
    },
    {
      icon: Handshake,
      iconBg: 'bg-pink-50 text-pink-600',
      title: 'Easy Process',
      desc: 'Simple flow — from discovery to working together.'
    },
    {
      icon: Globe,
      iconBg: 'bg-teal-50 text-teal-600',
      title: 'Global Network',
      desc: '5,000+ professionals across 120+ cities worldwide.'
    }
  ];

  const featuresList = [
    {
      icon: MapPin,
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'Search by Location',
      desc: 'Find professionals by city or country in seconds.'
    },
    {
      icon: Users,
      iconBg: 'bg-purple-50 text-purple-600',
      title: 'Professional Profiles',
      desc: 'View verified experience, ratings and portfolios.'
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-50 text-amber-600',
      title: 'Instant Connections',
      desc: 'Send a collaboration request with one click.'
    },
    {
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
      title: 'Availability Status',
      desc: 'See who is available right now, in real time.'
    },
    {
      icon: BarChart3,
      iconBg: 'bg-pink-50 text-pink-600',
      title: 'Insights Dashboard',
      desc: 'Track your connections weekly, monthly and yearly.'
    }
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Sign Up',
      desc: 'Create your free account in under a minute.'
    },
    {
      num: '02',
      title: 'Search Location',
      desc: "Enter the city or country you're traveling to."
    },
    {
      num: '03',
      title: 'Discover Professionals',
      desc: 'Browse verified creatives near your destination.'
    },
    {
      num: '04',
      title: 'Connect',
      desc: 'Send a request instantly with your shoot details.'
    },
    {
      num: '05',
      title: 'Work Together',
      desc: 'Collaborate and create amazing content locally.'
    }
  ];

  const disciplineCards = [
    {
      icon: Camera,
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'Photographer',
      desc: 'Portraits, travel shoots, commercial photography and more.',
      actionText: 'Explore Photographers'
    },
    {
      icon: Video,
      iconBg: 'bg-purple-50 text-purple-600',
      title: 'Videographer',
      desc: 'Reels, short films, documentaries and brand videos.',
      actionText: 'Explore Videographers'
    },
    {
      icon: Film,
      iconBg: 'bg-emerald-50 text-emerald-600',
      title: 'Cameraman',
      desc: 'Live events, productions and multi-cam setups.',
      actionText: 'Explore Cameramans'
    },
    {
      icon: Scissors,
      iconBg: 'bg-amber-50 text-amber-600',
      title: 'Video Editor',
      desc: 'Edit, color grade and polish your raw footage.',
      actionText: 'Explore Video Editors'
    }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans antialiased overflow-x-hidden min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Soft Ambient Blur Blobs for Visual Depth and Shade */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-indigo-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 border border-blue-100/50 rounded-full text-xs font-semibold text-blue-600">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>Trusted by 10,000+ creators worldwide</span>
            </div>
            
            <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[115%] text-slate-900">
              Find Creative <br />
              Professionals <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Anywhere
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              Discover photographers, videographers, cameramen and editors — locally, wherever you travel. No more expensive team relocation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    triggerSearchFlow(true);
                  } else {
                    setCameFromLanding(false);
                    setActiveTab('dashboard');
                    setCreatorDashboardTab('find');
                  }
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold h-12 px-7 rounded-full shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Find Professionals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setActiveTab('auth')}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold h-12 px-7 rounded-full shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              >
                Join ShootMate
              </button>
            </div>
          </div>

          {/* Hero Right Media Graphics */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            {/* Double Frame Effect with Whitespace Board */}
            <div className="relative rounded-[2.5rem] p-3 bg-white border border-slate-100 shadow-2xl shadow-slate-200/40">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[1.3] lg:aspect-auto lg:h-[420px]">
                <img 
                  src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=1200" 
                  alt="Professional Photographer sitting on a peak holding a camera in mist" 
                  className="w-full h-full object-cover"
                />
                {/* Green Indicator Badge */}
                <div className="absolute top-4 right-4 bg-[#10b981] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>Live Availability</span>
                </div>
                
                {/* Underlay bottom floating widget */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 px-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-[#fef08a] text-[#ca8a04] rounded-xl">
                    <Star className="w-4 h-4 fill-current animate-spin-slow" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-xs text-slate-900">Top Rated Pros</span>
                    <span className="text-[10px] text-slate-500">Verified locally</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHAT IS SHOOTMATE / BENTO CARDS */}
      <section id="about" className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Majestic Pure White Curved Canvas Overlay */}
          <div className="bg-white rounded-[2rem] border border-slate-200/45 shadow-lg shadow-slate-100/40 p-6 sm:p-10 lg:p-12 relative overflow-hidden text-center space-y-8">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold tracking-widest uppercase">
                What is ShootMate?
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Travel Light, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Create Big</span>
              </h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Connect with local creative professionals instantly and cut the cost of traveling with your entire team.
              </p>
            </div>

            {/* Inner Bento Items with Pearl Shade Background */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
              {bentoFeatures.map((b, idx) => {
                const IconComponent = b.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 text-left hover:bg-white hover:border-slate-200/60 hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between h-44"
                  >
                    <div>
                      <div className={`p-2 rounded-lg w-9 h-9 flex items-center justify-center mb-3 ${b.iconBg}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="font-sans font-extrabold text-[#0f172a] text-xs mb-1 leading-snug">
                        {b.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-normal">
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVERYTHING YOU NEED / FEATURES */}
      <section id="features" className="bg-[#fafbfc] border-y border-slate-200/50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-14">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase">
              Features
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-slate-900">
              Everything You <span className="text-blue-600">Need</span>
            </h2>
            <p className="text-base text-slate-600">
              Powerful tools built for modern content creators and creative professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-4">
            {featuresList.map((f, idx) => {
              const IconComponent = f.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-[24px] p-6 text-left border border-slate-200/50 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1"
                >
                  <div>
                    <div className={`p-3 rounded-xl w-11 h-11 flex items-center justify-center mb-5 ${f.iconBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="font-sans font-extrabold text-[#0f172a] text-sm mb-2">
                      {f.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS / PROCESS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative grid background for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-75 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase">
              Process
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-slate-900">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-base text-slate-600">
              Go from zero to collaborating with local talent in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 pt-4">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-4 relative group">
                <div className="w-16 h-16 rounded-[22px] bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center text-white font-mono font-black text-xl transition-all duration-200 hover:scale-105">
                  {step.num}
                </div>
                <div className="text-center space-y-1.5">
                  <h4 className="font-sans font-extrabold text-[#0f172a] text-base tracking-tight pt-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed px-2 font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DISCIPLINES / CREATIVE MATCH */}
      <section id="professionals" className="bg-gradient-to-b from-white via-[#f1f5f9]/30 to-white border-t border-slate-200/40 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-14">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase">
              Professionals
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-slate-900">
              Find Your <span className="text-blue-600">Creative Match</span>
            </h2>
            <p className="text-base text-slate-600">
              Browse professionals across four key creative disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {disciplineCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-[24px] p-6 border border-slate-200/50 text-left hover:shadow-xl hover:border-slate-200/85 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl w-11 h-11 flex items-center justify-center ${card.iconBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-black text-slate-900 text-base">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCategoryExplore(card.title)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-blue-600 hover:text-blue-700 text-xs font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-100"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION / READY TO CREATE BANNER */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white via-blue-50/50 to-blue-100/30 border border-blue-100/60 rounded-[2.5rem] p-8 sm:p-16 lg:p-20 text-center space-y-6 relative overflow-hidden shadow-xl shadow-blue-50/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900">
            Ready to Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Creating?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Join thousands of creators and professionals already using ShootMate.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 relative z-10">
            <button 
              onClick={() => {
                setActiveTab('auth');
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold h-12 px-8 rounded-full shadow-lg shadow-blue-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <span>I'm a Creator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                setActiveTab('auth');
              }}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 font-bold h-12 px-8 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5"
            >
              I'm a Professional
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
