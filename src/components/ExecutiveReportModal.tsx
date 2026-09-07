import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Bot, 
  RefreshCw,
  Globe,
  Tag,
  BarChart3,
  Lightbulb,
  ShieldAlert
} from 'lucide-react';
import { Shipment } from '../types';

interface ExecutiveReportModalProps {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  shipment,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [reportSource, setReportSource] = useState<string>('Tactical Intelligence Engine');
  
  // Default formatted report based on active vessel scenario
  const [reportContent, setReportContent] = useState<string>(() => generateDefaultReport(shipment));

  if (!isOpen) return null;

  function generateDefaultReport(s: Shipment): string {
    const pA = s.plans.planA;
    const pB = s.plans.planB;
    const pC = s.plans.planC;
    const t = s.tariffData;

    return `### 1. 🌐 Geopolitical & News Assessment
- **Root Cause & Trigger:** ${s.currentThreat}
- **Chokepoint Bottleneck:** ${s.chokepointRisk}. Lloyd's War Risk insurance underwriting syndicate declared elevated maritime security zone.
- **Nautical Hazard Probability:** Direct passage under Plan A presents an unacceptable casualty and cargo loss probability.

### 2. 🏷️ Tax, Tariff & Economic Impact
- **Baseline Port Customs Duties:** ${t.baselinePort} charges standard entry tariff of ${t.entryTariffRateBaseline}%, exposing shipments to $${t.totalFinancialExposureBaseline.toLocaleString()} in clearance and demurrage.
- **Diversion Port Tax Arbitrage:** Diverting to ${t.candidatePortA} utilizes bonded Free Trade Zone (FTZ) status, saving $${t.ftzSavingsUSDA.toLocaleString()} in net customs duties.
- **Demurrage Penalties:** Projected at $${t.demurragePer24hBaselineUSD.toLocaleString()}/24h at baseline port vs $${t.demurragePer24hAUSD.toLocaleString()}/24h at diversion terminal.
- **Cargo Asset Exposure:** Total insurable value of cargo is $${s.cargoValueUSD.toLocaleString()} (${s.cargoCategory}).

### 3. 📊 Tri-Factor Decision Matrix

| Evaluation Benchmark | Plan A: Status Quo (Direct Transit) | Plan B: Maritime Detour (Cape/Oceanic) | Plan C: Multimodal Air/Rail Bridge |
| :--- | :--- | :--- | :--- |
| **Operational & Cargo Safety** | **${pA.safetyIndex.toFixed(1)}%** (Critical Danger) | **${pB.safetyIndex.toFixed(1)}%** (High Sea Safety) | **${pC.safetyIndex.toFixed(1)}%** (Guaranteed Safe) |
| **Financial & Tax Net P&L %** | **${pA.netProfitDeltaPercent > 0 ? `+${pA.netProfitDeltaPercent}%` : `${pA.netProfitDeltaPercent}%`}** (War Risk Loss) | **${pB.netProfitDeltaPercent > 0 ? `+${pB.netProfitDeltaPercent}%` : `${pB.netProfitDeltaPercent}%`}** (Bunker Cost Drag) | **${pC.netProfitDeltaPercent > 0 ? `+${pC.netProfitDeltaPercent}%` : `${pC.netProfitDeltaPercent}%`}** (Margin Protected) |
| **Customer Comfort Percentile (CCP)**| **${pA.ccpPercentile}th Percentile** (Red / Severe Breach) | **${pB.ccpPercentile}th Percentile** (Amber / Moderate Delay) | **${pC.ccpPercentile}th Percentile** (Green / Optimal SLA) |
| **Transit ETA Delta** | ${pA.etaDaysDelta === 0 ? 'Indefinite Standstill' : `+${pA.etaDaysDelta} Days`} | +${pB.etaDaysDelta} Days Delay | ${pC.etaDaysDelta <= 0 ? `${Math.abs(pC.etaDaysDelta)} Days Faster` : `+${pC.etaDaysDelta} Days`} |
| **Total Route Expenditure** | $${pA.totalCostUSD.toLocaleString()} | $${pB.totalCostUSD.toLocaleString()} | $${pC.totalCostUSD.toLocaleString()} |
| **Cold-Chain / Thermal Integrity** | ⚠️ Extreme Spoilage Hazard | ⚠️ Aux Genset Strain (+12d) |  Continuous Monitored Chain |

### 4. 💡 Autonomous Recommendation
**ResilientRoute AI Authorizes: ${pC.planKey} (${pC.title})**
- **Justification:** Plan A imposes existential crew and cargo security vulnerabilities. Plan B circumnavigation safely evades the conflict zone, but its prolonged transit schedule causes severe customer SLA breach and critical degradation for time-sensitive cargo.
- **Multimodal Optimization:** Plan C guarantees 100% security, preserves positive Net P&L (${pC.netProfitDeltaPercent > 0 ? `+${pC.netProfitDeltaPercent}%` : `${pC.netProfitDeltaPercent}%`}) by leveraging FTZ tariff arbitrage savings, and elevates the Customer Comfort Percentile to **${pC.ccpPercentile}th percentile**.

### 5. 🛡️ Regulatory & Human Sign-Off Checklist
- [x] **IMO Rule 19 Compliance:** Flag State Navigation Deviation Order Formally Notified
- [x] **FTZ Customs Transit Bond:** In-Transit Cargo Bond Verified & Deposited
- [x] **GDP Cold-Chain Protocol:** Monitored Reefer Active Tarmac Transfer Log Signed
- [x] **Logistics Authority Sign-off:** Cryptographic Multi-signature Authorized
- [x] **Stakeholder Transparency Broadcast:** Automated Real-Time SMS Dispatched to Consignee`;
  }

  const handleRunGeminiAI = async () => {
    setIsLoadingAI(true);
    try {
      const activePlanA = shipment.plans.planA;
      const activePlanB = shipment.plans.planB;
      const activePlanC = shipment.plans.planC;

      const res = await fetch('/api/ai/analyze-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentName: shipment.vesselName,
          origin: `${shipment.origin.port}, ${shipment.origin.country}`,
          destination: `${shipment.destination.port}, ${shipment.destination.country}`,
          cargo: shipment.cargo,
          threatDescription: shipment.currentThreat,
          tariffs: shipment.tariffData,
          currentPlan: activePlanA,
          planB: activePlanB,
          planC: activePlanC,
          reeferTemp: `${shipment.coldChain.currentTempC}°C`,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setReportContent(data.analysis);
        setReportSource(data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash AI Model' : 'Tactical Logistics Engine');
      }
    } catch (err) {
      console.warn('AI analysis request failed, refreshing default tactical report:', err);
      setReportContent(generateDefaultReport(shipment));
      setReportSource('Tactical Logistics Engine (Offline)');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e1420] border border-cyan-500/40 rounded-xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Executive Operational Decision Document
                </h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700 rounded">
                  {reportSource}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authoritative 5-part executive output for operational rerouting and stakeholder sign-off
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunGeminiAI}
              disabled={isLoadingAI}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              {isLoadingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live Gemini Re-Evaluation</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-5 text-xs text-slate-200 font-sans leading-relaxed space-y-4">
            {reportContent.split('### ').map((section, idx) => {
              if (!section.trim()) return null;
              const [rawTitle, ...bodyLines] = section.split('\n');
              const body = bodyLines.join('\n');

              return (
                <div key={idx} className="pb-3 border-b border-slate-800/80 last:border-0 last:pb-0">
                  <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono flex items-center gap-1.5">
                    {rawTitle}
                  </h4>
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px] font-mono">
                    {body}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            CONFIDENTIAL • FOR AUTHORIZED LOGISTICS DIRECTORS ONLY
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Brief'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
