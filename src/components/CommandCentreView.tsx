import React from 'react';
import { 
  AlertOctagon, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  GitFork, 
  ShieldAlert, 
  Radio, 
  Activity, 
  ChevronRight, 
  Info,
  Layers,
  Sparkles,
  Play
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';
import { VenueMap } from './VenueMap';
import { Zone } from '../types';

export const CommandCentreView: React.FC = () => {
  const { 
    zones, 
    incidents, 
    responseTeams, 
    setActiveTab, 
    setSelectedZone, 
    selectedZone,
    openAlertModalWithPreset
  } = useDrishti();

  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
  const criticalZone = zones.find(z => z.riskLevel === 'CRITICAL') || zones[2]; // Zone C

  return (
    <div className="space-y-4">
      {/* Top Banner Notice: Non-Autonomous Disclaimer */}
      <div className="bg-[#0F172A] border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/80 flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white tracking-wide uppercase font-mono-code text-[11px]">
              DECISION-SUPPORT ACTIVE • HUMAN-IN-THE-LOOP MANDATORY
            </p>
            <p className="text-[#94A3B8] text-[11px] mt-0.5">
              DRISHTI-X estimates macroscopic crowd physics and simulates intervention trade-offs. Final operational control remains with human command.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('what-if-simulator')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs shadow-md tracking-wider uppercase transition-colors"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Launch What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tactical Map (8 cols) + Operational Alert Deck (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Tactical Venue Map Container */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <VenueMap 
            onSelectZone={(z) => setSelectedZone(z)} 
            selectedZoneId={selectedZone?.id} 
          />

          {/* Quick Zone Health Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {zones.map(z => (
              <div 
                key={z.id}
                onClick={() => setSelectedZone(z)}
                className={`p-2.5 rounded border text-xs cursor-pointer transition-all ${
                  z.riskLevel === 'CRITICAL' 
                    ? 'bg-red-950/40 border-red-500/80 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.2)]' 
                    : z.riskLevel === 'HIGH'
                    ? 'bg-amber-950/30 border-amber-500/60 text-amber-200'
                    : z.riskLevel === 'MODERATE'
                    ? 'bg-yellow-950/20 border-yellow-700/60 text-yellow-200'
                    : 'bg-[#151C2C] border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold font-mono-code text-[11px] text-slate-400">ZONE {z.id}</span>
                  <span className="text-[10px] font-mono-code font-bold">{z.riskScore}/100</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{z.name.split(' ')[1]}</div>
                <div className="text-[11px] font-mono-code font-bold mt-1 text-white">{z.density} ppl/m²</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Incident & Decision Support Card */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {/* Priority Risk Escalation Card */}
          <div className="bg-[#151C2C] border border-red-500/80 p-4 shadow-[0_0_15px_rgba(239,68,68,0.2)] relative overflow-hidden rounded">
            <div className="absolute top-0 right-0 bg-[#FF4444] text-white font-mono-code text-[9px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
              CRITICAL ESCALATION
            </div>

            <div className="flex items-start space-x-3 mb-3">
              <div className="p-2 rounded bg-red-950/80 text-red-400 border border-red-700 mt-1">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono-code text-red-400 font-bold">
                  ZONE {criticalZone.id} • RISK SCORE {criticalZone.riskScore}/100
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {criticalZone.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 font-mono-code">
                  Density: <strong className="text-red-400">{criticalZone.density} ppl/m²</strong> (Limit: 3.0)
                </p>
              </div>
            </div>

            {/* Evidence Breakdown */}
            <div className="space-y-1.5 bg-[#0F172A] rounded p-2.5 border border-slate-800 text-xs mb-3">
              <span className="text-[10px] font-mono-code uppercase text-[#94A3B8] block font-bold tracking-wider">
                DETECTED CONTRIBUTING FACTORS:
              </span>
              {criticalZone.reasons.map((r, idx) => (
                <div key={idx} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {/* Uncertainty Badge */}
            <div className="flex items-center justify-between text-[11px] font-mono-code bg-[#0F172A] px-2.5 py-1.5 rounded border border-slate-800 mb-3">
              <span className="text-slate-400">Model Confidence:</span>
              <span className="text-amber-400 font-bold">
                {criticalZone.confidenceLevel} ({criticalZone.confidenceScore}%)
              </span>
            </div>

            {/* Fast Intervention Actions */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('what-if-simulator')}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs shadow-md tracking-wider uppercase transition-colors"
              >
                <GitFork className="w-4 h-4" />
                <span>Simulate Interventions (Gate 3 / 5)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openAlertModalWithPreset({
                    situation: "Crowd compression in Zone C near Gate 3",
                    targetZones: "Zone C and Zone D",
                    actionRequired: "Proceed calmly toward Gate 5 South avenue",
                  })}
                  className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded border border-amber-600/50 transition-colors text-center"
                >
                  📢 Broadcast Alert
                </button>
                <button
                  onClick={() => setActiveTab('incidents')}
                  className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-colors text-center font-mono-code"
                >
                  📋 Incidents ({incidents.length})
                </button>
              </div>
            </div>
          </div>

          {/* Active Incidents Queue */}
          <div className="bg-[#151C2C] border border-slate-800 p-3.5 space-y-3 rounded">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold font-mono-code text-slate-200 uppercase tracking-wider">
                  ACTIVE INCIDENTS QUEUE
                </h4>
              </div>
              <button 
                onClick={() => setActiveTab('incidents')}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-0.5 font-mono-code"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {incidents.slice(0, 3).map(inc => (
                <div 
                  key={inc.id}
                  className={`p-2.5 rounded text-xs transition-all ${
                    inc.severity === 'CRITICAL' 
                      ? 'bg-red-900/20 border-l-2 border-red-500' 
                      : inc.severity === 'HIGH'
                      ? 'bg-amber-900/20 border-l-2 border-amber-500'
                      : 'bg-slate-800/40 border-l-2 border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1 font-mono-code">
                    <span className={`font-bold ${inc.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                      #{inc.id} • Zone {inc.zoneId}
                    </span>
                    <span className="text-slate-400">{inc.timestamp}</span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    {inc.title}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] italic mt-0.5 truncate">
                    {inc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Response Teams Standby */}
          <div className="bg-[#151C2C] border border-slate-800 p-3.5 space-y-2 text-xs rounded">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-slate-200 uppercase text-[11px] font-mono-code">
                  RESPONSE TEAMS STATUS
                </h4>
              </div>
              <button 
                onClick={() => setActiveTab('response-teams')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-mono-code"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {responseTeams.map(t => (
                <div key={t.id} className="bg-[#0F172A] p-2 rounded border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between font-mono-code">
                    <span className="font-bold text-white">{t.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      t.status === 'DEPLOYED' ? 'bg-blue-950 text-blue-300 border border-blue-700' : 'bg-green-950 text-green-300 border border-green-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono-code">
                    Zone <strong className="text-slate-200">{t.currentLocationZone}</strong> • {t.personnelCount} NCC
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
