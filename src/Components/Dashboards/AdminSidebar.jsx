import React from "react";
import {
  Menu,
  X,
  FileText,
  LogOut,
  User,
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  ShieldAlert,
  HelpCircle,
} from "lucide-react"; // Example icons
import { href } from "react-router-dom";

const sidebarLinks = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/admin-dashboard",
    active: true,
  },
  {
    name: "Inspections",
    icon: <ClipboardCheck size={20} />,
    href: "/admin/inspections",
  },
  { name: "User Management", icon: <Users size={20} />, href: "/admin/users" },
  {
    name: "Report Management",
    icon: <ShieldAlert size={20} />,
    href: "/admin/logs",
  },
  {
    name: "Project Setup",
    icon: <Settings size={20} />,
    href: "/admin/settings",
  },
  {
    name: "Equipment Management",
    icon: <Settings size={20} />,
    href: "/admin/settings",
  },
  {
    name: "System Configuration",
    icon: <Settings size={20} />,
    href: "/admin/settings",
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-16 min-h-screen lg:w-64 fixed border-r border-slate-800 bg-slate-900/20 transition-all duration-300 flex flex-col">
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

      {sidebarLinks.map((link, index) => (
        <div
          key={index}
          className="flex flex-col items-center lg:items-start p-4"
        >
          <div className="lg:flex items-center gap-3 text-slate-400 hover:text-orange-500 cursor-pointer transition-colors">
            {link.icon}
            <a href={link.href} className="hidden lg:block text-sm font-medium">
              {link.name}
            </a>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default AdminSidebar;
