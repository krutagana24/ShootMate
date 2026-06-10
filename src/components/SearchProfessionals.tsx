import React, { useState, useMemo } from 'react';
import { useApp } from '../context/StateContext';
import { User, Profession } from '../types';
import { MapPin, Search, Star, DollarSign, Languages, Calendar, Award, UserCheck, ShieldCheck, Heart, UserPlus2, RefreshCw, Phone, Mail, ChevronDown } from 'lucide-react';

export const SearchProfessionals: React.FC = () => {
  const { professionals, setSelectedProfessional, setActiveTab, activeUser, toggleSaveProfessional, cameFromLanding, isLoggedIn, setRedirectAfterLogin, countriesList } = useApp();

  // Search filter states
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(800);
  const [minRating, setMinRating] = useState<number>(0);
  const [availability, setAvailability] = useState<string>('All');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [language, setLanguage] = useState('');
  const [gender, setGender] = useState('All');
  const [searchName, setSearchName] = useState('');

  // Dropdown open states
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Trigger search trigger states
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(p => {
      // Role check
      if (p.role !== 'professional') return false;

      // Name filtering
      if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false;

      // Country match
      if (country && !p.country.toLowerCase().includes(country.toLowerCase())) return false;

      // City match
      if (city && !p.city.toLowerCase().includes(city.toLowerCase())) return false;

      // Profession match
      if (profession !== 'All') {
        const hasProf = p.professions?.some(prof => prof.toLowerCase() === profession.toLowerCase());
        if (!hasProf) return false;
      }

      // Budget maximum check
      if (p.pricingRate && p.pricingRate > maxBudget) return false;

      // Rating minimum check
      if (p.rating < minRating) return false;

      // Availability checking
      if (availability !== 'All' && p.availabilityStatus !== availability) return false;

      // Experience minimum checking
      if (p.experience && p.experience < minExperience) return false;

      // Language match check
      if (language) {
        const speakLang = p.languages?.some(l => l.toLowerCase().includes(language.toLowerCase()));
        if (!speakLang) return false;
      }

      return true;
    });
  }, [professionals, country, city, profession, maxBudget, minRating, availability, minExperience, language]);

  // Dynamic set of unique cities from current registered professionals
  const uniqueCities = useMemo(() => {
    const list: string[] = [];
    professionals.forEach(p => {
      if (p.city && p.role === 'professional') {
        const capitalizedCity = p.city.trim().charAt(0).toUpperCase() + p.city.trim().slice(1).toLowerCase();
        if (!list.includes(capitalizedCity)) {
          list.push(capitalizedCity);
        }
      }
    });
    return list.slice(0, 5);
  }, [professionals]);

  // Reset filters
  const resetFilters = () => {
    setCountry('');
    setCity('');
    setProfession('All');
    setMaxBudget(800);
    setMinRating(0);
    setAvailability('All');
    setMinExperience(0);
    setLanguage('');
    setSearchName('');
    setIsCountryOpen(false);
    setIsCityOpen(false);
    setIsProfessionOpen(false);
    setIsRatingOpen(false);
    setIsAvailabilityOpen(false);
    setIsExperienceOpen(false);
  };

  const handleViewProfile = (prof: User) => {
    setSelectedProfessional(prof);
    setActiveTab('professional-profile');
    window.scrollTo(0, 0);
  };

  const savedList = activeUser?.savedProfessionals || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="text-left space-y-3 mb-10 border-b border-brand-border/60 pb-6">
        <h1 className="font-display font-extrabold text-3xl text-brand-text tracking-tight">
          Find Traveling-Ready Experts
        </h1>
        <p className="text-sm text-brand-muted max-w-xl">
          Instantly connect with vetted, high-quality creatives situated in your destination cities. Save packaging, transport, and airfares.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Top Horizontal Filters Bar */}
        <div className="bg-white border border-brand-border/60 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="font-display font-extrabold text-sm text-brand-text uppercase tracking-wide flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-primary" /> Filter Professionals
            </h3>
            <button 
              onClick={resetFilters}
              className="text-xs text-brand-primary hover:text-white hover:bg-brand-primary border border-brand-primary/20 px-3 py-1 rounded-lg transition font-mono font-bold cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${cameFromLanding ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4 text-left`}>
            {/* Country Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Country</label>
              <button
                type="button"
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setIsCityOpen(false);
                  setIsProfessionOpen(false);
                  setIsRatingOpen(false);
                  setIsAvailabilityOpen(false);
                  setIsExperienceOpen(false);
                }}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-left flex items-center justify-between font-sans text-slate-705 font-medium cursor-pointer"
              >
                <span>{country || 'All Countries'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isCountryOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCountryOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => { setIsCountryOpen(false); setCountrySearch(''); }} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-left flex flex-col">
                    <div className="p-2 sticky top-0 bg-white border-b border-slate-100 z-10">
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-primary font-sans font-medium"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-44">
                      <button
                        type="button"
                        onClick={() => {
                          setCountry('');
                          setCity('');
                          setCountrySearch('');
                          setIsCountryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                          !country ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        All Countries
                      </button>
                      {countriesList
                        .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                        .map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setCountry(c.name);
                              setCity('');
                              setCountrySearch('');
                              setIsCountryOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                              country === c.name ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">City / Location</label>
              <button
                type="button"
                onClick={() => {
                  if (country) {
                    setIsCityOpen(!isCityOpen);
                    setIsCountryOpen(false);
                    setIsProfessionOpen(false);
                    setIsRatingOpen(false);
                    setIsAvailabilityOpen(false);
                    setIsExperienceOpen(false);
                  }
                }}
                disabled={!country}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-left flex items-center justify-between font-sans text-slate-705 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{city || (country ? 'All Cities' : 'Select a Country first')}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCityOpen && country && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => { setIsCityOpen(false); setCitySearch(''); }} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-left flex flex-col">
                    <div className="p-2 sticky top-0 bg-white border-b border-slate-100 z-10">
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-primary font-sans font-medium"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-44">
                      <button
                        type="button"
                        onClick={() => {
                          setCity('');
                          setCitySearch('');
                          setIsCityOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                          !city ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        All Cities
                      </button>
                      {(countriesList.find(c => c.name === country)?.cities || [])
                        .filter(ct => ct.toLowerCase().includes(citySearch.toLowerCase()))
                        .map((ct) => (
                          <button
                            key={ct}
                            type="button"
                            onClick={() => {
                              setCity(ct);
                              setCitySearch('');
                              setIsCityOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                              city === ct ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                            }`}
                          >
                            {ct}
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profession Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Profession</label>
              <button
                type="button"
                onClick={() => {
                  setIsProfessionOpen(!isProfessionOpen);
                  setIsCountryOpen(false);
                  setIsCityOpen(false);
                  setIsRatingOpen(false);
                  setIsAvailabilityOpen(false);
                  setIsExperienceOpen(false);
                }}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-left flex items-center justify-between font-sans text-slate-705 font-medium cursor-pointer"
              >
                <span>{profession === 'All' ? 'All Categories' : profession}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isProfessionOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfessionOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsProfessionOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-left">
                    {['All', 'Photographer', 'Videographer', 'Cameraman', 'Video Editor'].map((profOption) => (
                      <button
                        key={profOption}
                        type="button"
                        onClick={() => {
                          setProfession(profOption);
                          setIsProfessionOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                          profession === profOption ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {profOption === 'All' ? 'All Categories' : profOption}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {!cameFromLanding && (
              <>
                {/* Search by Name */}
                <div>
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Search by Name</label>
              <input 
                type="text"
                placeholder="e.g. Leo Vance, Sarah Chen"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-slate-705 font-sans"
              />
            </div>

            {/* Rating Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Min Rating Stars</label>
              <button
                type="button"
                onClick={() => {
                  setIsRatingOpen(!isRatingOpen);
                  setIsCountryOpen(false);
                  setIsCityOpen(false);
                  setIsProfessionOpen(false);
                  setIsAvailabilityOpen(false);
                  setIsExperienceOpen(false);
                }}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-left flex items-center justify-between font-sans text-slate-705 font-medium cursor-pointer"
              >
                <span>{minRating === 0 ? 'Any Rating' : `${minRating}★ and above`}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isRatingOpen ? 'rotate-180' : ''}`} />
              </button>
              {isRatingOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsRatingOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-left">
                    {[
                      { value: 0, label: 'Any Rating' },
                      { value: 4.5, label: '4.5★ and above' },
                      { value: 4.8, label: '4.8★ and above' },
                      { value: 4.9, label: '4.9★ and above' }
                    ].map((ratingOption) => (
                      <button
                        key={ratingOption.value}
                        type="button"
                        onClick={() => {
                          setMinRating(ratingOption.value);
                          setIsRatingOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                          minRating === ratingOption.value ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {ratingOption.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Availability Status Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Availability Status</label>
              <button
                type="button"
                onClick={() => {
                  setIsAvailabilityOpen(!isAvailabilityOpen);
                  setIsCountryOpen(false);
                  setIsCityOpen(false);
                  setIsProfessionOpen(false);
                  setIsRatingOpen(false);
                  setIsExperienceOpen(false);
                }}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-left flex items-center justify-between font-sans text-slate-705 font-medium cursor-pointer"
              >
                <span>{availability === 'All' ? 'Show All' : availability === 'available' ? 'Available Now' : 'Booked (Unavailable)'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isAvailabilityOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAvailabilityOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsAvailabilityOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-left">
                    {[
                      { value: 'All', label: 'Show All' },
                      { value: 'available', label: 'Available Now' },
                      { value: 'booked', label: 'Booked (Unavailable)' }
                    ].map((availOption) => (
                      <button
                        key={availOption.value}
                        type="button"
                        onClick={() => {
                          setAvailability(availOption.value);
                          setIsAvailabilityOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                          availability === availOption.value ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {availOption.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Experience Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Min Experience (Years)</label>
              <button
                type="button"
                onClick={() => {
                  setIsExperienceOpen(!isExperienceOpen);
                  setIsCountryOpen(false);
                  setIsCityOpen(false);
                  setIsProfessionOpen(false);
                  setIsRatingOpen(false);
                  setIsAvailabilityOpen(false);
                }}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2.5 rounded-xl text-xs border border-brand-border/80 focus:border-brand-primary outline-hidden text-left flex items-center justify-between font-sans text-slate-705 font-medium cursor-pointer"
              >
                <span>{minExperience === 0 ? 'Any Experience' : `${minExperience}+ Years`}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isExperienceOpen ? 'rotate-180' : ''}`} />
              </button>
              {isExperienceOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsExperienceOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto py-1 text-left">
                    {[
                      { value: 0, label: 'Any Experience' },
                      { value: 3, label: '3+ Years' },
                      { value: 5, label: '5+ Years' },
                      { value: 8, label: '8+ Years' }
                    ].map((expOption) => (
                      <button
                        key={expOption.value}
                        type="button"
                        onClick={() => {
                          setMinExperience(expOption.value);
                          setIsExperienceOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                          minExperience === expOption.value ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {expOption.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="text-xs font-bold text-brand-text uppercase block mb-1.5 font-mono">Secondary Language</label>
              <input 
                type="text"
                placeholder="e.g. English, French, Japanese"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-brand-bg-cream/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/80 focus:border-brand-primary outline-hidden"
              />
            </div>
            </>
          )}
          </div>
        </div>

        {/* Listings Grid section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-brand-muted font-mono uppercase tracking-widest font-bold">
              Showing {filteredProfessionals.length} local experts
            </span>
            {uniqueCities.length > 0 ? (
              <div className="flex bg-white rounded-lg p-1 border border-brand-border text-xs gap-1.5 shrink-0">
                {uniqueCities.map(c => {
                  const isActive = city.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(isActive ? '' : c)}
                      className={`px-2.5 py-1 text-xs rounded-md transition font-extrabold uppercase tracking-wider cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-brand-muted hover:text-brand-text'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex bg-white rounded-lg p-1.5 border border-brand-border text-xs shrink-0 select-none">
                <span className="px-1.5 text-[10px] uppercase font-bold text-brand-muted tracking-wider">No dynamic locations registered yet</span>
              </div>
            )}
          </div>

          {/* Grid Layout of Professional Cards */}
          {filteredProfessionals.length === 0 ? (
            /* MANDATORY EMPTY STATE */
            <div className="bg-white border border-brand-border/60 rounded-2xl p-1   2 text-center flex flex-col items-center justify-center space-y-6 py-16">
              <div className="w-16 h-16 rounded-full bg-brand-danger/10 text-brand-danger flex items-center justify-center">
                <Search className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-xl text-brand-text">
                  No Professionals Found
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
                  No professionals are currently available in this location matching your parameters. Try another city, broaden filters, or reset selections.
                </p>
              </div>

              <button 
                onClick={resetFilters}
                className="bg-brand-primary hover:bg-brand-primary/95 text-xs text-white font-bold h-10 px-6 rounded-full transition shadow-sm cursor-pointer"
              >
                Search Another Location
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map((prof) => {
                const isSaved = savedList.includes(prof.id);
                return (
                  <div 
                    key={prof.id} 
                    onClick={() => {
                      if (!isLoggedIn) {
                        setRedirectAfterLogin('dashboard-find');
                        setActiveTab('auth');
                      }
                    }}
                    className={`bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between ${!isLoggedIn ? 'cursor-pointer' : ''}`}
                  >
                    {/* Bookmark button badge */}
                    {!cameFromLanding && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLoggedIn) {
                            setRedirectAfterLogin('dashboard-find');
                            setActiveTab('auth');
                          } else {
                            toggleSaveProfessional(prof.id);
                          }
                        }}
                        className="absolute top-4 right-4 bg-brand-bg-cream/40 hover:bg-brand-bg-soft p-1.5 rounded-full text-brand-text hover:text-brand-danger transition border border-brand-border/60 cursor-pointer z-20"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-brand-danger fill-brand-danger' : 'text-brand-muted'}`} />
                      </button>
                    )}

                    {/* Top Column Flex Content */}
                    {cameFromLanding ? (
                      /* Landing/Public Card Layout: Name, Photo, Location, Rating ONLY */
                      <div className="flex items-center justify-between w-full py-2">
                        {/* Left Column: Photo, Name, Location */}
                        <div className="flex flex-col items-center text-center w-[45%] shrink-0">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <img 
                              src={prof.photoUrl} 
                              alt={prof.name} 
                              className="w-20 h-20 rounded-full object-cover border border-slate-100 shadow-sm"
                            />
                            {/* Pink verified circle check badge */}
                            <div className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-[#e12a5e] border-2 border-white rounded-full flex items-center justify-center text-white shadow-xs select-none">
                              <span className="text-[10px] font-bold">✓</span>
                            </div>
                          </div>
                          
                          {/* Name */}
                          <h4 className="font-display font-extrabold text-base text-brand-text mt-3.5 tracking-tight leading-tight">
                            {prof.name}
                          </h4>
                          
                          {/* Location with Pin */}
                          <div className="flex items-center justify-center gap-1 text-[11px] text-brand-muted font-medium mt-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                            <span>{prof.city}, {prof.country}</span>
                          </div>
                        </div>

                        {/* Right Column: Rating only */}
                        <div className="w-[50%] flex flex-col justify-center items-center text-center border-l border-slate-100 pl-6 py-4">
                          <span className="block font-display font-black text-2xl text-slate-800 leading-none flex items-center gap-0.5">
                            {prof.rating.toFixed(2)}<Star className="w-4 h-4 text-brand-warning fill-brand-warning shrink-0" />
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                            Rating
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Original Full Card Layout for Dashboard */
                      <div className="flex gap-6 items-stretch">
                        {/* Left Column: Avatar, Name & Role */}
                        <div className="w-[45%] flex flex-col items-center justify-center text-center">
                          {/* Avatar Container */}
                          <div className="relative shrink-0">
                            <img 
                              src={prof.photoUrl} 
                              alt={prof.name} 
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-slate-100 shadow-xs"
                            />
                            {/* Pink/Rose verified circle badge */}
                            <div className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-[#e12a5e] border-2 border-white rounded-full flex items-center justify-center text-white shadow-xs z-10 select-none">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          
                          {/* Name & Primary Profession */}
                          <h4 className="font-display font-extrabold text-lg text-brand-text mt-3 tracking-tight leading-tight">
                            {prof.name}
                          </h4>
                          <span className="text-[10px] text-brand-muted font-bold font-mono uppercase tracking-wider mt-1.5">
                            {prof.professions?.[0] || 'Visual Expert'}
                          </span>
                        </div>

                        {/* Right Column: Key metrics lists */}
                        <div className="w-[55%] flex flex-col justify-center divide-y divide-slate-100 pl-6 border-l border-slate-100/80">
                          {/* Metric 1: Reviews */}
                          <div className="pb-2 text-left">
                            <span className="block font-display font-black text-xl text-slate-800 leading-none">
                              {prof.projectsCompleted}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">
                              Reviews
                            </span>
                          </div>

                          {/* Metric 2: Rating */}
                          <div className="py-2 text-left">
                            <span className="block font-display font-black text-xl text-slate-800 leading-none flex items-center gap-0.5">
                              {prof.rating.toFixed(2)}<Star className="w-3.5 h-3.5 text-brand-warning fill-brand-warning inline shrink-0" />
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">
                              Rating
                            </span>
                          </div>

                          {/* Metric 3: Experience */}
                          <div className="pt-2 text-left">
                            <span className="block font-display font-black text-xl text-slate-800 leading-none">
                              {prof.experience}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">
                              Years exp
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom row: Availability indicator and Action Buttons */}
                    {!cameFromLanding && (
                      <div className="mt-6 pt-4 border-t border-brand-border/40">
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-1.5 bg-brand-bg-cream/60 px-2.5 py-0.5 rounded-full border border-brand-border/40 text-[9px] font-mono uppercase font-bold text-brand-muted select-none">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              prof.availabilityStatus === 'available' ? 'bg-brand-success' : 'bg-brand-warning'
                            } animate-pulse`}></span>
                            <span>{prof.availabilityStatus === 'available' ? 'Available' : 'Booked'}</span>
                          </div>
                          <span className="text-[10px] font-mono text-brand-accent bg-brand-accent/5 px-2 py-0.5 rounded-md font-bold">
                            Trust Score: {prof.trustScore}%
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => {
                              if (!isLoggedIn) {
                                setRedirectAfterLogin('dashboard-find');
                                setActiveTab('auth');
                              } else {
                                handleViewProfile(prof);
                              }
                            }}
                            className="bg-brand-bg-soft hover:bg-brand-bg-warm text-brand-text text-xs font-bold py-2.5 px-3 rounded-xl border border-brand-border/60 transition cursor-pointer text-center"
                          >
                            View Full Profile
                          </button>
                          <button 
                            onClick={() => {
                              if (!isLoggedIn) {
                                setRedirectAfterLogin('dashboard-find');
                                setActiveTab('auth');
                              } else {
                                setSelectedProfessional(prof);
                                setActiveTab('professional-profile');
                                setTimeout(() => {
                                  const requestBlock = document.getElementById('request-placement-panel');
                                  if (requestBlock) requestBlock.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }
                            }}
                            className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer text-center"
                          >
                            Send Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
