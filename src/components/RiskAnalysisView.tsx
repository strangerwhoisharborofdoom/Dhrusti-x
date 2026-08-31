import React, { useState } from 'react';
import { 
  TrendingUp, 
  HelpCircle, 
  ShieldAlert, 
  Sliders, 
  Activity, 
  Layers, 
  Info, 
  Sparkles, 
  ChevronDown, 
  ChevronRight,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';
import { RISK_FORMULA_WEIGHTS } from '../mockData';

export const RiskAnalysisView: React.FC = () => {
  const { zones, setActiveTab } = useDrishti();
  const [selectedZoneId, setSelectedZoneId] = useState<string>('C');

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[2];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 space-y-2 rounded shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-700/80">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="font-mono-code text-base font-bold tracking-wider text-white uppercase">
              TRANSPARENT & EXPLAINABLE RISK MODEL
            </h2>
          </div>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0A0F1D] text-blue-400 border border-blue-800/80">
            DETERMINISTIC WEIGHTED FORMULA v2.1
          </span>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Every risk score is computed through transparent mathematical indicators without black-box opacity. Below is the active mathematical model and factor decomposition.
        </p>
      </div>

      {/* MATHEMATICAL FORMULA BREAKDOWN CARD */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 font-mono-code rounded shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
            ACTIVE RISK SCORING EQUATION
          </span>
          <span className="text-[10px] text-slate-400">NORMALIZED: 0 - 100</span>
        </div>

        {/* Formula Display Box */}
        <div className="bg-[#0A0F1D] p-3 rounded border border-slate-800 text-xs text-slate-200 overflow-x-auto">
          <code>
            Risk(Z) = ({RISK_FORMULA_WEIGHTS.densityWeight} × DensityNorm) + ({RISK_FORMULA_WEIGHTS.flowImbalanceWeight} × FlowImbalance) + ({RISK_FORMULA_WEIGHTS.compressionRateWeight} × CompressionRate) + ({RISK_FORMULA_WEIGHTS.exitConstraintWeight} × ExitConstraint) + ({RISK_FORMULA_WEIGHTS.incidentSeverityWeight} × IncidentSeverity) - ({RISK_FORMULA_WEIGHTS.responseTeamCoverageWeight} × CoverageMitigation)
          </code>
        </div>

        {/* Weight Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">DENSITY (25%)</span>
            <span className="font-bold text-blue-400">w1 = 0.25</span>
          </div>
          <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FLOW DELTA (20%)</span>
            <span className="font-bold text-blue-400">w2 = 0.20</span>
          </div>
          <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">COMPRESSION (20%)</span>
            <span className="font-bold text-blue-400">w3 = 0.20</span>
          </div>
          <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">EXIT PINCH (15%)</span>
            <span className="font-bold text-blue-400">w4 = 0.15</span>
          </div>
          <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">INCIDENT (10%)</span>
            <span className="font-bold text-blue-400">w5 = 0.10</span>
          </div>
          <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">COVERAGE (-10%)</span>
            <span className="font-bold text-green-400">w6 = -0.10</span>
          </div>
        </div>
      </div>

      {/* ZONE RISK DECOMPOSITION & UNCERTAINTY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Zone Selection List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold font-mono-code uppercase text-slate-400 block px-1">
            SELECT ZONE TO INSPECT:
          </span>

          <div className="space-y-2">
            {zones.map(z => {
              const isSelected = z.id === selectedZoneId;
              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#151C2C] border-blue-500 shadow-md ring-1 ring-blue-500/40' 
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold font-mono-code text-white text-xs">
                      Zone {z.id}: {z.name.split(' ')[1]}
                    </span>
                    <span className={`text-[10px] font-mono-code font-bold px-1.5 py-0.2 rounded ${
                      z.riskLevel === 'CRITICAL' ? 'bg-red-950/80 text-red-300 border border-red-700' :
                      z.riskLevel === 'HIGH' ? 'bg-amber-950/80 text-amber-300 border border-amber-700' :
                      z.riskLevel === 'MODERATE' ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-700' :
                      'bg-green-950/80 text-green-300 border border-green-700'
                    }`}>
                      {z.riskScore}/100 • {z.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                    <span>Density: {z.density} ppl/m²</span>
                    <span className="text-blue-400 font-mono-code">Confidence: {z.confidenceScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Zone Detailed Factor Breakdown (8 cols) */}
        <div className="lg:col-span-8 bg-[#151C2C] border border-slate-800 p-4 space-y-4 rounded shadow-sm">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded bg-[#0A0F1D] font-bold font-mono-code text-xs text-blue-400 flex items-center justify-center border border-slate-700">
                  {selectedZone.id}
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedZone.name} (Zone {selectedZone.id})
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Capacity: {selectedZone.currentCount} / {selectedZone.capacity} ({Math.round((selectedZone.currentCount/selectedZone.capacity)*100)}%)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono-code font-bold px-2.5 py-1 rounded border ${
                selectedZone.riskLevel === 'CRITICAL' ? 'bg-red-950/80 text-red-300 border-red-600' :
                selectedZone.riskLevel === 'HIGH' ? 'bg-amber-950/80 text-amber-300 border-amber-600' :
                'bg-green-950/80 text-green-300 border-green-600'
              }`}>
                RISK: {selectedZone.riskScore}/100 ({selectedZone.riskLevel})
              </span>
            </div>
          </div>

          {/* Root-Cause Contributing Factors */}
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono-code uppercase text-slate-300 block">
              PRIMARY ROOT-CAUSE CONTRIBUTORS:
            </span>

            <div className="space-y-2">
              {selectedZone.reasons.map((reason, idx) => (
                <div key={idx} className="bg-[#0A0F1D] p-2.5 rounded border border-slate-800 text-xs flex items-start space-x-2">
                  <Flame className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Factor Breakdown Bars */}
          <div className="space-y-2.5 bg-[#0A0F1D] p-3 rounded border border-slate-800 text-xs font-mono-code">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              ESTIMATED FACTOR CONTRIBUTIONS:
            </span>

            {/* Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Crowd Density ({selectedZone.density} ppl/m²):</span>
                <span className="text-blue-400 font-bold">{Math.round((selectedZone.density / 5.0) * 25)} / 25 pts</span>
              </div>
              <div className="w-full bg-[#151C2C] rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (selectedZone.density / 5.0) * 100)}%` }} />
              </div>
            </div>

            {/* Inflow vs Outflow Imbalance */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Flow Imbalance (+{selectedZone.inflowRate} / -{selectedZone.outflowRate}):</span>
                <span className="text-amber-400 font-bold">{Math.round(Math.max(0, (selectedZone.inflowRate - selectedZone.outflowRate)/100) * 20)} / 20 pts</span>
              </div>
              <div className="w-full bg-[#151C2C] rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (selectedZone.inflowRate / 200) * 100)}%` }} />
              </div>
            </div>

            {/* Movement Vector */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Vector Turbulence ({selectedZone.flowDirection}):</span>
                <span className="text-red-400 font-bold">{selectedZone.flowDirection === 'COUNTER_FLOW' ? '18 / 20 pts' : '4 / 20 pts'}</span>
              </div>
              <div className="w-full bg-[#151C2C] rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: selectedZone.flowDirection === 'COUNTER_FLOW' ? '90%' : '20%' }} />
              </div>
            </div>
          </div>

          {/* Uncertainty Matrix Badge */}
          <div className="bg-[#0A0F1D] p-3 rounded border border-slate-800 flex items-center justify-between text-xs font-mono-code">
            <div>
              <span className="text-slate-400 block text-[10px]">UNCERTAINTY & CONFIDENCE RATING</span>
              <span className="text-white font-bold">Confidence: {selectedZone.confidenceScore}% ({selectedZone.confidenceLevel})</span>
            </div>
            <button
              onClick={() => setActiveTab('what-if-simulator')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition-colors shadow-sm"
            >
              Simulate Zone {selectedZone.id} Response →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
