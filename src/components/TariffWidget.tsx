import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  DollarSign, 
  ShieldCheck, 
  AlertOctagon, 
  TrendingDown, 
  Landmark,
  Scale
} from 'lucide-react';
import { TariffComparisonData } from '../types';

interface TariffWidgetProps {
  tariffData: TariffComparisonData;
}

export const TariffWidget: React.FC<TariffWidgetProps> = ({ tariffData }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<'PORT_A' | 'PORT_B'>('PORT_A');

  const isPortA = selectedCandidate === 'PORT_A';
  const candidateName = isPortA ? tariffData.candidatePortA : tariffData.candidatePortB;
  const candidateRate = isPortA ? tariffData.entryTariffRateA : tariffData.entryTariffRateB;
  const candidateCustoms = isPortA ? tariffData.customsClearanceAUSD : tariffData.customsClearanceBUSD;
  const candidateDemurrage = isPortA ? tariffData.demurragePer24hAUSD : tariffData.demurragePer24hBUSD;
  const candidateSavings = isPortA ? tariffData.ftzSavingsUSDA : tariffData.ftzSavingsUSDB;
  const candidateExposure = isPortA ? tariffData.totalFinancialExposureA : tariffData.totalFinancialExposureB;

  const netArbitrageDelta = tariffData.totalFinancialExposureBaseline - candidateExposure;

  return (
    <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Calculator className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Tax & Tariff Arbitrage Calculator
              </h3>
              <p className="text-[11px] text-slate-400">
                Cross-border customs duties & demurrage fee optimization
              </p>
            </div>
          </div>

          {/* Candidate Switcher Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSelectedCandidate('PORT_A')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                isPortA
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Option Alpha (FTZ)
            </button>
            <button
              onClick={() => setSelectedCandidate('PORT_B')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                !isPortA
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Option Beta
            </button>
          </div>
        </div>

        {/* Side-by-Side Fee Comparison Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Baseline Port */}
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-rose-400 tracking-wider mb-2">
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              <span>Status Quo Port</span>
            </div>
            <p className="text-xs font-bold text-slate-200 truncate mb-3" title={tariffData.baselinePort}>
              {tariffData.baselinePort}
            </p>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Port Entry Tariff:</span>
                <span className="font-mono font-semibold text-rose-300">{tariffData.entryTariffRateBaseline}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Customs Surcharge:</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${tariffData.customsClearanceBaselineUSD.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Demurrage / 24h:</span>
                <span className="font-mono font-semibold text-rose-400">
                  ${tariffData.demurragePer24hBaselineUSD.toLocaleString()}/day
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold">
                <span className="text-slate-300">Total Exposure:</span>
                <span className="font-mono text-rose-400">
                  ${tariffData.totalFinancialExposureBaseline.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Alternate Diversion Port */}
          <div className="bg-gradient-to-b from-cyan-950/20 to-slate-900/60 border border-cyan-500/30 rounded-lg p-3 relative">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Diversion Arbitrage Port</span>
            </div>
            <p className="text-xs font-bold text-cyan-200 truncate mb-3" title={candidateName}>
              {candidateName}
            </p>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Port Entry Tariff:</span>
                <span className="font-mono font-semibold text-emerald-400">{candidateRate}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Customs Surcharge:</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${candidateCustoms.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Demurrage / 24h:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  ${candidateDemurrage.toLocaleString()}/day
                </span>
              </div>
              <div className="pt-2 border-t border-cyan-900/40 flex justify-between font-bold">
                <span className="text-slate-300">Total Exposure:</span>
                <span className="font-mono text-emerald-400">
                  ${candidateExposure.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arbitrage Savings Callout */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                Net Cross-Border Tariff Savings
              </span>
              <span className="text-xs text-slate-300">
                Free-Trade Zone & bonded customs exemption delta
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-base font-black text-emerald-300 block">
              +${netArbitrageDelta.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-medium">RETAINED MARGIN</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 italic leading-tight">
          💡 {tariffData.summaryNote}
        </p>
      </div>
    </div>
  );
};
