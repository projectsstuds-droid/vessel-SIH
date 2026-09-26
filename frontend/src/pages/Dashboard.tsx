import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Ship, TrendingUp, AlertCircle, Info, Calendar, MapPin, Anchor } from 'lucide-react';
import { getProfile } from '../lib/profile';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profile = getProfile();
    setUserProfile(profile);

    const simulatedRoute = `${profile.defaultOrigin} to ${profile.defaultDestination}`;
    const simulatedVessel = profile.defaultVessel;
    
    import('../lib/api').then(({ getForecast }) => {
      // Pass a dummy routeId like '1' since our DB is currently mocked
      getForecast('1').then(res => {
        // Map the real ML response to the chart format
        const chartData: any[] = [];
        
        // Add historical points (we'll just use the mock dates generated in backend)
        const today = new Date();
        for (let i = 4; i > 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i * 7);
          chartData.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            rate: parseFloat((18 + Math.random() * 2).toFixed(2)),
            type: 'historical'
          });
        }
        
        // Add forecast points from ML model
        res.forecast.forecast_dates.forEach((dateStr: string, idx: number) => {
          const d = new Date(dateStr);
          chartData.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            rate: parseFloat(res.forecast.forecast_rates[idx].toFixed(2)),
            type: idx === 0 ? 'current' : 'forecast'
          });
        });

        setData({
          route: simulatedRoute,
          vessel: simulatedVessel,
          cargo: profile.preferredCargo,
          fpi: { 
            score: Math.round(res.forecast.fpi_score) || 72, 
            trend: res.forecast.direction === 'UPWARD' ? 'Rising' : 'Falling', 
            status: res.forecast.volatility === 'HIGH' ? 'Elevated Risk' : 'Stable' 
          },
          fpiBreakdown: { 
            Demand: res.forecast.fpi_breakdown.Demand || 18, 
            Supply: res.forecast.fpi_breakdown.Supply || -11, 
            Utilization: res.forecast.fpi_breakdown.Utilization || 14, 
            Congestion: res.forecast.fpi_breakdown.Congestion || 12 
          },
          forecast: chartData,
          scenarios: [
            { name: "CHARTER NOW", freight: `$${chartData[chartData.length - 3].rate} / MT`, cost: "Optimal", risk: "Low", recommended: res.forecast.direction === 'UPWARD' },
            { name: "WAIT 7 DAYS", freight: `$${chartData[chartData.length - 2].rate} / MT`, cost: "Avg", risk: "Moderate", recommended: res.forecast.direction === 'STABLE' },
            { name: "WAIT 14 DAYS", freight: `$${chartData[chartData.length - 1].rate} / MT`, cost: "High", risk: "Elevated", recommended: res.forecast.direction === 'DOWNWARD' }
          ]
        });
        setLoading(false);
      }).catch(err => {
        console.error("API error, falling back to mock data:", err);
        // Fallback mock data to prevent white screen crash if backend is unreachable
        setData({
          route: simulatedRoute,
          vessel: simulatedVessel,
          cargo: profile.preferredCargo,
          fpi: { score: 72, trend: 'Rising', status: 'Elevated Pressure' },
          fpiBreakdown: { Demand: 18, Supply: -11, Utilization: 14, Congestion: 12 },
          forecast: [
            { date: 'Aug 01', rate: 18.5, type: 'historical' },
            { date: 'Aug 15', rate: 19.2, type: 'historical' },
            { date: 'Sep 01', rate: 21.0, type: 'historical' },
            { date: 'Sep 17', rate: 21.5, type: 'current' },
            { date: 'Oct 01', rate: 23.4, type: 'forecast' },
            { date: 'Oct 15', rate: 24.8, type: 'forecast' },
          ],
          scenarios: [
            { name: "CHARTER NOW", freight: "$21.5 / MT", cost: "Optimal", risk: "Low", recommended: true },
            { name: "WAIT 7 DAYS", freight: "$23.4 / MT", cost: "Avg", risk: "Moderate", recommended: false },
            { name: "WAIT 14 DAYS", freight: "$24.8 / MT", cost: "High", risk: "Elevated", recommended: false }
          ]
        });
        setLoading(false);
      });
    });
  }, []);

  if (loading || !userProfile) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center text-slate-500 dark:text-slate-400">Loading AI Models...</div>;
  }

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.fpi.score / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
      
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide mb-1 uppercase">Market Observation</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <MapPin className="text-cyan-600 dark:text-cyan-500 w-6 h-6" /> {data.route}
          </h1>
          <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
             Tracking defaults for <span className="text-cyan-600 dark:text-cyan-400 font-medium">{userProfile.name}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase mb-1">Vessel Class</p>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{data.vessel}</p>
          </div>
          <div className="w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase mb-1">Cargo</p>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{data.cargo}</p>
          </div>
          <div className="w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase mb-1">Model Status</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 justify-end"><div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div> Online</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-cyan-600 dark:text-cyan-500 w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">Freight Pressure Index</h2>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                  <circle 
                    cx="64" cy="64" r={radius} 
                    stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    className="text-cyan-500 transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-light text-slate-900 dark:text-white">{data.fpi.score}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">High</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{data.fpi.status}</p>
                <p className="text-cyan-600 dark:text-cyan-500 text-sm mt-1 flex items-center justify-end gap-1">
                  ↑ {data.fpi.trend}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-transparent">
              <span className="font-semibold text-slate-900 dark:text-white">Why is this happening?</span><br/>
              Demand pressure (+{data.fpiBreakdown.Demand}) and rising port congestion (+{data.fpiBreakdown.Congestion}) are currently outpacing available vessel supply on the {data.route} route, creating an upward pressure on freight rates.
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl transition-colors">
             <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-amber-500 w-5 h-5" />
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">Risk Summary</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Weather (Route specific)</span>
                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 rounded-md font-medium">Moderate</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Port Congestion ({userProfile.defaultDestination})</span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-md font-medium">Elevated</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Vessel Availability</span>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-md font-medium">Normal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl h-80 flex flex-col transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <Ship className="text-cyan-600 dark:text-cyan-500 w-5 h-5" /> Freight Forecast Model
              </h2>
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></div> Historical</span>
                <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400"><div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></div> AI Projection</span>
              </div>
            </div>
            
            <div className="flex-grow w-full h-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.forecast}>
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <ReferenceLine x="Sep 17" stroke="#cbd5e1" className="dark:stroke-slate-600" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#0ea5e9" 
                    strokeWidth={4} 
                    dot={{ fill: '#ffffff', stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#0ea5e9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl transition-colors">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Calendar className="text-cyan-600 dark:text-cyan-500 w-5 h-5" /> Charter Timing Decision Support
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.scenarios.map((scenario: any, idx: number) => (
                <div key={idx} className={`relative p-5 rounded-2xl border transition-all ${scenario.recommended ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-500/50 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'}`}>
                  {scenario.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-[#0B1120] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Recommended
                    </div>
                  )}
                  <h3 className="text-slate-800 dark:text-slate-300 font-medium text-sm mb-4">{scenario.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="flex justify-between items-end">
                      <span className="text-slate-500 text-xs">Est. Freight</span>
                      <span className="text-slate-900 dark:text-white font-medium">{scenario.freight}</span>
                    </p>
                    <p className="flex justify-between items-end">
                      <span className="text-slate-500 text-xs">Total Cost</span>
                      <span className="text-slate-900 dark:text-white font-medium">{scenario.cost}</span>
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Risk Exposure</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                      scenario.risk === 'Low' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                      scenario.risk === 'Moderate' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}>
                      {scenario.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              Due to upward freight momentum and incoming port congestion at {userProfile.defaultDestination}, chartering earlier currently reduces expected total cost exposure for {userProfile.defaultVessel}s.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
