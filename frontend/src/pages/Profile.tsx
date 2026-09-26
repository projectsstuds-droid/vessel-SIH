import React, { useEffect, useState } from 'react';
import { User, Ship, MapPin, Anchor, Settings as SettingsIcon, Edit3 } from 'lucide-react';
import { getProfile, UserProfile } from '../lib/profile';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen font-sans text-slate-900 dark:text-slate-200">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide mb-1 uppercase">Account</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <User className="text-cyan-600 dark:text-cyan-500 w-8 h-8" /> User Profile
          </h1>
        </div>
        <Link 
          to="/profile/edit"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
        >
          <Edit3 size={16} /> Edit Profile
        </Link>
      </header>

      <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-200 dark:border-slate-800/50">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl font-bold text-cyan-600 dark:text-cyan-500 border border-slate-200 dark:border-slate-700">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{profile.company} • {profile.role}</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Default AI Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-cyan-600 dark:text-cyan-400 shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Default Origin</p>
              <p className="font-medium text-slate-900 dark:text-slate-200">{profile.defaultOrigin}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Anchor size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Default Destination</p>
              <p className="font-medium text-slate-900 dark:text-slate-200">{profile.defaultDestination}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Ship size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Default Vessel Class</p>
              <p className="font-medium text-slate-900 dark:text-slate-200">{profile.defaultVessel}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0B1120] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-cyan-600 dark:text-cyan-400 shadow-sm">
              <SettingsIcon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Preferred Cargo</p>
              <p className="font-medium text-slate-900 dark:text-slate-200">{profile.preferredCargo}</p>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-slate-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          These parameters are automatically loaded into your Dashboard and Analysis tools.
        </p>
      </div>
    </div>
  );
}
