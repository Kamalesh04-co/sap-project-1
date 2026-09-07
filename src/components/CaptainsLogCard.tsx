import React, { useState } from 'react';
import { 
  Fuel, 
  Droplet, 
  Users, 
  Gauge, 
  Thermometer, 
  Compass, 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Zap,
  Plus
} from 'lucide-react';
import { Shipment, CaptainsLogEntry } from '../types';

interface CaptainsLogCardProps {
  shipment: Shipment;
  onAddLogEntry?: (text: string, level: 'INFO' | 'WARN' | 'DANGER') => void;
}

export const CaptainsLogCard: React.FC<CaptainsLogCardProps> = ({ shipment, onAddLogEntry }) => {
  const [newLogText, setNewLogText] = useState('');
  const [newLogLevel, setNewLogLevel] = useState<'INFO' | 'WARN' | 'DANGER'>('INFO');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;
    if (onAddLogEntry) {
      onAddLogEntry(newLogText.trim(), newLogLevel);
    }
    setNewLogText('');
    setIsAdding(false);
  };

  const coldChain = shipment.coldChain;

  return (
    <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Compass className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                Captain's Resource & Telemetry Log
                <span className="px-2 py-0.2 text-[9px] bg-slate-800 text-slate-300 rounded font-mono">
                  {shipment.vesselName} ({shipment.imo})
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Onboard consumables, fuel endurance, and reefer thermal integrity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>SAT-AIS: {shipment.speedKnots} kts / {shipment.heading}°</span>
          </div>
        </div>

        {/* Tactical Resource Gauges Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-3.5">
          {/* Bunker Fuel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Fuel className="w-3 h-3 text-cyan-400" />
                VLSFO Bunker
              </span>
              <span className="font-mono font-bold text-slate-200">{shipment.bunkerFuelPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full ${shipment.bunkerFuelPercent > 40 ? 'bg-cyan-400' : 'bg-rose-500'}`}
                style={{ width: `${shipment.bunkerFuelPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Endurance: 18.5 Days</span>
          </div>

          {/* Fresh Water */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-cyan-400" />
                Freshwater
              </span>
              <span className="font-mono font-bold text-slate-200">{shipment.freshWaterPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${shipment.freshWaterPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Reverse Osmosis Active</span>
          </div>

          {/* Crew Provisions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                Provisions
              </span>
              <span className="font-mono font-bold text-emerald-400">{shipment.crewProvisionsDays}d</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${Math.min(100, shipment.crewProvisionsDays * 3.5)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">22 Souls Onboard</span>
          </div>
        </div>

        {/* Cold-Chain & Reefer Temperature Integrity Sub-Card */}
        {coldChain.required ? (
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-lg p-3 mb-3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Thermometer className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Cold-Chain Reefer Bank #4 (Pharma Grade)</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                GENSET #2 ONLINE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
              <div className="bg-slate-900/60 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">Current Core Temp</span>
                <span className="text-base font-black font-mono text-cyan-300">
                  {coldChain.currentTempC}°C
                </span>
              </div>
              <div className="bg-slate-900/60 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">Target Safe Band</span>
                <span className="text-xs font-bold font-mono text-emerald-400">
                  {coldChain.minTempC}°C to {coldChain.maxTempC}°C
                </span>
              </div>
              <div className="bg-slate-900/60 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">Ambient Sea/Air</span>
                <span className="text-xs font-bold font-mono text-rose-300">
                  +{coldChain.ambientTempC}°C (Hot)
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>Shore-Power Ready: <strong className="text-emerald-300">YES (440V / 60Hz)</strong></span>
              <span>Battery Reserve: <strong className="text-slate-200">{coldChain.batteryReserveHours}h Available</strong></span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-2.5 mb-3 text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Standard Dry Cargo Telemetry: Ambient monitored at {coldChain.currentTempC}°C (No cold-chain requirement).</span>
          </div>
        )}

        {/* Chronological Log Feed */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {shipment.captainsLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded border text-xs leading-relaxed flex items-start gap-2 ${
                log.level === 'DANGER'
                  ? 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                  : log.level === 'WARN'
                  ? 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                [{log.timestamp}]
              </span>
              <p className="flex-1 text-[11px]">{log.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Log Entry Row */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs">
        {isAdding ? (
          <form onSubmit={handleAdd} className="w-full flex gap-2">
            <select
              value={newLogLevel}
              onChange={(e) => setNewLogLevel(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1"
            >
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="DANGER">DANGER</option>
            </select>
            <input
              type="text"
              placeholder="Record bridge observation or VHF update..."
              value={newLogText}
              onChange={(e) => setNewLogText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-cyan-500 text-slate-950 text-xs font-bold rounded"
            >
              Log
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-slate-500">
              Vessel Log Certified by Nautical Master
            </span>
            <button
              onClick={() => setIsAdding(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Manual Bridge Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
