import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { User, Role, Profession, CountryConfig } from '../types';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Smartphone, 
  MapPin, 
  Briefcase, 
  FileText,
  Camera, 
  Video, 
  Film, 
  Scissors,
  Check
} from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { 
    updateActiveUser, 
    switchUserRole, 
    setCreatorDashboardTab, 
    setProfessionalDashboardTab, 
    setActiveTab,
    loginUser,
    signUpUser,
    registeredUsers,
    redirectAfterLogin,
    setRedirectAfterLogin,
    countriesList
  } = useApp();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setSuccess('');
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || 'Google Authentication failed.');
          return;
        }

        const { email: googleEmail, name: googleName, photoUrl, exists, user: dbUser } = data;

        // 1. Check if backend database exists and user is returned
        if (exists && dbUser) {
          signUpUser(dbUser);
          setSuccess(`Welcome back, ${dbUser.name}! Successfully signed in via Google.`);
          setTimeout(() => {
            if (redirectAfterLogin === 'dashboard-find') {
              setActiveTab('dashboard');
              setCreatorDashboardTab('find');
              setRedirectAfterLogin(null);
            } else {
              setActiveTab('dashboard');
            }
          }, 1000);
          return;
        }

        // 2. Check if the user already has a local fallback account registered
        const existingUser = registeredUsers.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());
        
        if (existingUser) {
          // Log them in directly!
          loginUser(googleEmail);
          setSuccess(`Welcome back, ${existingUser.name}! Successfully signed in via Google.`);
          setTimeout(() => {
            if (redirectAfterLogin === 'dashboard-find') {
              setActiveTab('dashboard');
              setCreatorDashboardTab('find');
              setRedirectAfterLogin(null);
            } else {
              setActiveTab('dashboard');
            }
          }, 1000);
        } else {
          // Prefill values and route to role selection onboarding
          setName(googleName || '');
          setEmail(googleEmail || '');
          if (photoUrl) {
            setUploadedPhoto(photoUrl);
          }
          setSuccess(`Google authenticated! Let's select your ShootMate role to complete setup.`);
          
          setTimeout(() => {
            setSuccess('');
            setMode('role_select');
          }, 1500);
        }
      } catch (err) {
        console.error('Google Auth Fetch Error:', err);
        setError('Connection to the authentication server failed.');
      }
    },
    onError: () => {
      setError('Google Sign In was cancelled or failed.');
    }
  });

  // Mode wizard state
  const [mode, setMode] = useState<'login' | 'signup' | 'role_select' | 'setup'>('signup');
  const [roleSelection, setRoleSelection] = useState<Role>('creator');

  // Primaries
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Pro checklist
  const [selectedProfessions, setSelectedProfessions] = useState<Profession[]>([]);
  
  // Profile setups
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Mumbai');
  const [phone, setPhone] = useState('+91 ');
  const [experience, setExperience] = useState<number>(3);
  const [about, setAbout] = useState('');
  const [availability, setAvailability] = useState<'available' | 'booked'>('available');
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedCountryConfig = countriesList.find(c => c.name === country);

  const handleCountryChange = (countryName: string) => {
    setCountry(countryName);
    const foundCountry = countriesList.find(c => c.name === countryName);
    if (foundCountry) {
      if (foundCountry.cities.length > 0) {
        setCity(foundCountry.cities[0]);
      } else {
        setCity('');
      }

      const dialingCode = foundCountry.code;
      const oldMatchedCountry = countriesList.find(c => phone.trim().startsWith(c.code));
      let localDigits = '';
      if (oldMatchedCountry) {
        localDigits = phone.substring(oldMatchedCountry.code.length).replace(/\D/g, '');
      } else {
        // Strip out the non-digit parts of any existing phone string
        localDigits = phone.replace(/\D/g, '');
      }
      
      const truncatedDigits = localDigits.substring(0, foundCountry.digitsCount || 10);
      setPhone(`${dialingCode} ${truncatedDigits}`);
    } else {
      setCity('');
    }
  };

  const handlePhoneChange = (inputVal: string) => {
    const activeCountry = countriesList.find(c => c.name === country);
    if (!activeCountry) {
      setPhone(inputVal);
      return;
    }
    const dialingCode = activeCountry.code;
    
    let localVal = '';
    if (inputVal.startsWith(dialingCode)) {
      localVal = inputVal.substring(dialingCode.length);
    } else {
      localVal = inputVal;
    }

    const digits = localVal.replace(/\D/g, '');
    const truncatedDigits = digits.substring(0, activeCountry.digitsCount || 10);
    setPhone(`${dialingCode} ${truncatedDigits}`);
  };

  const handleProfessionToggle = (prof: Profession) => {
    if (selectedProfessions.includes(prof)) {
      setSelectedProfessions(selectedProfessions.filter(p => p !== prof));
    } else {
      setSelectedProfessions([...selectedProfessions, prof]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please populate both email and password.');
      return;
    }

    try {
      const success = await loginUser(email, password);
      if (success) {
        setSuccess(`Welcome back! Successfully logged in.`);
        setTimeout(() => {
          if (redirectAfterLogin === 'dashboard-find') {
            setActiveTab('dashboard');
            setCreatorDashboardTab('find');
            setRedirectAfterLogin(null);
          } else {
            setActiveTab('dashboard');
          }
        }, 1000);
      } else {
        setError('No registered account found with this email. Please Sign Up first!');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in your primary details.');
      return;
    }

    // Move to next step: Role Selection
    setMode('role_select');
  };

  const handleRoleSelectionComplete = () => {
    if (roleSelection === 'professional' && selectedProfessions.length === 0) {
      setError('Please select at least one creative profession area.');
      return;
    }
    setError('');
    setMode('setup');
  };

  const handleProfileSetupComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!country || !city || !phone) {
      setError('Please fill in your location and mobile number.');
      return;
    }

    const activeCountry = countriesList.find(c => c.name === country);
    if (activeCountry) {
      const dialingCode = activeCountry.code;
      const digits = phone.startsWith(dialingCode) 
        ? phone.substring(dialingCode.length).replace(/\D/g, '') 
        : phone.replace(/\D/g, '');
      const expectedDigitsCount = activeCountry.digitsCount || 10;
      if (digits.length !== expectedDigitsCount) {
        setError(`Mobile number for ${country} must be exactly ${expectedDigitsCount} digits.`);
        return;
      }
    }

    const customUserId = `user-custom-${Date.now()}`;

    if (roleSelection === 'creator') {
      const newUser = {
        id: customUserId,
        name,
        email,
        role: 'creator' as const,
        photoUrl: uploadedPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=155',
        joinedAt: new Date().toISOString(),
        country,
        city,
        phone,
        rating: 5.0,
        reputationScore: 100,
        projectsCompleted: 0,
        responseTime: 'Instant',
        badges: ['🏆 Trusted Creator'],
        savedProfessionals: [] as string[]
      };

      signUpUser(newUser);
      setSuccess('Creator Profile created successfully! Loading workspace...');
      setTimeout(() => {
        if (redirectAfterLogin === 'dashboard-find') {
          setActiveTab('dashboard');
          setCreatorDashboardTab('find');
          setRedirectAfterLogin(null);
        } else {
          setActiveTab('dashboard');
          setCreatorDashboardTab('dashboard');
        }
      }, 1000);
    } else {
      const newUser = {
        id: customUserId,
        name,
        email,
        role: 'professional' as const,
        photoUrl: uploadedPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
        joinedAt: new Date().toISOString(),
        country,
        city,
        phone,
        professions: selectedProfessions,
        experience,
        about: about || 'Experienced freelancer local expert ready for shoots.',
        pricingRate: 400,
        availabilityStatus: availability,
        rating: 5.0,
        trustScore: 100,
        projectsCompleted: 0,
        responseTime: '< 30 mins',
        completionRate: 100,
        badges: ['⭐ Rising Talent'],
        savedProfessionals: [] as string[]
      };

      signUpUser(newUser);
      setSuccess('Creative Pro verification active! Loading studio dashboard...');
      setTimeout(() => {
        if (redirectAfterLogin === 'dashboard-find') {
          setActiveTab('dashboard');
          setCreatorDashboardTab('find');
          setRedirectAfterLogin(null);
        } else {
          setActiveTab('dashboard');
          setProfessionalDashboardTab('dashboard');
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* 1. LOGIN MODE SCREEN */}
      {mode === 'login' && (
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-transparent">
          
          {/* Left Column Description banner */}
          <div className="hidden md:flex flex-col justify-center text-left space-y-6 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            
            <h2 className="font-sans font-black text-3xl text-slate-950 leading-tight">
              Welcome back to <br />
              <span className="text-[#2563eb]">ShootMate</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-normal">
              Your creative network is waiting. Log in to find professionals or check incoming requests.
            </p>

            {/* List with light blue bullets */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <span className="text-xs font-semibold text-slate-700">Find verified professionals in any city</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <span className="text-xs font-semibold text-slate-700">Manage outgoing and incoming requests</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <span className="text-xs font-semibold text-slate-700">Track connection growth weekly and monthly</span>
              </div>
            </div>
          </div>

          {/* Right Column White Login Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100 text-left space-y-6">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
              <h3 className="font-sans font-black text-xl text-[#0f172a]">Welcome Back</h3>
              <p className="text-xs text-slate-400">Sign in to continue to ShootMate</p>
            </div>

            {/* Google Continue button */}
            <button 
              type="button"
              onClick={() => loginWithGoogle()}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.114 3.03-1.01 4.29l5.07 3.93c2.96-2.73 4.99-6.75 4.99-12.07z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-5.07-3.93c-1.39.93-3.17 1.48-5.12 1.48-3.93 0-7.25-2.65-8.44-6.22L1.135 16.52C3.12 20.48 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M3.56 12.35c-.29-.87-.46-1.8-.46-2.76s.17-1.89.46-2.76L1.135 2.96C.41 4.41 0 6.07 0 7.8c0 1.73.41 3.39 1.135 4.84l2.425-4.29z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.22 0 12 0 7.23 0 3.12 3.52 1.135 7.48l2.425 4.29c1.19-3.57 4.51-6.22 8.44-6.22z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Line separator */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 tracking-wider">OR</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {error && <div className="text-xs bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg">{error}</div>}
            {success && <div className="text-xs bg-green-50 border border-green-100 text-green-600 p-3 rounded-lg">{success}</div>}

            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => { e.target.readOnly = false; }}
                  className="w-full border border-slate-200 h-11 pl-10 pr-4 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  readOnly
                  onFocus={(e) => { e.target.readOnly = false; }}
                  className="w-full border border-slate-200 h-11 pl-10 pr-10 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-blue-700 text-white h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs">
              <span className="text-slate-400 font-normal">Don't have an account? </span>
              <button 
                onClick={() => { setMode('signup'); setError(''); }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 2. SIGN UP MODE SCREEN */}
      {mode === 'signup' && (
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-transparent">
          
          {/* Left Column stats details */}
          <div className="hidden md:flex flex-col justify-center text-left space-y-6 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            
            <h2 className="font-sans font-black text-3xl text-slate-950 leading-tight">
              Join <span className="text-[#2563eb]">ShootMate</span> Today
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-normal">
              Connect with creative professionals worldwide. Build your network, find local talent, and create amazing content.
            </p>

            {/* Grid stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <span className="block font-sans font-black text-xl text-blue-600">5,000+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Professionals</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <span className="block font-sans font-black text-xl text-blue-600">120+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cities</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <span className="block font-sans font-black text-xl text-blue-600">25K+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Connections</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <span className="block font-sans font-black text-xl text-blue-600">4.9★</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg. Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column White Sign Up Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100 text-left space-y-6">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
              <h3 className="font-sans font-black text-xl text-[#0f172a]">Create Account</h3>
              <p className="text-xs text-slate-400">Sign up to continue to ShootMate</p>
            </div>

            {/* Google Continue button */}
            <button 
              type="button"
              onClick={() => loginWithGoogle()}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.114 3.03-1.01 4.29l5.07 3.93c2.96-2.73 4.99-6.75 4.99-12.07z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-5.07-3.93c-1.39.93-3.17 1.48-5.12 1.48-3.93 0-7.25-2.65-8.44-6.22L1.135 16.52C3.12 20.48 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M3.56 12.35c-.29-.87-.46-1.8-.46-2.76s.17-1.89.46-2.76L1.135 2.96C.41 4.41 0 6.07 0 7.8c0 1.73.41 3.39 1.135 4.84l2.425-4.29z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.22 0 12 0 7.23 0 3.12 3.52 1.135 7.48l2.425 4.29c1.19-3.57 4.51-6.22 8.44-6.22z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Line separator */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 tracking-wider">OR</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {error && <div className="text-xs bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg">{error}</div>}

            <form onSubmit={handleSignupNext} className="space-y-4" autoComplete="off">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => { e.target.readOnly = false; }}
                  className="w-full border border-slate-200 h-11 pl-10 pr-4 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => { e.target.readOnly = false; }}
                  className="w-full border border-slate-200 h-11 pl-10 pr-4 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => { e.target.readOnly = false; }}
                  className="w-full border border-slate-200 h-11 pl-10 pr-10 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-blue-700 text-white h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs">
              <span className="text-slate-400 font-normal">Already have an account? </span>
              <button 
                onClick={() => { setMode('login'); setError(''); }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. ROLE SELECTION SCREEN ("What would you like to do?") */}
      {mode === 'role_select' && (
        <div className="max-w-xl w-full bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-100 space-y-6 text-center">
          
          {/* Logo header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-100 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <span className="font-sans font-black text-xl text-[#0f172a]">ShootMate</span>
            <h2 className="font-sans font-black text-xl text-slate-950 mt-2">What would you like to do?</h2>
            <p className="text-xs text-slate-400">Choose your role to get started on ShootMate</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            
            {/* Option 1: Content Creator */}
            <div 
              onClick={() => {
                setRoleSelection('creator');
                setError('');
              }}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-40 ${
                roleSelection === 'creator' 
                  ? 'border-blue-600 bg-blue-50/20' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
              }`}
            >
              <div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-10 h-10 flex items-center justify-center mb-3">
                  <UserIcon className="w-5 h-5" />
                </div>
                <h4 className="font-sans font-black text-[#0f172a] text-sm mb-1">Content Creator / User</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  Find and hire local creative professionals wherever you travel.
                </p>
              </div>
              {roleSelection === 'creator' && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-blue-600 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Selected</span>
                </div>
              )}
            </div>

            {/* Option 2: Creative Professional */}
            <div 
              onClick={() => {
                setRoleSelection('professional');
                setError('');
              }}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-40 ${
                roleSelection === 'professional' 
                  ? 'border-blue-600 bg-blue-50/20' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
              }`}
            >
              <div>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-10 h-10 flex items-center justify-center mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className="font-sans font-black text-[#0f172a] text-sm mb-1">Creative Professional</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  Get discovered by creators and grow your client base.
                </p>
              </div>
              {roleSelection === 'professional' && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-blue-600 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Selected</span>
                </div>
              )}
            </div>

          </div>

          {/* Picture 11: Display Classifications if Professional is selected */}
          {roleSelection === 'professional' && (
            <div className="bg-[#f8fafc]/60 p-5 rounded-2xl border border-slate-100 text-left space-y-3">
              <div>
                <span className="font-sans font-black text-xs text-[#0f172a] block">Select Your Profession(s)</span>
                <span className="text-[10px] text-slate-400">You can select multiple professions</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(['Photographer', 'Videographer', 'Cameraman', 'Video Editor'] as Profession[]).map((prof) => {
                  const isSelected = selectedProfessions.includes(prof);
                  return (
                    <button
                      type="button"
                      key={prof}
                      onClick={() => handleProfessionToggle(prof)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all duration-150 text-left cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/30 text-blue-600' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{prof}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && <div className="text-xs bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-left">{error}</div>}

          <div className="pt-2">
            <button 
              type="button"
              onClick={handleRoleSelectionComplete}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 4. PROFILE SETUP SCREEN (Picture 12 & 13) */}
      {mode === 'setup' && (
        <div className="max-w-md w-full bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-100 space-y-6 text-center animate-fade-in">
          
          <div className="space-y-1">
            <h2 className="font-sans font-black text-xl text-slate-950">Set Up Your Profile</h2>
            <p className="text-xs text-slate-400 font-normal">Help others find you with a complete profile</p>
          </div>

          <form onSubmit={handleProfileSetupComplete} className="space-y-4 text-left">
            
            {/* Avatar circular icon P with badge arrow upload */}
            <div className="flex flex-col items-center pt-2 pb-1 text-center space-y-1.5">
              <div className="relative w-22 h-22 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-100 overflow-hidden">
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : 'P'}</span>
                )}
                
                {/* Small circular upload icon at bottom-right of avatar */}
                <label className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:bg-blue-700 transition">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5h10.5" />
                  </svg>
                </label>
              </div>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider pt-1.5">Click the icon to upload profile photo</span>
            </div>

             {/* Input Country */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                <MapPin className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setIsCityOpen(false);
                }}
                className="w-full border border-slate-200 h-11 pl-10 pr-10 rounded-lg text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none cursor-pointer text-left flex items-center justify-between text-slate-705 font-sans font-medium"
              >
                <span>{country ? `${country} (${countriesList.find(c => c.name === country)?.code})` : 'Select Country'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCountryOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
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
                      {countriesList
                        .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                        .map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              handleCountryChange(c.name);
                              setCountrySearch('');
                              setIsCountryOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-blue-50/50 hover:text-blue-600 cursor-pointer ${
                              country === c.name ? 'bg-blue-50/30 text-blue-600 font-bold' : 'text-slate-700 font-medium'
                            }`}
                          >
                            {c.name} ({c.code})
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Input City */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                <MapPin className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (country) {
                    setIsCityOpen(!isCityOpen);
                    setIsCountryOpen(false);
                  }
                }}
                disabled={!country}
                className="w-full border border-slate-200 h-11 pl-10 pr-10 rounded-lg text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none cursor-pointer text-left flex items-center justify-between text-slate-705 font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{city || 'Select City'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isCityOpen && selectedCountryConfig && (
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
                      {(selectedCountryConfig.cities || [])
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

            {/* Mobile number */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <input 
                type="text"
                required
                placeholder={`Mobile Number (${selectedCountryConfig?.digitsCount || 10} digits)`}
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full border border-slate-200 h-11 pl-10 pr-4 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Professional fields vs Creator fields */}
            {roleSelection === 'professional' ? (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input 
                    type="number"
                    required
                    placeholder="Experience (years)"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full border border-slate-200 h-11 pl-10 pr-4 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Describe your skills, style, and what you offer..."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full border border-slate-200 p-3 pt-2.5 pl-10 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none font-sans resize-none"
                  />
                </div>
              </>
            ) : (
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea 
                  rows={3}
                  placeholder="Tell creators a bit about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full border border-slate-200 p-3 pt-2.5 pl-10 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none font-sans resize-none"
                />
              </div>
            )}

            {/* Availability Status toggle switch block */}
            <div className="border border-slate-100 bg-[#f8fafc]/50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-sans font-black text-xs text-[#0f172a] block">Availability Status</span>
                <span className="text-[10px] text-slate-400">Available for bookings</span>
              </div>
              <button
                type="button"
                onClick={() => setAvailability(availability === 'available' ? 'booked' : 'available')}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  availability === 'available' ? 'bg-[#3b82f6]' : 'bg-slate-200'
                }`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  availability === 'available' ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {error && <div className="text-xs bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg">{error}</div>}
            {success && <div className="text-xs bg-green-50 border border-green-100 text-green-600 p-3 rounded-lg font-semibold">{success}</div>}

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-blue-700 text-white h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{roleSelection === 'professional' ? 'Complete Setup' : 'Complete Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
