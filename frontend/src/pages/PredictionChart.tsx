import React, { useEffect, useState } from 'react';
import { CloudRain, CloudLightning, Sun, Wind, AlertTriangle, LineChart } from 'lucide-react';
import { getProfile } from '../lib/profile';

// Demo data for the weather option chain
const predictionData = [
  { date: 'Sep 16', origin: { cond: 'Clear', icon: Sun, wind: '12 kn', pv: '92%', risk: 'Low', color: 'text-emerald-600 dark:text-emerald-400' }, dest: { cond: 'Showers', icon: CloudRain, wind: '18 kn', pv: '65%', risk: 'Medium', color: 'text-amber-600 dark:text-amber-400' } },
  { date: 'Sep 17', origin: { cond: 'Cloudy', icon: Sun, wind: '14 kn', pv: '85%', risk: 'Low', color: 'text-emerald-600 dark:text-emerald-400' }, dest: { cond: 'Heavy Rain', icon: CloudRain, wind: '25 kn', pv: '78%', risk: 'High', color: 'text-red-600 dark:text-red-400' } },
  { date: 'Sep 18', origin: { cond: 'Light Rain', icon: CloudRain, wind: '16 kn', pv: '60%', risk: 'Medium', color: 'text-amber-600 dark:text-amber-400' }, dest: { cond: 'Thunderstorm', icon: CloudLightning, wind: '35 kn', pv: '88%', risk: 'Critical', color: 'text-red-700 dark:text-red-500' } },
  { date: 'Sep 19', origin: { cond: 'Clear', icon: Sun, wind: '10 kn', pv: '95%', risk: 'Low', color: 'text-emerald-600 dark:text-emerald-400' }, dest: { cond: 'Rain', icon: CloudRain, wind: '22 kn', pv: '70%', risk: 'High', color: 'text-red-600 dark:text-red-400' } },
  { date: 'Sep 20', origin: { cond: 'Clear', icon: Sun, wind: '11 kn', pv: '90%', risk: 'Low', color: 'text-emerald-600 dark:text-emerald-400' }, dest: { cond: 'Overcast', icon: Sun, wind: '15 kn', pv: '55%', risk: 'Medium', color: 'text-amber-600 dark:text-amber-400' } },
  { date: 'Sep 21', origin: { cond: 'Windy', icon: Wind, wind: '28 kn', pv: '82%', risk: 'High', color: 'text-red-600 dark:text-red-400' }, dest: { cond: 'Clear', icon: Sun, wind: '12 kn', pv: '90%', risk: 'Low', color: 'text-emerald-600 dark:text-emerald-400' } },
  { date: 'Sep 22', origin: { cond: 'Gale Warning', icon: AlertTriangle, wind: '40 kn', pv: '95%', risk: 'Critical', color: 'text-red-700 dark:text-red-500' }, dest: { cond: 'Clear', icon: Sun, wind: '10 kn', pv: '94%', risk: 'Low', color: 'text-emerald-600 dark:text-emerald-400' } },
];

export default function PredictionChart() {
  const [originName, setOriginName] = useState('NEWCASTLE, AU');
  const [destName, setDestName] = useState('PARADIP, IN');

  useEffect(() => {
    const profile = getProfile();
    const activeOrigin = localStorage.getItem('active-origin');
    const activeDest = localStorage.getItem('active-dest');

    if (activeOrigin) setOriginName(activeOrigin.toUpperCase());
    else if (profile?.defaultOrigin) setOriginName(profile.defaultOrigin.toUpperCase());

    if (activeDest) setDestName(activeDest.toUpperCase());
    else if (profile?.defaultDestination) setDestName(profile.defaultDestination.toUpperCase());
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen font-sans text-slate-900 dark:text-slate-200">
      <header className="mb-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide mb-1 uppercase">Risk Analytics</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <LineChart className="text-cyan-600 dark:text-cyan-500 w-8 h-8" /> Probability Charts
        </h1>
        <p className="text-slate-500 mt-2">Horizontal detail sections analyzing Probability Value (PV) across origins and destinations</p>
      </header>

      <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm dark:shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Table Header */}
        <div className="grid grid-cols-11 bg-slate-50 dark:bg-[#0f1522] text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800/80">
          {/* Origin Side (Left) */}
          <div className="col-span-5 grid grid-cols-4 text-center py-5">
            <div className="px-2">Risk Level</div>
            <div className="px-2">PV (Prob. Value)</div>
            <div className="px-2">Wind Speed</div>
            <div className="px-2">Condition</div>
          </div>
          
          {/* Center Column (Date/Strike) */}
          <div className="col-span-1 text-center py-5 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-500 font-bold border-l border-r border-slate-200 dark:border-slate-800/80">
            DATE
          </div>
          
          {/* Destination Side (Right) */}
          <div className="col-span-5 grid grid-cols-4 text-center py-5">
            <div className="px-2">Condition</div>
            <div className="px-2">Wind Speed</div>
            <div className="px-2">PV (Prob. Value)</div>
            <div className="px-2">Risk Level</div>
          </div>
        </div>
        
        {/* Sub-Header indicating Ports */}
        <div className="grid grid-cols-11 bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 text-sm font-bold border-b border-slate-200 dark:border-slate-800/80 shadow-sm relative z-10">
          <div className="col-span-5 text-center py-3 tracking-widest flex items-center justify-center gap-2 truncate px-4">
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div> <span className="truncate">ORIGIN: {originName}</span>
          </div>
          <div className="col-span-1 border-l border-r border-slate-200 dark:border-slate-800/80 bg-cyan-50 dark:bg-cyan-950/10"></div>
          <div className="col-span-5 text-center py-3 tracking-widest flex items-center justify-center gap-2 truncate px-4">
            <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div> <span className="truncate">DESTINATION: {destName}</span>
          </div>
        </div>

        {/* Option Chain Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {predictionData.map((row, idx) => (
            <div key={idx} className="grid grid-cols-11 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group">
              
              {/* Origin Side (Left) */}
              <div className="col-span-5 grid grid-cols-4 items-center text-center py-4 text-sm text-slate-700 dark:text-slate-300">
                <div className={`font-medium ${row.origin.color}`}>{row.origin.risk}</div>
                <div className="font-mono text-slate-500 dark:text-slate-400">{row.origin.pv}</div>
                <div className="text-slate-500">{row.origin.wind}</div>
                <div className="flex items-center justify-center gap-2">
                  <span>{row.origin.cond}</span>
                  <row.origin.icon className={`h-4 w-4 ${row.origin.color}`} />
                </div>
              </div>
              
              {/* Center Column (Date/Strike) */}
              <div className="col-span-1 flex items-center justify-center py-4 bg-cyan-50 dark:bg-cyan-950/10 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-950/30 border-l border-r border-slate-200 dark:border-slate-800/50 font-bold text-slate-700 dark:text-slate-200 transition-colors duration-200">
                {row.date}
              </div>
              
              {/* Destination Side (Right) */}
              <div className="col-span-5 grid grid-cols-4 items-center text-center py-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-center gap-2">
                  <row.dest.icon className={`h-4 w-4 ${row.dest.color}`} />
                  <span>{row.dest.cond}</span>
                </div>
                <div className="text-slate-500">{row.dest.wind}</div>
                <div className="font-mono text-slate-500 dark:text-slate-400">{row.dest.pv}</div>
                <div className={`font-medium ${row.dest.color}`}>{row.dest.risk}</div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
      
      <div className="mt-6 text-xs text-slate-500 text-center">
        * Probability Value (PV) indicates the likelihood of the weather event causing operational delays at the port.
      </div>
    </div>
  );
}
