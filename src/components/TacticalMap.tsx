import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  Plane, 
  Train, 
  Anchor, 
  Compass, 
  Layers,
  Info,
  ShieldAlert
} from 'lucide-react';
import { Shipment, TriFactorPlan } from '../types';

interface TacticalMapProps {
  shipment: Shipment;
  selectedPlanKey: 'Plan A' | 'Plan B' | 'Plan C';
  onSelectPlan: (planKey: 'Plan A' | 'Plan B' | 'Plan C') => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  shipment,
  selectedPlanKey,
  onSelectPlan,
}) => {
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);

  // Global Chokepoints
  const chokepoints = [
    { name: 'Bab-el-Mandeb (Red Sea Threat)', coords: [560, 248], status: 'HOSTILE MISSILE ZONE', color: '#f43f5e' },
    { name: 'Suez Canal (Northbound Bottleneck)', coords: [540, 215], status: 'CONGESTED / WAR RISK', color: '#f59e0b' },
    { name: 'Strait of Hormuz', coords: [592, 225], status: 'PATROLLED', color: '#06b6d4' },
    { name: 'Panama Canal (Draft Restricted)', coords: [240, 260], status: '18d WAIT / DROUGHT', color: '#f43f5e' },
    { name: 'Strait of Malacca', coords: [735, 275], status: 'MONSOON SQUALLS', color: '#f59e0b' },
    { name: 'Cape of Good Hope (Detour Corridor)', coords: [535, 385], status: 'HIGH SWELLS (+12d)', color: '#38bdf8' },
  ];

  // Tactical route configurations based on active shipment
  const isShipment1 = shipment.id === 'SHIP-01'; // MV Thalassa (India to Rotterdam via Red Sea / Cape / Dubai)
  const isShipment2 = shipment.id === 'SHIP-02'; // Taiwan to Long Beach / Vancouver
  const isShipment3 = shipment.id === 'SHIP-03'; // Shanghai to Savannah / Manzanillo

  return (
    <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/30">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Tactical Nautical & Multimodal Corridor Map
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
            WGS84 AIS PROJECTION
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <button
            onClick={() => onSelectPlan('Plan A')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
              selectedPlanKey === 'Plan A'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-400 inline-block"></span>
            Plan A (Status Quo Danger)
          </button>
          <button
            onClick={() => onSelectPlan('Plan B')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
              selectedPlanKey === 'Plan B'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
            Plan B (Cape Detour)
          </button>
          <button
            onClick={() => onSelectPlan('Plan C')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
              selectedPlanKey === 'Plan C'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
            Plan C (Air/Rail Corridor)
          </button>
        </div>
      </div>

      {/* Interactive Tactical SVG Map Stage */}
      <div className="relative w-full h-80 sm:h-96 bg-[#070b12] rounded-lg border border-slate-800/80 overflow-hidden select-none">
        
        {/* Subtle Map Grid Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tacticalGrid)" />
        </svg>

        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Stylized Continent Background Contours */}
          <g fill="#121b29" stroke="#1e293b" strokeWidth="1" opacity="0.85">
            {/* North America */}
            <path d="M 120 80 Q 220 70 280 120 Q 290 180 240 240 Q 200 280 180 220 Q 140 180 120 80 Z" />
            {/* South America */}
            <path d="M 230 250 Q 320 280 300 380 Q 260 450 230 400 Q 200 320 230 250 Z" />
            {/* Europe */}
            <path d="M 460 90 Q 520 80 540 130 Q 520 170 470 170 Q 440 130 460 90 Z" />
            {/* Africa */}
            <path d="M 460 180 Q 540 170 560 250 Q 570 340 520 400 Q 460 380 440 280 Q 440 210 460 180 Z" />
            {/* Middle East & Asia */}
            <path d="M 540 140 Q 640 110 820 120 Q 860 190 840 280 Q 740 320 680 260 Q 600 240 540 140 Z" />
            {/* Australia */}
            <path d="M 780 340 Q 860 330 870 400 Q 800 420 770 380 Z" />
          </g>

          {/* SHIPMENT 1: MV Thalassa (Mumbai -> Rotterdam / Cape / Dubai) */}
          {isShipment1 && (
            <g>
              {/* Origin Marker: Mumbai JNPT (Coords: 660, 235) */}
              <circle cx="660" cy="235" r="5" fill="#38bdf8" stroke="#0B0F17" strokeWidth="2" />
              <text x="670" y="240" fill="#94a3b8" fontSize="10" fontFamily="monospace">Mumbai (JNPT)</text>

              {/* Destination Marker: Rotterdam (Coords: 480, 130) */}
              <circle cx="480" cy="130" r="5" fill="#10b981" stroke="#0B0F17" strokeWidth="2" />
              <text x="415" y="125" fill="#34d399" fontSize="10" fontFamily="monospace">Rotterdam / Frankfurt Hub</text>

              {/* Multimodal Hub Marker: Dubai (Coords: 605, 218) */}
              <circle cx="605" cy="218" r="5" fill="#06b6d4" stroke="#0B0F17" strokeWidth="2" />
              <text x="615" y="215" fill="#22d3ee" fontSize="10" fontFamily="monospace">Dubai (DWC Bio-Hub)</text>

              {/* Plan A: Red Sea / Bab-el-Mandeb Route (DANGER) */}
              <path
                d="M 660 235 Q 585 242 560 248 Q 545 230 535 210 Q 500 170 480 130"
                fill="none"
                stroke="#f43f5e"
                strokeWidth={selectedPlanKey === 'Plan A' ? 3.5 : 1.5}
                strokeDasharray="6 4"
                opacity={selectedPlanKey === 'Plan A' ? 1 : 0.4}
              />

              {/* Plan B: Cape of Good Hope Maritime Detour (AMBER) */}
              <path
                d="M 660 235 Q 640 310 590 380 Q 535 410 490 390 Q 420 300 450 180 Q 470 140 480 130"
                fill="none"
                stroke="#f59e0b"
                strokeWidth={selectedPlanKey === 'Plan B' ? 3.5 : 1.5}
                opacity={selectedPlanKey === 'Plan B' ? 1 : 0.4}
              />

              {/* Plan C: Sea-Air Multimodal Bridge (CYAN) */}
              {/* Maritime Leg: Mumbai -> Dubai */}
              <path
                d="M 660 235 Q 630 225 605 218"
                fill="none"
                stroke="#06b6d4"
                strokeWidth={selectedPlanKey === 'Plan C' ? 4 : 2}
                opacity={selectedPlanKey === 'Plan C' ? 1 : 0.6}
              />
              {/* Air Cargo Leg: Dubai -> Frankfurt/Rotterdam (Flight Arcs) */}
              <path
                d="M 605 218 Q 540 140 480 130"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={selectedPlanKey === 'Plan C' ? 3.5 : 1.5}
                strokeDasharray="4 2"
                opacity={selectedPlanKey === 'Plan C' ? 1 : 0.5}
              />

              {/* Current Vessel Position Marker: Gulf of Aden Approach (Coords: 585, 242) */}
              <g transform="translate(585, 242)" className="animate-pulse">
                <circle cx="0" cy="0" r="8" fill="rgba(6, 182, 212, 0.3)" />
                <circle cx="0" cy="0" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  MV Thalassa [19.4 kts]
                </text>
              </g>

              {/* Air Charter Plane Graphic on Plan C */}
              {selectedPlanKey === 'Plan C' && (
                <g transform="translate(535, 170) rotate(-45)">
                  <polygon points="0,-6 4,4 0,2 -4,4" fill="#38bdf8" />
                  <text x="8" y="0" fill="#38bdf8" fontSize="9" fontFamily="monospace">Bio-Air Charter</text>
                </g>
              )}
            </g>
          )}

          {/* SHIPMENT 2: CMA CGM Titan (Taiwan -> Long Beach / Vancouver) */}
          {isShipment2 && (
            <g>
              {/* Origin: Kaohsiung */}
              <circle cx="790" cy="210" r="5" fill="#38bdf8" />
              <text x="730" y="205" fill="#94a3b8" fontSize="10">Kaohsiung</text>

              {/* Destination: Long Beach */}
              <circle cx="190" cy="180" r="5" fill="#f43f5e" />
              <text x="120" y="175" fill="#f43f5e" fontSize="10">Long Beach (28% Tariff)</text>

              {/* Alternate FTZ: Vancouver */}
              <circle cx="180" cy="140" r="5" fill="#10b981" />
              <text x="110" y="135" fill="#34d399" fontSize="10">Vancouver FTZ + Rail</text>

              {/* Plan A: Transpacific to LA */}
              <path
                d="M 790 210 Q 860 170 940 180"
                fill="none"
                stroke="#f43f5e"
                strokeWidth={selectedPlanKey === 'Plan A' ? 3.5 : 1.5}
                strokeDasharray="6 4"
              />
              <path
                d="M 60 180 Q 120 180 190 180"
                fill="none"
                stroke="#f43f5e"
                strokeWidth={selectedPlanKey === 'Plan A' ? 3.5 : 1.5}
                strokeDasharray="6 4"
              />

              {/* Plan C: Divert to Vancouver + Bonded Rail to US */}
              <path
                d="M 790 210 Q 870 150 940 140"
                fill="none"
                stroke="#06b6d4"
                strokeWidth={selectedPlanKey === 'Plan C' ? 4 : 2}
              />
              <path
                d="M 60 140 Q 120 135 180 140"
                fill="none"
                stroke="#06b6d4"
                strokeWidth={selectedPlanKey === 'Plan C' ? 4 : 2}
              />
              {/* Express Rail to Midwest/LA */}
              <path
                d="M 180 140 L 190 180"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />

              {/* Current Vessel */}
              <g transform="translate(830, 195)">
                <circle cx="0" cy="0" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">CMA CGM Titan</text>
              </g>
            </g>
          )}

          {/* SHIPMENT 3: Ever Vanguard (Shanghai -> Savannah / Manzanillo Rail) */}
          {isShipment3 && (
            <g>
              <circle cx="780" cy="180" r="5" fill="#38bdf8" />
              <text x="720" y="175" fill="#94a3b8" fontSize="10">Shanghai</text>

              <circle cx="240" cy="260" r="5" fill="#f43f5e" />
              <text x="250" y="265" fill="#f43f5e" fontSize="10">Panama (Drought Wait)</text>

              <circle cx="180" cy="240" r="5" fill="#10b981" />
              <text x="90" y="235" fill="#34d399" fontSize="10">Manzanillo Rail Port</text>

              <circle cx="260" cy="180" r="5" fill="#10b981" />
              <text x="270" y="180" fill="#34d399" fontSize="10">Savannah Hub</text>

              {/* Vessel */}
              <g transform="translate(195, 255)">
                <circle cx="0" cy="0" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">Ever Vanguard</text>
              </g>
            </g>
          )}

          {/* Render Chokepoint Risk Threat Zones */}
          {chokepoints.map((choke, idx) => (
            <g
              key={idx}
              transform={`translate(${choke.coords[0]}, ${choke.coords[1]})`}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredWaypoint(choke.name)}
              onMouseLeave={() => setHoveredWaypoint(null)}
            >
              {/* Radar pulse ring */}
              <circle cx="0" cy="0" r="10" fill="none" stroke={choke.color} strokeWidth="1" className="animate-ping opacity-60" />
              <circle cx="0" cy="0" r="4" fill={choke.color} stroke="#0B0F17" strokeWidth="1.5" />
            </g>
          ))}
        </svg>

        {/* Hovered Chokepoint Tooltip Overlay */}
        {hoveredWaypoint && (
          <div className="absolute top-3 left-3 bg-slate-900/95 border border-slate-700 text-xs text-white p-2.5 rounded-lg shadow-xl backdrop-blur-sm pointer-events-none">
            <span className="font-bold text-rose-400 block flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {hoveredWaypoint}
            </span>
            <span className="text-[11px] text-slate-300">
              Active Maritime Security & Capacity Advisory in Effect
            </span>
          </div>
        )}

        {/* Tactical Map Footer Information Strip */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 px-3 py-1.5 rounded text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">TARGET CORRIDOR:</span>
            <span className="font-bold text-white">
              {shipment.plans[selectedPlanKey === 'Plan A' ? 'planA' : selectedPlanKey === 'Plan B' ? 'planB' : 'planC'].title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>CHOKEPOINT RISK: <strong className="text-rose-400">{shipment.chokepointRisk}</strong></span>
            <span>CURRENT LAT/LNG: <strong className="text-cyan-300">{shipment.currentCoords[0]}°N, {shipment.currentCoords[1]}°E</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
