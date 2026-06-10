import React from 'react';
import { useApp } from '../context/StateContext';
import { AlertTriangle, Users, BookOpen, Clock, Activity, CheckSquare, Sparkles, Filter, ShieldCheck, Mail } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { reports, resolveReport, analytics, professionals, requests, setActiveTab, logoutUser } = useApp();

  const unresolvedReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Admin Title Board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-5">
        <div className="text-left space-y-2">
          <h1 className="font-display font-extrabold text-3xl text-brand-text flex items-center gap-2">
            ShootMate Moderator Suite <span className="text-brand-accent text-xs uppercase font-mono font-bold px-2 py-0.5 bg-brand-accent/15 rounded">Staff operator session</span>
          </h1>
          <p className="text-xs text-brand-muted">
            Platform-level analytics, abuse tickets stream, search audit indexes, and user resolution boards.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border text-xs font-semibold tracking-tight transition hover:bg-slate-50 cursor-pointer bg-white text-slate-700 border-slate-200"
          >
            <span>Go to Website</span>
          </button>
          <button
            onClick={() => logoutUser()}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border text-xs font-semibold tracking-tight transition hover:bg-red-50 cursor-pointer bg-white text-red-600 border-red-200"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Grid of broad platform analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border p-5 rounded-2xl text-left select-none space-y-1">
          <div className="flex justify-between items-center text-brand-muted mb-1">
            <span className="text-[10px] font-bold uppercase font-mono">Platform Registrations</span>
            <Users className="w-4 h-4 text-brand-primary" />
          </div>
          <strong className="font-display font-black text-2xl text-brand-text">{analytics.totalUsers} Creators</strong>
          <span className="text-[9px] text-brand-muted block">{analytics.totalProfessionals} verified local pros</span>
        </div>

        <div className="bg-white border p-5 rounded-2xl text-left select-none space-y-1">
          <div className="flex justify-between items-center text-brand-muted mb-1">
            <span className="text-[10px] font-bold uppercase font-mono">Global Gigs Dispatched</span>
            <BookOpen className="w-4 h-4 text-brand-secondary" />
          </div>
          <strong className="font-display font-black text-2xl text-brand-text">{analytics.totalRequests} Props</strong>
          <span className="text-[9px] text-brand-muted block">Escrow pipelines checks stable</span>
        </div>

        <div className="bg-white border p-5 rounded-2xl text-left select-none space-y-1">
          <div className="flex justify-between items-center text-brand-muted mb-1">
            <span className="text-[10px] font-bold uppercase font-mono">Violations Open Tickets</span>
            <AlertTriangle className="w-4 h-4 text-brand-danger" />
          </div>
          <strong className="font-display font-black text-2xl text-brand-danger">{unresolvedReports.length} pending</strong>
          <span className="text-[9px] text-brand-muted block">{resolvedReports.length} complaints resolved</span>
        </div>

        <div className="bg-white border p-5 rounded-2xl text-left select-none space-y-1">
          <div className="flex justify-between items-center text-brand-muted mb-1">
            <span className="text-[10px] font-bold uppercase font-mono">Active Target Nodes</span>
            <Activity className="w-4 h-4 text-brand-success animate-pulse" />
          </div>
          <strong className="font-display font-black text-2xl text-brand-success">100% ONLINE</strong>
          <span className="text-[9px] text-brand-muted block">Node systems latency &lt; 22ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Abuse Reports tickets pipeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b pb-3 text-left">
            <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-brand-danger" /> Security & Violation Tickets ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <div className="bg-white border p-8 text-center rounded-2xl text-xs text-brand-muted">
              Platform is completely pristine. No active user violations recorded.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((rep) => {
                const isPending = rep.status === 'pending';
                return (
                  <div key={rep.id} className="bg-white border p-5 rounded-2xl text-left space-y-3 shadow-xs">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="bg-brand-danger/10 text-brand-danger font-mono font-bold text-[9px] py-0.5 px-2.5 rounded uppercase tracking-wider">
                          Abuse Type: {rep.reason}
                        </span>
                        <h4 className="font-bold text-xs text-brand-text mt-1.5 leading-none">
                          Reported User: <strong>{rep.reportedName}</strong> ({rep.reportedRole})
                        </h4>
                      </div>

                      <span className={`text-[10px] uppercase font-mono ${isPending ? 'text-brand-warning font-bold animate-pulse' : 'text-brand-success'}`}>
                        {rep.status}
                      </span>
                    </div>

                    <div className="text-xs text-brand-muted space-y-1 leading-relaxed">
                      <p><strong>Incident details:</strong> {rep.details}</p>
                      <p className="text-[10px] font-mono text-slate-400">Reporter: {rep.reporterName} • Filed on {new Date(rep.createdAt).toLocaleDateString()}</p>
                    </div>

                    {isPending && (
                      <div className="pt-2">
                        <button 
                          onClick={() => resolveReport(rep.id)}
                          className="bg-brand-primary text-white hover:bg-brand-primary/95 font-bold text-xs py-1.5 px-4 rounded-lg cursor-pointer transition shadow-xs flex items-center gap-1"
                        >
                          <CheckSquare className="w-4 h-4 shrink-0" /> Mark Resolved & Issues Warnings
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column Geographical Hubs Listings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b pb-3 text-left">
            <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-text flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-primary" /> Active Hub Rankings
            </h3>
          </div>

          <div className="bg-white border rounded-2xl p-4 text-left divide-y">
            {analytics.topCities.map((c, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 text-xs text-brand-text first:pt-0 last:pb-0">
                <span className="font-sans font-semibold text-brand-muted">{i+1}. {c.city}</span>
                <span className="font-mono text-brand-primary font-bold scale-95">{c.count} searches</span>
              </div>
            ))}
          </div>

          <div className="bg-brand-text text-white p-5 rounded-2xl text-left select-none space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary opacity-20 blur-xl"></div>
            <span className="text-[9px] uppercase tracking-wider font-mono text-brand-accent">Safety Protocols</span>
            <h4 className="font-display font-extrabold text-sm leading-tight">Escrow Safeguards Live</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              All payment releases are secured until the mutual double-blind assessment rating constraints are fulfilled by matching creators and professionals, securing highest-tier community delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
