import React, { useState } from 'react';
import { Menu, X, FileText, LogOut, User } from 'lucide-react'; // Example icons

const SupervisorDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      {/* Navigation Bar */}
      <nav className="sticky top-0 w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-50">
        <div className="flex items-center justify-between p-4 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-sm flex items-center justify-center transform rotate-45">
              <div className="w-3 h-3 bg-white rounded-full -rotate-45"></div>
            </div>
            <span className="text-xl lg:text-2xl font-bold tracking-tighter text-white">
              InspectPro<span className="text-orange-500">.</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-slate-400 px-4 py-1 text-sm font-bold capitalize tracking-widest">Supervisor</span>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all hover:scale-105">
              Generate Report
            </button>
            <button className="bg-red-900/40 hover:bg-red-700 text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all">
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-4 flex flex-col">
            <button className="w-full text-left px-2 py-2 text-sm text-slate-300">Supervisor</button>
            <button className="w-full bg-orange-600 text-white p-2 rounded-sm text-xs font-bold uppercase">Generate Report</button>
            <button className="w-full bg-red-900 text-white p-2 rounded-sm text-xs font-bold uppercase">Logout</button>
          </div>
        )}
      </nav>

      <div className="flex flex-1">
        {/* Sidebar - Collapses to thin bar on mobile, full width on large */}
        <aside className="w-16 lg:w-64 border-r border-slate-800 bg-slate-900/20 transition-all duration-300 flex flex-col">
          <div className="p-4 lg:p-6 border-b border-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 p-0.5 shadow-orange-500/20">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs lg:text-base">
                    AV
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
              </div>
              <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-bold text-white uppercase tracking-tight truncate">
                  Alex InspectPro
                </p>
              </div>
            </div>
          </div>
          
          {/* Example Sidebar Icons for Mobile */}
          <div className="flex flex-col items-center lg:items-start p-4 space-y-6">
             <div className="lg:flex items-center gap-3 text-slate-400 hover:text-orange-500 cursor-pointer">
                <FileText size={20} />
                <span className="hidden lg:block text-sm">Inspections</span>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto">
             <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
             {/* Your content goes here */}
             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-32 rounded-xl border border-slate-800 bg-slate-900/50 p-4"></div>
                <div className="h-32 rounded-xl border border-slate-800 bg-slate-900/50 p-4"></div>
                <div className="h-32 rounded-xl border border-slate-800 bg-slate-900/50 p-4"></div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupervisorDashboard;