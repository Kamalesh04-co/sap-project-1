import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  DollarSign, 
  HeartHandshake, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { TriFactorPlan } from '../types';

interface TriFactorMatrixProps {
  plans: {
    planA: TriFactorPlan;
    planB: TriFactorPlan;
    planC: TriFactorPlan;
  };
  selectedPlanKey: 'Plan A' | 'Plan B' | 'Plan C';
  onSelectPlan: (planKey: 'Plan A' | 'Plan B' | 'Plan C') => void;
}

export const TriFactorMatrix: React.FC<TriFactorMatrixProps> = ({
  plans,
  selectedPlanKey,
  onSelectPlan,
}) => {
  const planList = [plans.planA, plans.planB, plans.planC];

  return (
    <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5 shadow-lg">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              Tri-Factor Autonomous Decision Matrix
              <span className="px-2 py-0.5 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-mono">
                BENCHMARK ENGINE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-scenario evaluation across Cargo Safety (0-100%), Net P&L (%), and Customer Comfort (CCP)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>AUTONOMOUS RECOMMENDATION: PLAN C</span>
        </div>
      </div>

      {/* Tri-Factor 3-Column Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planList.map((plan) => {
          const isSelected = selectedPlanKey === plan.planKey;
          const isRecommended = plan.recommended;

          return (
            <div
              key={plan.planKey}
              className={`rounded-xl p-4 transition-all relative flex flex-col justify-between border ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500 ring-1 ring-cyan-500/40 shadow-xl shadow-cyan-950/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge if recommended */}
              {isRecommended && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Recommended
                </div>
              )}

              {/* Plan Header */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {plan.planKey} • {plan.modalType}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {plan.totalTransitDays}d Total
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {plan.title}
                </h4>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-tight">
                  {plan.subtitle}
                </p>

                {/* THE 3 DEFINITIVE BENCHMARKS */}
                <div className="space-y-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-4 text-xs">
                  
                  {/* 1. Operational & Cargo Safety Index */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        1. Cargo & Naval Safety
                      </span>
                      <span className={`font-mono font-bold ${
                        plan.safetyIndex >= 90 ? 'text-emerald-400' :
                        plan.safetyIndex >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {plan.safetyIndex.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          plan.safetyIndex >= 90 ? 'bg-emerald-400' :
                          plan.safetyIndex >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ width: `${plan.safetyIndex}%` }}
                      />
                    </div>
                  </div>

                  {/* 2. Financial & Tax Optimization (Net P&L %) */}
                  <div className="pt-2 border-t border-slate-900">
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        2. Net P&L Optimization
                      </span>
                      <span className={`font-mono font-bold ${
                        plan.netProfitDeltaPercent >= 10 ? 'text-emerald-400' :
                        plan.netProfitDeltaPercent >= 0 ? 'text-cyan-400' : 'text-rose-400'
                      }`}>
                        {plan.netProfitDeltaPercent > 0 ? `+${plan.netProfitDeltaPercent}%` : `${plan.netProfitDeltaPercent}%`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Total Route Cost:</span>
                      <span className="font-mono text-slate-200">${plan.totalCostUSD.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 3. Customer Comfort Percentile (CCP) */}
                  <div className="pt-2 border-t border-slate-900">
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                        3. Customer Comfort (CCP)
                      </span>
                      <span className={`font-mono font-bold ${
                        plan.ccpPercentile >= 90 ? 'text-emerald-400' :
                        plan.ccpPercentile >= 70 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {plan.ccpPercentile}th Pctl
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Delivery ETA Delta:</span>
                      <span className={`font-mono font-semibold ${
                        plan.etaDaysDelta < 0 ? 'text-emerald-300' :
                        plan.etaDaysDelta === 0 ? 'text-slate-300' : 'text-rose-400'
                      }`}>
                        {plan.etaDaysDelta > 0 ? `+${plan.etaDaysDelta} Days Delay` :
                         plan.etaDaysDelta === 0 ? 'On Original Schedule' :
                         `${Math.abs(plan.etaDaysDelta)} Days Faster`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Key Risk / Benefit Callout */}
                <div className="text-[11px] mb-4 space-y-1.5">
                  <div className="text-slate-300">
                    <strong className="text-emerald-400">Advantage:</strong> {plan.keyBenefits[0]}
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-rose-400">Risk Factor:</strong> {plan.keyRisks[0]}
                  </div>
                </div>
              </div>

              {/* Selection Button */}
              <button
                id={`select-${plan.planKey.toLowerCase().replace(' ', '-')}`}
                onClick={() => onSelectPlan(plan.planKey)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Active Operative Plan</span>
                  </>
                ) : (
                  <>
                    <span>Switch to {plan.planKey}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
