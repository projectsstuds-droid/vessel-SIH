import React, { useState } from 'react';
import { Package, Bell, MapPin, Calendar, Anchor, CheckCircle2, AlertCircle } from 'lucide-react';

const initialCargoes = [
  { id: 1, type: 'Coal', quantity: '75,000 MT', origin: 'Newcastle, AU', dest: 'Paradip, IN', laycan: 'Oct 12 - Oct 15', status: 'Available', priority: 'High', tracked: false },
  { id: 2, type: 'Iron Ore', quantity: '150,000 MT', origin: 'Port Hedland, AU', dest: 'Haldia, IN', laycan: 'Oct 18 - Oct 22', status: 'Available', priority: 'Medium', tracked: false },
  { id: 3, type: 'Limestone', quantity: '55,000 MT', origin: 'Mina Saqr, AE', dest: 'Ennore, IN', laycan: 'Oct 20 - Oct 25', status: 'Short Window', priority: 'High', tracked: false },
  { id: 4, type: 'Bauxite', quantity: '60,000 MT', origin: 'Kamsar, GN', dest: 'Paradip, IN', laycan: 'Nov 01 - Nov 05', status: 'Available', priority: 'Low', tracked: false },
  { id: 5, type: 'Thermal Coal', quantity: '80,000 MT', origin: 'Richards Bay, ZA', dest: 'Krishnapatnam, IN', laycan: 'Oct 28 - Nov 02', status: 'Available', priority: 'Medium', tracked: true },
];

export default function Availability() {
  const [cargoes, setCargoes] = useState(initialCargoes);
  const [notification, setNotification] = useState<{show: boolean, msg: string, type: 'success' | 'alert'}>({ show: false, msg: '', type: 'success' });

  const handleTrack = (id: number, type: string) => {
    setCargoes(cargoes.map(c => c.id === id ? { ...c, tracked: !c.tracked } : c));
    
    const isTracking = !cargoes.find(c => c.id === id)?.tracked;
    
    setNotification({
      show: true,
      msg: isTracking ? `Tracker set for ${type}. You will be notified of critical updates.` : `Tracker removed for ${type}.`,
      type: isTracking ? 'success' : 'alert'
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);

    // Simulate a critical issue randomly if tracking was just turned on
    if (isTracking) {
      setTimeout(() => {
        setNotification({
          show: true,
          msg: `CRITICAL ALERT: Port congestion detected at destination for tracked ${type} shipment!`,
          type: 'alert'
        });
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 6000);
      }, 8000);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen font-sans text-slate-900 dark:text-slate-200 relative">
      
      {/* Toast Notification */}
      <div className={`fixed top-8 right-8 z-50 transition-all duration-500 transform ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${notification.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-300'}`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />}
          <div className="font-medium text-sm pr-4">{notification.msg}</div>
        </div>
      </div>

      <header className="mb-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide mb-1 uppercase">Market</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <Package className="text-cyan-600 dark:text-cyan-500 w-8 h-8" /> Availability Window
        </h1>
        <p className="text-slate-500 mt-2">Track current available cargoes, set reminders, and receive critical market alerts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cargoes.map((cargo) => (
          <div key={cargo.id} className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all group">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-3 ${cargo.status === 'Available' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                  {cargo.status}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cargo.type}</h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm">{cargo.quantity}</p>
              </div>
              
              <button 
                onClick={() => handleTrack(cargo.id, cargo.type)}
                className={`p-3 rounded-xl transition-all ${cargo.tracked ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 ring-2 ring-cyan-500/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30'}`}
                title={cargo.tracked ? "Remove Tracker" : "Set Tracker & Reminders"}
              >
                <Bell className={`w-5 h-5 ${cargo.tracked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Origin</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{cargo.origin}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Anchor className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Destination</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{cargo.dest}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Laycan Window</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{cargo.laycan}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
