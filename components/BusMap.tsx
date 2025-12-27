
import React, { useEffect, useRef, useState } from 'react';
import { BusStop, LiveBus, CrowdLevel, BusRoute } from '../types';
import { MAP_COLORS, CHENNAI_CENTER } from '../constants';
import { getBusLocationInsight } from '../services/geminiService';

declare const L: any;

interface BusMapProps {
  stops: BusStop[];
  buses: LiveBus[];
  routes: BusRoute[];
  selectedBus: LiveBus | null;
  onBusClick: (bus: LiveBus) => void;
  onCloseTracking: () => void;
}

const BusMap: React.FC<BusMapProps> = ({ stops, buses, routes, selectedBus, onBusClick, onCloseTracking }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);
  const [insight, setInsight] = useState<{ text: string; links: { title: string; uri: string }[] } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [CHENNAI_CENTER.lat, CHENNAI_CENTER.lng],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing bus markers
    Object.keys(markersRef.current).forEach(id => {
      if (!buses.find(b => b.id === id)) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    // Add/Update bus markers
    buses.forEach(bus => {
      const color = MAP_COLORS[bus.crowdLevel];
      const isSelected = selectedBus?.id === bus.id;
      
      const customIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div class="relative flex items-center justify-center transition-all duration-500" style="transform: ${isSelected ? 'scale(1.3)' : 'scale(1)'}">
            ${isSelected ? '<div class="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>' : ''}
            <div class="w-10 h-10 rounded-xl border-2 border-white/20 shadow-2xl flex items-center justify-center font-black text-white relative z-10 overflow-hidden" 
                 style="background-color: ${color}; transform: rotate(45deg)">
                 <div class="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                 <span style="transform: rotate(-45deg)" class="text-[10px]">${bus.routeNumber}</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      if (markersRef.current[bus.id]) {
        markersRef.current[bus.id].setLatLng([bus.currentLocation.lat, bus.currentLocation.lng]);
        markersRef.current[bus.id].setIcon(customIcon);
      } else {
        const marker = L.marker([bus.currentLocation.lat, bus.currentLocation.lng], { icon: customIcon })
          .addTo(mapRef.current)
          .on('click', () => onBusClick(bus));
        markersRef.current[bus.id] = marker;
      }
    });

    // Add Stop Markers (only at higher zoom levels)
    stops.forEach(stop => {
      const stopIcon = L.divIcon({
        className: 'stop-marker',
        html: `<div class="w-2 h-2 bg-slate-400 rounded-full border border-slate-900 opacity-60"></div>`,
        iconSize: [8, 8]
      });
      L.marker([stop.location.lat, stop.location.lng], { icon: stopIcon, interactive: false }).addTo(mapRef.current);
    });

  }, [buses, selectedBus, stops]);

  // Handle Selection & Route Visualization
  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedBus) {
      const activeRoute = routes.find(r => r.number === selectedBus.routeNumber);
      if (activeRoute) {
        const routeCoords = activeRoute.stops
          .map(sid => {
            const s = stops.find(stop => stop.id === sid);
            return s ? [s.location.lat, s.location.lng] : null;
          })
          .filter(c => c !== null);

        if (polylineRef.current) mapRef.current.removeLayer(polylineRef.current);
        
        polylineRef.current = L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.6,
          dashArray: '10, 10',
          lineCap: 'round'
        }).addTo(mapRef.current);

        mapRef.current.flyTo([selectedBus.currentLocation.lat, selectedBus.currentLocation.lng], 15, {
          animate: true,
          duration: 1.5
        });

        // Fetch AI Insight
        const nextStop = stops.find(s => s.id === selectedBus.nextStopId);
        if (nextStop) {
          setLoadingInsight(true);
          getBusLocationInsight(selectedBus, nextStop).then(res => {
            setInsight(res);
            setLoadingInsight(false);
          });
        }
      }
    } else {
      if (polylineRef.current) mapRef.current.removeLayer(polylineRef.current);
      setInsight(null);
    }
  }, [selectedBus]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <div ref={mapContainerRef} className="flex-1 w-full bg-slate-950 z-10" />
      
      {/* TACTICAL OVERLAY */}
      <div className="absolute top-4 left-4 z-[100] pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mono">Tactical_Grid_Online</span>
          </div>
        </div>
      </div>

      {/* TELEMETRY HUD */}
      {selectedBus && (
        <div className="absolute bottom-6 inset-x-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-slate-950/90 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10 p-6 ring-1 ring-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-500/40">
                  {selectedBus.routeNumber}
                </div>
                <div>
                  <h3 className="font-black text-white text-xl tracking-tighter mb-1 uppercase mono">Asset Tracking: {selectedBus.id.slice(-4)}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    Heading: {stops.find(s => s.id === selectedBus.nextStopId)?.name}
                  </p>
                </div>
              </div>
              <button onClick={onCloseTracking} className="w-10 h-10 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl flex items-center justify-center transition-all border border-white/10">✕</button>
            </div>

            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs">📡</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mono">Neural_Spatial_Stream</span>
              </div>
              {loadingInsight ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-2 w-full bg-white/5 rounded"></div>
                  <div className="h-2 w-2/3 bg-white/5 rounded"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 font-medium italic leading-relaxed">"{insight?.text}"</p>
                  <div className="flex flex-wrap gap-2">
                    {insight?.links.map((link, idx) => (
                      <a key={idx} href={link.uri} target="_blank" rel="noreferrer" className="bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all">MAPS: {link.title}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusMap;
