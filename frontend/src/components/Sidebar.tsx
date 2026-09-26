import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, Activity, User, LogOut, Ship, ChevronLeft, ChevronRight, Settings as SettingsIcon, Package } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Probability Charts', path: '/probability', icon: LineChart },
    { name: 'Analysis Trigger', path: '/analysis', icon: Activity },
    { name: 'Availability Window', path: '/availability', icon: Package },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#080d19] border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 text-slate-700 dark:text-slate-300 font-sans transition-all duration-300 z-50 shadow-sm`}>
      <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200 dark:border-slate-800/50 mb-4 h-20`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <Ship size={20} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-wide truncate">OCEANIQ AI</span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-medium border border-cyan-200 dark:border-cyan-500/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 text-slate-500 dark:text-slate-400 border border-transparent'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
