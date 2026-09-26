import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Activity } from 'lucide-react';
import { getProfile, saveProfile } from '../lib/profile';

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    setFormData(getProfile());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(formData);
    navigate('/profile');
  };

  if (!formData) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen font-sans text-slate-900 dark:text-slate-200">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft size={16} /> Back to Profile
          </button>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Edit Profile & Defaults</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-8 transition-colors">
        
        {/* Personal Details */}
        <section>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Company</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Industry Sector</label>
              <input 
                type="text" 
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Dashboard Simulation Defaults */}
        <section>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Activity size={18} className="text-cyan-600 dark:text-cyan-500" /> Default Simulation Parameters
          </h2>
          <p className="text-xs text-slate-500 mb-4">Set your default route and vessel. The AI models and dashboard will automatically track these values.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Default Origin Port</label>
              <select 
                value={formData.defaultOrigin}
                onChange={e => setFormData({...formData, defaultOrigin: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              >
                <option value="Newcastle, AU">Newcastle, AU</option>
                <option value="Gladstone, AU">Gladstone, AU</option>
                <option value="Richards Bay, ZA">Richards Bay, ZA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Default Destination Port</label>
              <select 
                value={formData.defaultDestination}
                onChange={e => setFormData({...formData, defaultDestination: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              >
                <option value="Paradip, IN">Paradip, IN</option>
                <option value="Haldia, IN">Haldia, IN</option>
                <option value="Ennore, IN">Ennore, IN</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Preferred Cargo Type</label>
              <input 
                type="text" 
                value={formData.preferredCargo}
                onChange={e => setFormData({...formData, preferredCargo: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Default Vessel Class</label>
              <select 
                value={formData.defaultVessel}
                onChange={e => setFormData({...formData, defaultVessel: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              >
                <option value="Panamax (70,000 MT)">Panamax (70,000 MT)</option>
                <option value="Capesize (150,000 MT)">Capesize (150,000 MT)</option>
                <option value="Supramax (55,000 MT)">Supramax (55,000 MT)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate('/profile')}
            className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-colors"
          >
            <Save size={18} /> Save Preferences
          </button>
        </div>

      </form>
    </div>
  );
}
