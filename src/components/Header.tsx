import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Compass, 
  Activity, 
  RefreshCw, 
  Radio, 
  FileText, 
  AlertTriangle,
  Zap,
  Package,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  UserCheck
} from 'lucide-react';
import { Shipment, UserOfficer } from '../types';

interface HeaderProps {
  shipments: Shipment[];
  selectedShipment: Shipment;
  onSelectShipment: (shipment: Shipment) => void;
  onOpenReport: () => void;
  onOpenEmergencyProcurement: () => void;
  onOpenAuthorize: () => void;
  currentUser?: UserOfficer | null;
  onOpenSecurityProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  shipments,
  selectedShipment,
  onSelectShipment,
  onOpenReport,
  onOpenEmergencyProcurement,
  onOpenAuthorize,
  currentUser,
  onOpenSecurityProfile,
  onLogout,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0B0F17] border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <Compass className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-['JetBrains_Mono',monospace]">
                  ResilientRoute<span className="text-cyan-400">.AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                  Autonomous Core v4.8
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  DEFCON 2 LOGISTICS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Supply Chain Command Center & Emergency Decision Engine
              </p>
            </div>
          </div>

          {/* Center: Active Shipments Dropdown Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1">
              <span className="text-xs text-slate-400 px-2 font-medium flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Vessel:
              </span>
              <div className="flex gap-1">
                {shipments.map((s) => {
                  const isSelected = s.id === selectedShipment.id;
                  return (
                    <button
                      key={s.id}
                      id={`shipment-btn-${s.id}`}
                      onClick={() => onSelectShipment(s)}
                      className={`px-3 py-1.5 text-xs rounded font-medium transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        s.riskSeverity === 'CRITICAL' ? 'bg-rose-500 animate-ping' :
                        s.riskSeverity === 'HIGH' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <span>{s.vesselName}</span>
                      {s.rerouteAuthorized && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Hub & Live Telemetry */}
          <div className="flex items-center gap-2.5">
            {/* Clock */}
            <div className="hidden xl:flex flex-col text-right font-mono text-xs pr-2 border-r border-slate-800">
              <span className="text-slate-300 font-medium">{currentTime || 'SYNCHRONIZING...'}</span>
              <span className="text-[10px] text-slate-500">LIVE SATELLITE LINK</span>
            </div>

            {/* Emergency Re-Sourcing Trigger Button */}
            {selectedShipment.coldChain.required && (
              <button
                id="emergency-procurement-btn"
                onClick={onOpenEmergencyProcurement}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all shadow-md ${
                  selectedShipment.emergencySourcingTriggered
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/50 text-rose-300 border-rose-500/40 hover:bg-rose-900/60 hover:border-rose-400 animate-pulse'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-rose-400" />
                <span>
                  {selectedShipment.emergencySourcingTriggered ? 'Re-Sourcing Dispatched' : 'Emergency Re-Sourcing'}
                </span>
              </button>
            )}

            {/* Executive Report Button */}
            <button
              id="executive-report-btn"
              onClick={onOpenReport}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-200 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Executive Brief</span>
            </button>

            {/* Authorize Reroute Button */}
            <button
              id="authorize-reroute-btn"
              onClick={onOpenAuthorize}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md ${
                selectedShipment.rerouteAuthorized
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-emerald-950/50'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {selectedShipment.rerouteAuthorized ? 'Reroute Verified 0x' : 'Authorize Reroute'}
              </span>
            </button>

            {/* Officer Security Profile Pill & Quick Lock */}
            {currentUser && (
              <div className="flex items-center pl-2 border-l border-slate-800 gap-2">
                <button
                  type="button"
                  id="officer-profile-pill-btn"
                  onClick={onOpenSecurityProfile}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-left transition-all group"
                  title="Click to view Officer Security Profile & Cryptographic Token"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold">
                    {currentUser.name.charAt(0) || 'K'}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-[11px] font-bold text-white leading-none group-hover:text-cyan-300 transition-colors">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 leading-tight">
                      DEFCON 1 TOP SECRET
                    </span>
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                {onLogout && (
                  <button
                    type="button"
                    id="header-logout-btn"
                    onClick={onLogout}
                    title="Lock Terminal & Terminate Session"
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
