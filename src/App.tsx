/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StateProvider, useApp } from './context/StateContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { SearchProfessionals } from './components/SearchProfessionals';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { CreatorDashboard } from './components/CreatorDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthPages } from './components/AuthPages';
import { GoogleOAuthProvider } from '@react-oauth/google';

function AppContent() {
  const { activeTab, activeRole, isLoggedIn } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'search':
        return <SearchProfessionals />;
      case 'professional-profile':
        if (isLoggedIn && activeRole === 'creator') {
          return <CreatorDashboard />;
        }
        return <ProfessionalProfile />;
      case 'dashboard':
        if (activeRole === 'creator') {
          return <CreatorDashboard />;
        } else if (activeRole === 'professional') {
          return <ProfessionalDashboard />;
        } else {
          return <AdminPanel />;
        }
      case 'auth':
        return <AuthPages />;
      default:
        return <LandingPage />;
    }
  };

  const showHeader = activeTab !== 'dashboard' && !(isLoggedIn && activeTab === 'professional-profile' && activeRole === 'creator');
  const showFooter = activeTab === 'home';

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg-cream selection:bg-brand-primary selection:text-white">
      {showHeader && <Navbar />}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID';
console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <StateProvider>
        <AppContent />
      </StateProvider>
    </GoogleOAuthProvider>
  );
}

