import React from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Thermometer, Clock, DollarSign } from 'lucide-react';
import { TriFactorPlan, ColdChainTelemetry } from '../types';

interface CustomerComfortGaugeProps {
  plan: TriFactorPlan;
  coldChain: ColdChainTelemetry;
}

export const CustomerComfortGauge: React.FC<CustomerComfortGaugeProps> = ({ plan, coldChain }) => {
  const ccp = plan.ccpPercentile;

  // Determine status & color codes strictly as defined in requirements:
  // Green: 90 - 100th Percentile
  // Amber: 70 - 89th Percentile
  // Red: < 70th Percentile
  let themeColor = '#10b981'; // green emerald
  let themeTailwind = 'text-emerald-400';
  let themeBg = 'bg-emerald-500/10 border-emerald-500/30';
  let statusTitle = 'EXCELLENT (90-100th Percentile)';
  let statusDesc = 'Negligible delay, full visibility, guaranteed cold-chain product integrity.';

  if (ccp < 70) {
    themeColor = '#f43f5e'; // red rose
    themeTailwind = 'text-rose-400';
    themeBg = 'bg-rose-500/10 border-rose-500/30';
    statusTitle = 'CRITICAL SLA BREACH (<70th)';
    statusDesc = 'Critical SLA failure, severe inventory spoilage risk, unhedged tariff pass-through.';
  } else if (ccp < 90) {
    themeColor = '#f59e0b'; // amber
    themeTailwind = 'text-amber-400';
    themeBg = 'bg-amber-500/10 border-amber-500/30';
    statusTitle = 'MODERATE AT-RISK (70-89th)';
    statusDesc = 'Moderate delay, proactive customer communication, zero thermal breach.';
  }

  // Radial arc math for SVG gauge
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc gauge
  const arcLength = circumference * 0.75;
  const progressOffset = arcLength - (arcLength * (ccp / 100));

  return (
    <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${themeBg} border`}>
            <HeartPulse className={`w-4 h-4 ${themeTailwind}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Customer Comfort Gauge (CCP)
            </h3>
            <p className="text-[11px] text-slate-400">
              Stakeholder viability & SLA preservation index
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${themeBg} ${themeTailwind}`}>
          {statusTitle.split(' ')[0]}
        </span>
      </div>

      {/* Center: Radial Gauge Graphic */}
      <div className="py-4 flex flex-col items-center justify-center relative">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeDasharray={arcLength}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Foreground Fill */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={themeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={arcLength}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Numerical Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {ccp}
              <span className="text-sm font-normal text-slate-400 ml-0.5">th</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
              Percentile
            </span>
            <span className={`text-[11px] font-semibold mt-1 ${themeTailwind}`}>
              {plan.planKey} Projected
            </span>
          </div>
        </div>

        {/* Status Callout Description */}
        <p className="text-xs text-center text-slate-300 max-w-xs mt-1 leading-relaxed px-2">
          {statusDesc}
        </p>
      </div>

      {/* Sub-Metrics Breakdown Bar */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              SLA Timeliness
            </span>
            <span className="font-mono font-bold text-slate-200">
              {plan.etaDaysDelta <= 0 ? 'ON SCHEDULE' : `+${plan.etaDaysDelta}d DELAY`}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${plan.etaDaysDelta <= 0 ? 'bg-emerald-400' : plan.etaDaysDelta < 5 ? 'bg-amber-400' : 'bg-rose-500'}`}
              style={{ width: `${Math.max(10, 100 - plan.etaDaysDelta * 6)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" />
              Cold-Chain Safety
            </span>
            <span className={`font-mono font-bold ${coldChain.status === 'NORMAL' ? 'text-emerald-300' : 'text-rose-400'}`}>
              {coldChain.status === 'NORMAL' ? '100% SECURE' : 'AT RISK'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${coldChain.status === 'NORMAL' ? 'bg-emerald-400' : 'bg-rose-500'}`}
              style={{ width: coldChain.status === 'NORMAL' ? '100%' : '35%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
