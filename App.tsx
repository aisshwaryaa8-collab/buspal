
import React, { useState, useEffect, useMemo } from 'react';
import { BusStop, LiveBus, BusRoute, CrowdLevel } from './types';
import { getBusStops, getLiveBusLocations, getBusRoutes, getNearestStops } from './services/mockApi';
import Layout from './components/Layout';
import BusMap from './components/BusMap';
import GeminiAssistant from './components/GeminiAssistant';
import { predictCrowdWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [stops, setStops] = useState<BusStop[]>([]);
  const [buses, setBuses] = useState<LiveBus[]>([]);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [predictions, setPredictions] = useState<Record<string, any>>({});
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedBus, setSelectedBus] = useState<LiveBus | null>(null);

  const [sourceId, setSourceId] = useState<string>('');
  const [destId, setDestId] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [s, b, r] = await Promise.all([getBusStops(), getLiveBusLocations(), getBusRoutes()]);
      setStops(s);
      setBuses(b);
      setRoutes(r);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }
    };
    init();

    const timer = setInterval(async () => {
      const b = await getLiveBusLocations();
      setBuses(b);
      if (selectedBus) {
        const updated = b.find(bus => bus.id === selectedBus.id);
        if (updated) setSelectedBus(updated);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [selectedBus?.id]);

  const detectNearestStop = () => {
    if (!userLocation) {
      alert("Awaiting GPS Signal...");
      return;
    }
    setIsLocating(true);
    setTimeout(() => {
      const nearest = getNearestStops(userLocation.lat, userLocation.lng);
      if (nearest.length > 0) {
        setSourceId(nearest[0].id);
      }
      setIsLocating(false);
    }, 800);
  };

  const handlePredict = (e: React.MouseEvent, routeNum: string) => {
    e.stopPropagation();
    if (predictions[routeNum]) return;
    predictCrowdWithGemini(routeNum, "Tactical Peak", false, "Standard Metropolitan Flow").then(res => {
      setPredictions(prev => ({ ...prev, [routeNum]: res }));
    });
  };

  const handleBusSelection = (bus: LiveBus) => {
    setSelectedBus(bus);
    setActiveTab('map');
  };

  const foundRoutes = useMemo(() => {
    if (!sourceId || !destId) return [];
    return routes.filter(route => {
      const sIdx = route.stops.indexOf(sourceId);
      const dIdx = route.stops.indexOf(destId);
      return sIdx !== -1 && dIdx !== -1 && sIdx < dIdx;
    });
  }, [sourceId, destId, routes]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="p-6 space-y-10 pb-32 max-w-4xl mx-auto">
          
          {/* NAVIGATION MODULE */}
          <section className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-1000"></div>
            
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] mono">Tactical_Navigator</h2>
            </div>
            
            <div className="space-y-8 relative">
              {/* CURRENT LOCATION */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mono">Current_Location</label>
                  <button 
                    onClick={detectNearestStop}
                    className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${isLocating ? 'text-blue-500 animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}
                  >
                    {isLocating ? 'Scanning GPS...' : '📍 Auto-Detect Nearest'}
                  </button>
                </div>
                <div className="relative">
                  <select 
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-5 text-white text-base font-bold appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer shadow-inner"
                  >
                    <option value="">WHERE ARE YOU NOW?</option>
                    {stops.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name.toUpperCase()}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500/50">▽</div>
                </div>
              </div>

              {/* CONNECTING LINE VISUAL */}
              <div className="flex justify-center -my-6 relative z-10">
                <div className="h-10 w-px bg-gradient-to-b from-blue-500 via-slate-700 to-red-500" />
              </div>

              {/* DESTINATION */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mono">Destination</label>
                <div className="relative">
                  <select 
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-5 text-white text-base font-bold appearance-none outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/10 transition-all cursor-pointer shadow-inner"
                  >
                    <option value="">WHERE TO?</option>
                    {stops.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name.toUpperCase()}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-red-500/50">▽</div>
                </div>
              </div>
            </div>

            {sourceId && destId && (
              <div className="mt-12 pt-10 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6 mono text-center">Tactical_Route_Matches</h3>
                <div className="space-y-3">
                  {foundRoutes.length > 0 ? foundRoutes.map(route => {
                    const liveBus = buses.find(b => b.routeNumber === route.number);
                    return (
                      <div 
                        key={route.id} 
                        onClick={() => liveBus && handleBusSelection(liveBus)} 
                        className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2rem] transition-all cursor-pointer group/card active:scale-95"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover/card:border-blue-500/50 transition-all shadow-xl">
                            <span className="text-[8px] font-black text-blue-500">UNIT</span>
                            <span className="text-xl font-black mono">{route.number}</span>
                          </div>
                          <div>
                            <p className="font-black text-white text-lg tracking-tight mb-0.5">{route.name}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mono">{liveBus ? 'Uplink_Confirmed' : 'Seeking_Asset'}</p>
                          </div>
                        </div>
                        {liveBus && (
                          <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                            liveBus.crowdLevel === CrowdLevel.LOW ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            liveBus.crowdLevel === CrowdLevel.MEDIUM ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {liveBus.crowdLevel}
                          </div>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="p-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mono border-2 border-dashed border-white/5 rounded-[2rem]">
                      No_Direct_Path_Found
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* FLEET STATUS GRID */}
          <section>
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-slate-700 rounded-full"></div>
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mono">Active_Grid_Units</h2>
              </div>
              <span className="text-[9px] font-black text-slate-700 mono">Uplinks: {buses.length}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {buses.map(bus => (
                <div 
                  key={bus.id} 
                  onClick={() => handleBusSelection(bus)} 
                  className="bg-slate-900/30 p-8 rounded-[3rem] border border-white/5 transition-all hover:bg-slate-900/50 hover:shadow-2xl hover:shadow-blue-900/10 group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <div className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] mono inline-block mb-4">Route_{bus.routeNumber}</div>
                      <h3 className="font-black text-white text-xl tracking-tighter leading-tight group-hover:text-blue-500 transition-colors">
                        {routes.find(r => r.number === bus.routeNumber)?.name || 'Fleet Service'}
                      </h3>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border border-white/5 ${
                      bus.crowdLevel === CrowdLevel.LOW ? 'text-emerald-400 bg-emerald-500/10' : 
                      bus.crowdLevel === CrowdLevel.MEDIUM ? 'text-amber-400 bg-amber-500/10' : 
                      'text-red-400 bg-red-500/10'
                    }`}>
                      {bus.crowdLevel}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <button onClick={(e) => handlePredict(e, bus.routeNumber)} className="bg-blue-600/80 hover:bg-blue-600 text-white text-[9px] font-black px-5 py-2.5 rounded-2xl transition-all uppercase tracking-widest shadow-lg shadow-blue-900/20 mono">Predict_Load</button>
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest mono">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Sync_Live
                    </div>
                  </div>

                  {predictions[bus.routeNumber] && (
                    <div className="mt-6 p-6 bg-blue-600/5 rounded-[2rem] border border-blue-500/10 text-xs text-blue-100 animate-in zoom-in-95 duration-500">
                      <p className="font-bold italic opacity-80 leading-relaxed text-xs">"{predictions[bus.routeNumber].reasoning}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'map' && (
        <BusMap stops={stops} buses={buses} routes={routes} selectedBus={selectedBus} onBusClick={handleBusSelection} onCloseTracking={() => setSelectedBus(null)} />
      )}

      {activeTab === 'ai' && (
        <GeminiAssistant context={{ buses, stops, routes }} />
      )}
    </Layout>
  );
};

export default App;
