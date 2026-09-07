import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Anchor, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  Filter,
  ChevronRight,
  Info
} from 'lucide-react';
import { GeopoliticalAlert, AlertCategory } from '../types';

interface ThreatTickerProps {
  alerts: GeopoliticalAlert[];
  onSelectAlert?: (alert: GeopoliticalAlert) => void;
}

export const ThreatTicker: React.FC<ThreatTickerProps> = ({ alerts, onSelectAlert }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalAlert, setActiveModalAlert] = useState<GeopoliticalAlert | null>(null);

  const filteredAlerts = selectedCategory === 'ALL'
    ? alerts
    : alerts.filter(a => a.category === selectedCategory);

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'CONFLICT':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'TARIFF_POLICY':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
      case 'PORT_STRIKE':
        return <Anchor className="w-3.5 h-3.5 text-orange-400" />;
      case 'CHOKEPOINT':
        return <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            HIGH RISK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            MODERATE
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0B0F17]/90 border-b border-slate-800">
      {/* Category Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-850">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded border border-rose-900/60 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
            <span>Live Threat Sensing</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Global Geopolitical & Macroeconomic Disruption Feed
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { key: 'ALL', label: 'All Alerts' },
            { key: 'CONFLICT', label: 'War Zones & Missiles' },
            { key: 'TARIFF_POLICY', label: 'Tariffs & Trade Acts' },
            { key: 'PORT_STRIKE', label: 'Port & Labor Strikes' },
            { key: 'CHOKEPOINT', label: 'Canals & Chokepoints' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedCategory === tab.key
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Ribbon Grid / Scroll */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAlerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                setActiveModalAlert(alert);
                if (onSelectAlert) onSelectAlert(alert);
              }}
              className="group bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:shadow-cyan-950/20"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  {getCategoryIcon(alert.category)}
                  <span className="font-semibold text-slate-300">{alert.region}</span>
                </div>
                {getSeverityBadge(alert.severity)}
              </div>

              <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                {alert.headline}
              </h4>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-rose-400/90 font-medium">Impact: {alert.delayImpact}</span>
                <span className="flex items-center gap-1 text-slate-500 group-hover:text-cyan-400">
                  Details <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Briefing Modal */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1420] border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {getCategoryIcon(activeModalAlert.category)}
                <span className="text-xs font-mono uppercase text-cyan-400">
                  {activeModalAlert.category} • {activeModalAlert.region}
                </span>
              </div>
              <button
                onClick={() => setActiveModalAlert(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mb-3">
              {getSeverityBadge(activeModalAlert.severity)}
            </div>

            <h3 className="text-base font-bold text-white mb-3">
              {activeModalAlert.headline}
            </h3>

            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 mb-4 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{activeModalAlert.summary}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400">
                <span>Verified Source: <strong className="text-slate-200">{activeModalAlert.verifiedAgency}</strong></span>
                <span>Logged: {activeModalAlert.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Primary Shipping Impact</span>
                <span className="text-rose-400 font-bold text-sm">{activeModalAlert.delayImpact}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Geographic Anchor</span>
                <span className="text-cyan-300 font-mono text-xs">
                  {activeModalAlert.coordinates[0].toFixed(2)}°N, {activeModalAlert.coordinates[1].toFixed(2)}°E
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveModalAlert(null)}
                className="px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors"
              >
                Acknowledge Threat Advisory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
