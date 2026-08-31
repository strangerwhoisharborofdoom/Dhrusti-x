import React from 'react';
import { 
  BookOpenCheck, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Layers,
  Sparkles,
  AlertOctagon
} from 'lucide-react';
import { VALIDATION_TARGETS } from '../mockData';

export const ValidationView: React.FC = () => {
  const historicalCaseStudies = [
    {
      disaster: "Seoul Itaewon Crowd Crush (2022)",
      mechanism: "Narrow 4-meter sloping alleyway connecting main boulevard with subway exit; bi-directional pedestrian convergence created extreme compression (>8-10 ppl/m²).",
      drishtiIntervention: "DRISHTI-X vector model would have flagged the counter-flow confluence 12 minutes prior. The What-If engine would have simulated one-way alley regulation and diverted subway egress away from the pinch-point."
    },
    {
      disaster: "Elphinstone Road Footbridge (2017)",
      mechanism: "Sudden heavy rainfall caused crowd accumulation under bridge canopy while commuters arriving by train continued pushing forward onto the narrow staircase.",
      drishtiIntervention: "DRISHTI-X would have detected the severe inflow vs outflow mismatch at the staircase throat within 90 seconds, advising immediate platform gate regulation and alternate footbridge diversion."
    },
    {
      disaster: "Allahabad Railway Station Footbridge (2013)",
      mechanism: "Last-minute train platform change announcement triggered sudden, massive counter-flow surges on a confined foot-over-bridge.",
      drishtiIntervention: "DRISHTI-X would have predicted the counter-flow vector collision before public announcements, recommending phased platform entry and deployment of NCC/RPF squads for directional lane segregation."
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 space-y-2 rounded shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">
              <BookOpenCheck className="w-5 h-5" />
            </span>
            <h2 className="font-mono-code text-base font-bold tracking-wider text-white uppercase">
              VALIDATION TARGETS, PRIOR ART & HISTORICAL CASE ANALYSIS
            </h2>
          </div>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0A0F1D] text-green-300 border border-green-800">
            NCC INNOVATION BENCHMARK
          </span>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Target performance metrics against existing static crowd monitoring systems and counterfactual disaster prevention analysis.
        </p>
      </div>

      {/* VALIDATION TARGET METRICS GRID */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Target className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono-code">
            PROTOTYPE SYSTEM TARGET PERFORMANCE METRICS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {VALIDATION_TARGETS.map((target) => (
            <div key={target.id} className="bg-[#0A0F1D] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{target.metricName}</span>
                <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-green-950/80 text-green-300 border border-green-700">
                  {target.targetValue}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Current Prototype: <strong className="text-blue-400 font-mono-code">{target.currentSimulatedBenchmark}</strong>
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 font-mono-code">
                {target.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORICAL CASE STUDIES */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono-code">
            COUNTERFACTUAL CASE ANALYSIS: "WHAT IF DRISHTI-X HAD BEEN PRESENT?"
          </h3>
        </div>

        <div className="space-y-3">
          {historicalCaseStudies.map((study, idx) => (
            <div key={idx} className="bg-[#0A0F1D] p-3.5 rounded border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-sm text-blue-400 font-mono-code">
                {study.disaster}
              </h4>
              <div className="text-slate-300 leading-relaxed">
                <strong className="text-slate-400 uppercase text-[10px] block mb-0.5 font-mono-code">Physical Root-Cause Mechanism:</strong>
                {study.mechanism}
              </div>
              <div className="bg-[#151C2C] p-2.5 rounded border border-blue-800/60 text-slate-200 leading-relaxed mt-1">
                <strong className="text-blue-400 uppercase text-[10px] block mb-0.5 flex items-center space-x-1 font-mono-code">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DRISHTI-X Decision-Support Value:</span>
                </strong>
                {study.drishtiIntervention}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CONVENTIONAL SYSTEMS FAIL CARD */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-2 text-xs rounded shadow-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 font-mono-code">
          WHY CONVENTIONAL CCTV & COUNTING TOOLS ARE INSUFFICIENT:
        </h3>
        <ul className="space-y-1.5 text-slate-300">
          <li className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>Retrospective, Not Predictive:</strong> Standard cameras only record stampedes after crowd crush has already begun. DRISHTI-X calculates macroscopic density build-up 8-12 minutes in advance.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>No Counterfactual Simulation:</strong> Existing dashboards do not answer "What happens if we close Gate 3?". DRISHTI-X simulates displaced crowd spillover across neighboring zones.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>Privacy & Trust:</strong> Traditional systems often attempt face-recognition which raises legal/ethical hurdles. DRISHTI-X operates solely on macroscopic crowd physics and density geometry.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
