import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Moon } from 'lucide-react';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Light mode by default
  const [reminders, setReminders] = useState({
    pushNotifications: true,
    priceThresholds: true,
    weeklyReports: false
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('app-theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleReminder = (key: keyof typeof reminders) => {
    setReminders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen font-sans text-slate-900 dark:text-slate-200">
      <header className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="text-cyan-600 dark:text-cyan-500 w-6 h-6" /> System Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your app appearance and notification settings.</p>
      </header>

      <div className="space-y-6">
        
        {/* Appearance Panel */}
        <section className="bg-white dark:bg-[#111827] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-600 dark:text-cyan-500"/> Appearance
          </h2>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0B1120] rounded-lg border border-slate-200 dark:border-slate-800/50">
            <div>
              <h3 className="text-slate-900 dark:text-slate-200 text-sm font-medium">Dark Mode</h3>
              <p className="text-xs text-slate-500 mt-0.5">Toggle dark maritime theme</p>
            </div>
            <button 
              onClick={handleThemeToggle}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Reminders & Alerts */}
        <section className="bg-white dark:bg-[#111827] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-500"/> Notifications
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0B1120] rounded-lg border border-slate-200 dark:border-slate-800/50">
              <div>
                <h3 className="text-slate-900 dark:text-slate-200 text-sm font-medium">Critical Risk Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Port congestion or extreme weather on your routes.</p>
              </div>
              <button 
                onClick={() => toggleReminder('pushNotifications')}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${reminders.pushNotifications ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${reminders.pushNotifications ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0B1120] rounded-lg border border-slate-200 dark:border-slate-800/50">
              <div>
                <h3 className="text-slate-900 dark:text-slate-200 text-sm font-medium">Freight Rate Thresholds</h3>
                <p className="text-xs text-slate-500 mt-0.5">Alert when rate drops below historical average.</p>
              </div>
              <button 
                onClick={() => toggleReminder('priceThresholds')}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${reminders.priceThresholds ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${reminders.priceThresholds ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0B1120] rounded-lg border border-slate-200 dark:border-slate-800/50">
              <div>
                <h3 className="text-slate-900 dark:text-slate-200 text-sm font-medium">Weekly Market Report</h3>
                <p className="text-xs text-slate-500 mt-0.5">Summary of FPI trends and vessel availability.</p>
              </div>
              <button 
                onClick={() => toggleReminder('weeklyReports')}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${reminders.weeklyReports ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${reminders.weeklyReports ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
