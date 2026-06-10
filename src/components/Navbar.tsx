import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { Bell, Shield, User as UserIcon, LogIn, ChevronDown, Menu, X, ArrowUpRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { 
    activeUser, 
    activeRole, 
    switchUserRole, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab, 
    activeTab,
    triggerSearchFlow,
    setCreatorDashboardTab,
    setProfessionalDashboardTab,
    isLoggedIn,
    logoutUser,
    setCameFromLanding
  } = useApp();

  const [showDemoHub, setShowDemoHub] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => n.userId === activeUser.id && !n.read);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'professionals', label: 'Professionals' }
  ];

  const handleLinkClick = (id: string) => {
    setCameFromLanding(false);
    if (id === 'find') {
      triggerSearchFlow(false);
    } else {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
    // Scroll to section if on home
    if (id === 'features' || id === 'how-it-works' || id === 'professionals' || id === 'pricing' || id === 'about') {
      setActiveTab('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="w-full bg-white/85 backdrop-blur-lg border border-brand-border/70 rounded-2xl md:rounded-full shadow-md shadow-slate-200/30 transition-all duration-300">
        <div className="px-5 sm:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => {
              setCameFromLanding(false);
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <span className="font-sans font-black text-2xl tracking-tight text-slate-900 animate-fade-in">
              Shoot<span className="text-blue-600">Mate</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isSelected = activeTab === link.id || (link.id === 'find' && activeTab === 'search');
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-[14px] font-medium transition-colors hover:text-brand-primary cursor-pointer relative py-1 ${
                    isSelected ? 'text-brand-primary font-semibold' : 'text-brand-muted'
                  }`}
                >
                  {link.label}
                  {isSelected && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Extra Actions Group */}
          <div className="flex items-center gap-4">
            {/* Notifications Trigger */}
            {isLoggedIn && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 sm:p-2.5 rounded-full hover:bg-brand-bg-soft text-brand-text transition relative cursor-pointer"
                >
                  <Bell className="w-5 h-5 text-brand-text" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-brand-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {/* Notifications Menu */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-brand-border/80 shadow-xl z-50 p-4 max-h-[480px] overflow-y-auto"
                      >
                        <div className="flex justify-between items-center border-b border-brand-border/60 pb-3 mb-2">
                          <h4 className="font-display font-bold text-base text-brand-text">Notifications</h4>
                          {unreadNotifs.length > 0 && (
                            <button 
                              onClick={() => markAllNotificationsRead(activeUser.id)}
                              className="text-xs text-brand-primary hover:underline font-semibold cursor-pointer"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        
                        {notifications.filter(n => n.userId === activeUser.id).length === 0 ? (
                          <div className="py-8 text-center text-brand-muted text-sm flex flex-col items-center gap-1">
                            <CheckCircle className="w-8 h-8 text-brand-muted/40 mb-1" />
                            <span>All caught up! No notifications.</span>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {notifications
                              .filter(n => n.userId === activeUser.id)
                              .map((notif) => (
                                <div 
                                  key={notif.id}
                                  onClick={() => {
                                    markNotificationRead(notif.id);
                                    if (notif.linkId) {
                                      if (activeRole === 'creator') {
                                        setActiveTab('dashboard');
                                        setCreatorDashboardTab('requests');
                                      } else if (activeRole === 'professional') {
                                        setActiveTab('dashboard');
                                        setProfessionalDashboardTab('requests');
                                      }
                                    }
                                    setShowNotifications(false);
                                  }}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                    notif.read 
                                      ? 'bg-transparent border-transparent grayscale-[30%] opacity-70' 
                                      : 'bg-brand-bg-cream/40 border-brand-primary/10 hover:bg-brand-bg-cream shadow-sm'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-0.5">
                                    <span className="font-bold text-xs uppercase tracking-wider text-brand-primary font-mono scale-95">
                                      {notif.type}
                                    </span>
                                    <span className="text-[10px] text-brand-muted">
                                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <h5 className="font-semibold text-xs text-brand-text mb-1">{notif.title}</h5>
                                  <p className="text-xs text-brand-muted line-clamp-2">{notif.message}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {isLoggedIn ? (
              <>
                {/* User Console Button */}
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`hidden sm:flex items-center gap-2 py-2 px-4 rounded-xl md:rounded-full border text-xs font-semibold tracking-tight transition cursor-pointer ${
                    activeTab === 'dashboard' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {activeRole === 'admin' ? <Shield className="w-4 h-4 text-blue-500" /> : <UserIcon className="w-4 h-4" />}
                  <span>Dashboard</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>


              </>
            ) : (
              <>
                {/* Log In and Sign Up buttons */}
                <button 
                  onClick={() => setActiveTab('auth')} 
                  className="text-slate-600 hover:text-blue-600 text-[13px] font-extrabold px-3 py-2 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => setActiveTab('auth')} 
                  className="bg-blue-600 text-white hover:bg-blue-700 text-[13px] font-extrabold py-2 px-4.5 rounded-full transition shadow-sm hover:shadow-blue-100 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-1 rounded-full hover:bg-brand-bg-soft text-brand-text md:hidden transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slide-Out */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 border border-brand-border bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl flex flex-col text-left shadow-lg overflow-hidden space-y-3"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`py-2 text-[15px] font-semibold text-brand-text transition-colors border-b border-brand-bg-soft ${
                  activeTab === link.id ? 'text-brand-primary' : 'text-brand-text'
                } text-left`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button 
                onClick={() => handleLinkClick('dashboard')}
                className="w-full text-center py-2.5 rounded-full border border-brand-border hover:bg-brand-bg-soft font-semibold text-sm cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
