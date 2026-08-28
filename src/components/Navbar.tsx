import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Bell, User } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenProfile: () => void;
  activeAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenProfile,
  activeAlertsCount = 2,
}) => {
  // If analysis is active, map it visually to Dashboard
  const activeNavTab = currentTab === 'analysis' ? 'dashboard' : currentTab;

  return (
    <>
      {/* TopAppBar (Desktop) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 hidden md:flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-left flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-md shadow-indigo-200 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-3.5 h-3.5 bg-white rounded-xs rotate-45"></div>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  SGD Exchange
                </span>
              </div>
            </button>

            {/* Sleek Segmented Switcher Navigation */}
            <nav className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1 border border-slate-200/60">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeNavTab === 'dashboard'
                    ? 'bg-white text-indigo-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => onSelectTab('converter')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeNavTab === 'converter'
                    ? 'bg-white text-indigo-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Converter
              </button>

              <button
                onClick={() => onSelectTab('alerts')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeNavTab === 'alerts'
                    ? 'bg-white text-indigo-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Alerts
                {activeAlertsCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-pulse" />
                )}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              aria-label="User Profile & Settings"
              className="w-9 h-9 bg-slate-100 rounded-full border-2 border-white shadow-xs text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg flex justify-around items-center px-4 py-2 md:hidden">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeNavTab === 'dashboard'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Dashboard</span>
        </button>

        <button
          onClick={() => onSelectTab('converter')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeNavTab === 'converter'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Converter</span>
        </button>

        <button
          onClick={() => onSelectTab('alerts')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl active:scale-95 transition-all relative cursor-pointer ${
            activeNavTab === 'alerts'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Alerts</span>
          {activeAlertsCount > 0 && (
            <span className="absolute top-1.5 right-3.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </nav>
    </>
  );
};
