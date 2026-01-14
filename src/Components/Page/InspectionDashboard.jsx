import React, { useState } from "react";
import { Menu, X, FileText, LogOut, User } from "lucide-react"; // Example icons
import DashboardNavbar from "../Dashboards/DashboardNavbar";
import DashboardSidebar from "../Dashboards/DashboardSidebar";


const InspectionDashboard = () => {
  

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      <DashboardNavbar />
      <div className="flex flex-1">
        {/* Sidebar - Collapses to thin bar on mobile, full width on large */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white">
              Dashboard Overview
            </h1>
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

export default InspectionDashboard;
