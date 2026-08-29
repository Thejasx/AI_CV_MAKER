import React from 'react';
import { Sparkles, CheckCircle2, UserCheck, LogIn, FolderOpen, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeStep, setActiveStep, onOpenSaved, onOpenAuth, onReset }) {
  const { user, logout } = useAuth();

  const steps = [
    { id: 1, label: '1. Ingest CV' },
    { id: 2, label: '2. Job Target' },
    { id: 3, label: '3. AI Optimize' },
    { id: 4, label: '4. ATS Workspace' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">AI CV Maker</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">100% ATS Compliant Resume Engine</p>
          </div>
        </div>

        {/* Steps Progress Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full p-1 shadow-inner">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : isCompleted
                    ? 'text-emerald-700 hover:text-emerald-800 hover:bg-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                )}
                {step.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all"
            title="View saved resumes"
          >
            <FolderOpen className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Saved Resumes</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-800 font-semibold max-w-[100px] truncate">{user.name}</span>
              <button
                onClick={logout}
                className="text-slate-500 hover:text-rose-600 ml-1 font-bold text-[11px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          <button
            onClick={onReset}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            title="Start New Resume"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
