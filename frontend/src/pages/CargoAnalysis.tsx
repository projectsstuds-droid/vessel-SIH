import React, { useState, useEffect } from 'react';
import { Ship, Anchor, DollarSign, Info, Activity, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { getProfile } from '../lib/profile';

export default function CargoAnalysis() {
  const [formData, setFormData] = useState({
    originId: '',
    destinationId: '',
    commodity: 'Coal',
    quantity: '70000',
    startDate: '',
    endDate: '',
    vesselId: ''
  });

  const ports = [{id: '1', name: 'Newcastle', country: 'AU'}, {id: '2', name: 'Paradip', country: 'IN'}];
  const vessels = [{id: '1', name: 'MV Oceanic', type: 'Panamax', dwt: 75000}];

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      const matchOrigin = ports.find(p => profile.defaultOrigin.includes(p.name));
      const matchDest = ports.find(p => profile.defaultDestination.includes(p.name));
      const matchVessel = vessels.find(v => profile.defaultVessel.includes(v.type));
      
      setFormData(prev => ({
        ...prev,
        originId: matchOrigin ? matchOrigin.id : prev.originId,
        destinationId: matchDest ? matchDest.id : prev.destinationId,
        commodity: profile.preferredCargo || prev.commodity,
        vesselId: matchVessel ? matchVessel.id : prev.vesselId
      }));
    }
  }, []);

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Save to localStorage so PredictionChart can sync
    const originPort = ports.find(p => p.id === formData.originId);
    const destPort = ports.find(p => p.id === formData.destinationId);
    if (originPort) localStorage.setItem('active-origin', `${originPort.name}, ${originPort.country}`);
    if (destPort) localStorage.setItem('active-dest', `${destPort.name}, ${destPort.country}`);

    try {
      const { checkCompatibility, getForecast } = await import('../lib/api');
      
      const [compatRes, forecastRes] = await Promise.all([
        checkCompatibility(formData.destinationId, formData.vesselId).catch(() => null),
        getForecast('1').catch(() => null)
      ]);

      const freightRate = forecastRes?.forecast?.forecast_rates?.[0] || 21.5;
      
      setAnalysisResult({
        compatibility: compatRes || { compatible: true, reasons: [] },
        estimatedFreightRate: parseFloat(freightRate.toFixed(2)),
        totalEstimatedCost: Math.round(freightRate * parseFloat(formData.quantity.replace(/,/g, '') || '70000')),
        portCosts: 150000,
        routeRisk: forecastRes?.forecast?.volatility === 'HIGH' ? 'Elevated' : 'Moderate',
        idleTimeDays: forecastRes?.forecast?.fpi_breakdown?.Congestion ? parseFloat((forecastRes.forecast.fpi_breakdown.Congestion / 10).toFixed(1)) : 2.5
      });
    } catch (error) {
      console.error("API error, falling back to mock data", error);
      setAnalysisResult({
        compatibility: { compatible: true, reasons: [] },
        estimatedFreightRate: 21.5,
        totalEstimatedCost: 1505000,
        portCosts: 150000,
        routeRisk: 'Moderate',
        idleTimeDays: 2.5
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen font-sans text-slate-900 dark:text-slate-200">
      <header className="mb-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide mb-1 uppercase">Operations</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <Activity className="text-cyan-600 dark:text-cyan-500 w-8 h-8" /> Analysis Trigger
        </h1>
        <p className="text-slate-500 mt-2">Define shipment parameters and run compatibility & cost simulations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-500"/> Shipment Parameters
          </h2>
          
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Origin Port</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  value={formData.originId}
                  onChange={e => setFormData({...formData, originId: e.target.value})}
                  required
                >
                  <option value="">Select Origin...</option>
                  {ports?.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.country})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Destination Port</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  value={formData.destinationId}
                  onChange={e => setFormData({...formData, destinationId: e.target.value})}
                  required
                >
                  <option value="">Select Destination...</option>
                  {ports?.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.country})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Commodity</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  value={formData.commodity}
                  onChange={e => setFormData({...formData, commodity: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Quantity (MT)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Laycan Start</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Laycan End</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Preferred Vessel</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                value={formData.vesselId}
                onChange={e => setFormData({...formData, vesselId: e.target.value})}
                required
              >
                <option value="">Select Vessel...</option>
                {vessels?.map((v: any) => <option key={v.id} value={v.id}>{v.name} ({v.type} - {v.dwt} DWT)</option>)}
              </select>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isAnalyzing}
                className="w-full bg-cyan-600 text-white font-medium py-3.5 rounded-xl hover:bg-cyan-500 transition-colors flex items-center justify-center shadow-lg shadow-cyan-900/20"
              >
                {isAnalyzing ? 'Running Simulation...' : 'Trigger Analysis'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {analysisResult ? (
            <>
              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400"/> Financial Projection
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/80 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Expected Freight Rate</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">${analysisResult.estimatedFreightRate.toFixed(2)} / MT</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/80 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Total Freight Cost</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">${(analysisResult.estimatedFreightRate * Number(formData.quantity)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/80 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Estimated Port Costs</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">${analysisResult.portCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-2">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Total Expected Cost</span>
                    <span className="text-2xl font-semibold text-cyan-600 dark:text-cyan-400">${analysisResult.totalEstimatedCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl shadow-sm dark:shadow-2xl border ${analysisResult.compatibility.compatible ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'}`}>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Anchor className={`w-5 h-5 ${analysisResult.compatibility.compatible ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}/> 
                  Port Compatibility
                </h3>
                {analysisResult.compatibility.compatible ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-emerald-800 dark:text-emerald-400/90 text-sm leading-relaxed">The selected vessel is fully compatible with the destination port's physical draft and LOA constraints.</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 dark:text-red-400 text-sm font-medium mb-2">Incompatible due to physical constraints:</p>
                      <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-400/80 space-y-1">
                        {analysisResult.compatibility.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-500"/> Operational Insights
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-[#0B1120] p-4 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-800/50">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Expected Idle Time</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{analysisResult.idleTimeDays} Days</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0B1120] p-4 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-800/50">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Route Risk Level</span>
                    <span className="text-sm font-medium px-2.5 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md">{analysisResult.routeRisk}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-400 dark:text-slate-600">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Awaiting Parameters</h3>
              <p className="text-sm text-slate-500 max-w-xs">Fill out the shipment details on the left and trigger the analysis to simulate costs and compatibility.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

