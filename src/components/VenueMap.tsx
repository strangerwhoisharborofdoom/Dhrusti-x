import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  ArrowLeft,
  ArrowUpRight, 
  ArrowDownRight,
  Flame, 
  ShieldCheck, 
  DoorOpen, 
  Ambulance, 
  Car, 
  Compass,
  AlertCircle,
  Eye,
  Activity,
  Layers,
  Wind,
  Navigation2,
  Sparkles
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';
import { Zone, RiskLevel } from '../types';

export const VenueMap: React.FC<{
  onSelectZone?: (zone: Zone) => void;
  selectedZoneId?: string;
  showSimulatedOverlay?: boolean;
}> = ({ onSelectZone, selectedZoneId }) => {
  const { zones, gates, exits, responseTeams, ambulances, parkingAreas, setSelectedZone } = useDrishti();

  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showFlowArrows, setShowFlowArrows] = useState<boolean>(true);
  const [showInflowStreams, setShowInflowStreams] = useState<boolean>(true);
  const [simTick, setSimTick] = useState<number>(0);
  const [lastUpdateStr, setLastUpdateStr] = useState<string>('Just now');

  // Dynamic simulated update ticker for real-time live flow visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setSimTick((prev) => (prev + 1) % 1000);
      setLastUpdateStr(new Date().toLocaleTimeString('en-GB'));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
    if (onSelectZone) onSelectZone(zone);
  };

  const getRiskColorClasses = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/10 border-2 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
          badge: 'bg-red-900/40 text-red-400 border-red-500',
          text: 'text-red-400',
          glow: 'animate-pulse',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/5 border border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
          badge: 'bg-amber-900/40 text-amber-400 border-amber-500',
          text: 'text-amber-400',
          glow: '',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/5 border border-slate-700',
          badge: 'bg-slate-800 text-amber-300 border-slate-700',
          text: 'text-amber-300',
          glow: '',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-green-500/5 border border-slate-700',
          badge: 'bg-green-950/40 text-green-400 border-green-700',
          text: 'text-green-400',
          glow: '',
        };
    }
  };

  // Directional Vector Arrow Component
  const renderFlowVector = (direction: Zone['flowDirection'], speed: number, density: number) => {
    const isCritical = density >= 4.5;
    const isHigh = density >= 3.0 && density < 4.5;
    const arrowColor = isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-blue-400';
    const bgBadge = isCritical ? 'bg-red-950/70 border-red-700' : isHigh ? 'bg-amber-950/70 border-amber-700' : 'bg-slate-900/80 border-slate-700';

    switch (direction) {
      case 'SOUTH':
        return (
          <div className="flex items-center space-x-1">
            <div className="flex flex-col items-center animate-bounce duration-700">
              <ArrowDown className={`w-3.5 h-3.5 ${arrowColor}`} />
            </div>
            <span className="text-[9px] font-mono-code text-slate-300">S ({speed}m/s)</span>
          </div>
        );
      case 'NORTH':
        return (
          <div className="flex items-center space-x-1">
            <div className="flex flex-col items-center animate-bounce duration-700">
              <ArrowUp className={`w-3.5 h-3.5 ${arrowColor}`} />
            </div>
            <span className="text-[9px] font-mono-code text-slate-300">N ({speed}m/s)</span>
          </div>
        );
      case 'EAST':
        return (
          <div className="flex items-center space-x-1">
            <ArrowRight className={`w-3.5 h-3.5 ${arrowColor} animate-pulse`} />
            <span className="text-[9px] font-mono-code text-slate-300">E ({speed}m/s)</span>
          </div>
        );
      case 'WEST':
        return (
          <div className="flex items-center space-x-1">
            <ArrowLeft className={`w-3.5 h-3.5 ${arrowColor} animate-pulse`} />
            <span className="text-[9px] font-mono-code text-slate-300">W ({speed}m/s)</span>
          </div>
        );
      case 'CONVERGING':
        return (
          <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded border ${bgBadge}`}>
            <div className="flex items-center -space-x-1">
              <ArrowRight className="w-3 h-3 text-red-400" />
              <ArrowLeft className="w-3 h-3 text-red-400" />
            </div>
            <span className="text-[8px] font-mono-code text-red-300 font-bold uppercase">PINCH CONVERGING</span>
          </div>
        );
      case 'COUNTER_FLOW':
        return (
          <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded border ${bgBadge}`}>
            <div className="flex flex-col items-center">
              <ArrowUp className="w-2.5 h-2.5 text-amber-400" />
              <ArrowDown className="w-2.5 h-2.5 text-amber-400" />
            </div>
            <span className="text-[8px] font-mono-code text-amber-300 font-bold uppercase">CONFLICTING FLOW</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1">
            <Navigation2 className={`w-3 h-3 ${arrowColor}`} />
            <span className="text-[9px] font-mono-code text-slate-300">{speed}m/s</span>
          </div>
        );
    }
  };

  return (
    <div className="relative bg-[#0A0F1D] border border-slate-800 p-3 sm:p-4 overflow-hidden shadow-xl rounded font-mono-code">
      
      {/* Tactical Header Overlay */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <h3 className="font-mono-code text-xs font-bold tracking-wider text-white uppercase flex items-center space-x-2">
            <span>VENUE CROWD HYDRODYNAMICS</span>
            <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-700/80 text-[9px] font-bold animate-pulse">
              SIMULATED DATA
            </span>
          </h3>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0F172A] text-slate-400 border border-slate-800">
            SECTOR A • DEMO GROUND
          </span>
        </div>

        {/* Live Simulation Ticker & Controls */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-code">
          {/* Layer Controls */}
          <div className="flex items-center bg-[#0F172A] p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                showHeatmap ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Heatmap Density Gradient"
            >
              Heatmap: {showHeatmap ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowFlowArrows(!showFlowArrows)}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ml-1 ${
                showFlowArrows ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Animated Crowd Flow Vectors"
            >
              Flow Vectors: {showFlowArrows ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowInflowStreams(!showInflowStreams)}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ml-1 hidden sm:inline-block ${
                showInflowStreams ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Gate Stream Connectors"
            >
              Streams: {showInflowStreams ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center space-x-1 text-slate-400 bg-[#0F172A] px-2 py-1 rounded border border-slate-800">
            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            <span className="text-[9px] text-green-400 font-bold">1000ms TICK</span>
          </div>
        </div>
      </div>

      {/* Heatmap Spectrum Legend Bar */}
      {showHeatmap && (
        <div className="mb-2.5 px-2 py-1.5 bg-[#0F172A] rounded border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-bold text-slate-300">Density Heatmap (ppl/m²):</span>
            <div className="flex items-center space-x-1">
              <span className="text-green-400">&lt; 2.0 (Low)</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-green-500 via-amber-400 to-red-600 shadow-inner" />
              <span className="text-red-400 font-bold">&gt; 5.0 (Crush Threshold)</span>
            </div>
          </div>
          <div className="text-[9px] text-[#94A3B8] flex items-center space-x-1">
            <span>Dynamic Model Update:</span>
            <strong className="text-blue-400 font-mono-code">{lastUpdateStr}</strong>
          </div>
        </div>
      )}

      {/* Map Canvas Frame */}
      <div className="relative w-full bg-[#0F172A]/70 border border-slate-800 p-3.5 bg-tactical-grid rounded overflow-hidden">
        
        {/* SVG Flow Streamlines between Gates, Zones and Exits */}
        {showInflowStreams && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flowGradNorth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="flowGradCritical" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="flowGradDispersal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Ingress from Gate 1 to Zone A */}
            <path
              d="M 280,45 L 280,105"
              stroke="url(#flowGradNorth)"
              strokeWidth="2.5"
              fill="none"
              className="animate-flow-dash"
            />

            {/* Ingress from Gate 3 to Zone C (Critical Pinch Stream) */}
            <path
              d="M 120,230 L 260,230 L 260,170"
              stroke="url(#flowGradCritical)"
              strokeWidth="3"
              fill="none"
              className="animate-flow-dash"
            />

            {/* Ingress from Zone C towards Gate 5 (Dispersal Pathway) */}
            <path
              d="M 500,200 L 500,320"
              stroke="url(#flowGradDispersal)"
              strokeWidth="2.5"
              fill="none"
              className="animate-flow-dash"
            />
          </svg>
        )}

        {/* Perimeter North Tag */}
        <div className="flex justify-center mb-2 relative z-10">
          <span className="bg-slate-800/90 text-[#94A3B8] px-4 py-0.5 rounded text-[9px] uppercase font-mono-code tracking-wider border border-slate-700">
            North Perimeter • Gate 1 Ingress Route
          </span>
        </div>

        {/* NORTH SIDE: Gate 1, Parking P1, Exit E1 */}
        <div className="flex items-center justify-between mb-3 px-1 text-[10px] font-mono-code relative z-10">
          {/* Parking P1 */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
            <Car className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300">P1 (North)</span>
            <span className="text-green-400 font-bold">82%</span>
          </div>

          {/* Gate 1 */}
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded border border-blue-600/50 shadow-sm text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white font-bold">G1 (Main Ingress)</span>
            <span className="text-blue-400 text-[10px]">{gates.find(g => g.id === 'G1')?.inflowRate || 95} ppl/m</span>
          </div>

          {/* Emergency Exit E1 */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2 py-1 rounded border border-green-700/60 text-green-300">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>EXIT E1 [CLEAR]</span>
          </div>
        </div>

        {/* 6 ZONE GRID LAYOUT (3 columns x 2 rows in wide view, or 2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          
          {zones.map((zone) => {
            const riskStyles = getRiskColorClasses(zone.riskLevel);
            const isSelected = selectedZoneId === zone.id;
            const isZoneC = zone.id === 'C';

            // Heatmap gradient styles per zone density
            const heatmapStyle = showHeatmap ? {
              backgroundImage: zone.density >= 4.5 
                ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.15) 55%, transparent 80%)'
                : zone.density >= 3.0
                ? 'radial-gradient(circle at center, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.08) 55%, transparent 80%)'
                : 'radial-gradient(circle at center, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.04) 55%, transparent 80%)'
            } : {};

            return (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                style={heatmapStyle}
                className={`relative rounded border p-3.5 transition-all cursor-pointer backdrop-blur-sm ${riskStyles.bg} ${
                  isSelected ? 'ring-2 ring-blue-500 scale-[1.01]' : 'hover:border-slate-500'
                }`}
              >
                {/* Heatmap Contour Pulsing Ring for Critical Density */}
                {showHeatmap && zone.density >= 4.5 && (
                  <div className="absolute inset-0 rounded border-2 border-red-500/60 animate-heatmap-pulse pointer-events-none" />
                )}

                {/* Zone Corner Tag & Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold font-mono-code ${
                    zone.riskLevel === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-slate-400'
                  }`}>
                    ZONE {zone.id}
                  </span>

                  {/* Flow Vector Badge */}
                  {showFlowArrows && (
                    <div className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/80">
                      {renderFlowVector(zone.flowDirection, zone.flowSpeed, zone.density)}
                    </div>
                  )}
                </div>

                {/* Center Stats */}
                <div className="mt-2.5 flex flex-col items-center justify-center text-center">
                  <div className={`text-xl font-bold font-mono-code ${zone.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-white'}`}>
                    {zone.currentCount.toLocaleString()}
                  </div>
                  
                  <div className={`text-[10px] uppercase tracking-widest font-mono-code font-bold ${
                    zone.riskLevel === 'CRITICAL' ? 'text-red-400' :
                    zone.riskLevel === 'HIGH' ? 'text-amber-400' :
                    zone.riskLevel === 'MODERATE' ? 'text-amber-300' :
                    'text-green-400'
                  }`}>
                    {zone.riskLevel === 'CRITICAL' ? 'Critical Pressure' : zone.riskLevel === 'HIGH' ? 'Elevated Watch' : zone.riskLevel === 'MODERATE' ? 'Watch' : 'Normal'}
                  </div>

                  {/* Density & Growth Rate */}
                  <div className="text-[10px] text-slate-300 mt-1 font-mono-code flex items-center space-x-1.5">
                    <span className="font-bold">{zone.density} ppl/m²</span>
                    <span className="text-slate-500">•</span>
                    <span className={zone.densityGrowthRate > 5 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                      {zone.densityGrowthRate > 0 ? `+${zone.densityGrowthRate}%` : `${zone.densityGrowthRate}%`} /5m
                    </span>
                  </div>
                </div>

                {/* Dynamic Flow Arrows Indicator in Box */}
                {showFlowArrows && (
                  <div className="mt-2 pt-1 border-t border-slate-800/70 flex items-center justify-between text-[9px] text-[#94A3B8]">
                    <span>Inflow: <strong className="text-slate-200">{zone.inflowRate}/m</strong></span>
                    <span>Outflow: <strong className="text-slate-200">{zone.outflowRate}/m</strong></span>
                  </div>
                )}

                {/* Assigned teams tag */}
                {zone.assignedTeams.length > 0 && (
                  <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] font-mono-code text-blue-300">
                      {zone.assignedTeams.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* MID-PERIMETER GATES & EXITS */}
        <div className="flex items-center justify-between my-3 px-1 text-xs font-mono-code relative z-10">
          {/* Gate 3 (Central Bottleneck) */}
          <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1 rounded border border-red-500/80 shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-300 font-bold">G3 (Fast-Pass)</span>
            <span className="text-red-400 font-bold">{gates.find(g => g.id === 'G3')?.inflowRate || 185} ppl/m</span>
          </div>

          {/* Exit E2 */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded border border-amber-600/70 text-[10px] text-amber-300">
            <DoorOpen className="w-3 h-3 text-amber-400" />
            <span>EXIT E2 [{exits.find(e => e.id === 'E2')?.status || 'PARTIAL'}]</span>
          </div>

          {/* Gate 4 */}
          <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300">G4 (East)</span>
            <span className="text-slate-400 text-[10px]">{gates.find(g => g.id === 'G4')?.inflowRate || 130} ppl/m</span>
          </div>
        </div>

        {/* SOUTH SIDE: Gate 5, Parking P2 & P3, Ambulance Bay */}
        <div className="flex items-center justify-between pt-2 px-1 border-t border-slate-800 flex-wrap gap-2 text-[10px] font-mono-code relative z-10">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded border border-red-800 text-red-400">
              <Car className="w-3 h-3" />
              <span>P2: 96% FULL</span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-green-400">
              <Car className="w-3 h-3" />
              <span>P3: 43%</span>
            </div>
          </div>

          {/* Gate 5 */}
          <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1 rounded border border-green-600/80 shadow-md">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 font-bold">GATE 5 (South Avenue)</span>
            <span className="text-green-400 font-bold">{gates.find(g => g.id === 'G5')?.status === 'OPEN' ? 'OPEN [DISPERSAL]' : 'CLOSED'}</span>
          </div>

          {/* Ambulances */}
          <div className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <Ambulance className="w-3 h-3 text-green-400" />
            <span>3 AMB STANDBY</span>
          </div>
        </div>

      </div>

      {/* LOWER TELEMETRY DUAL PANELS: Real-time Inflow Rate & Risk Distribution */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono-code">
        
        {/* Inflow Histogram */}
        <div className="bg-[#151C2C] p-3 border border-slate-800 rounded">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] font-bold text-[#64748B] uppercase">Real-Time Inflow Stream</h4>
            <span className="text-[10px] text-blue-400 font-bold">+18% Peak Dynamic Surge</span>
          </div>
          <div className="h-10 flex items-end gap-1.5 pt-1">
            <div className="flex-1 h-1/4 bg-blue-500/20 border-t-2 border-blue-400 rounded-t-sm" title="T-20 min"></div>
            <div className="flex-1 h-2/5 bg-blue-500/20 border-t-2 border-blue-400 rounded-t-sm" title="T-15 min"></div>
            <div className="flex-1 h-3/5 bg-blue-500/30 border-t-2 border-blue-400 rounded-t-sm" title="T-10 min"></div>
            <div className="flex-1 h-full bg-blue-500/50 border-t-2 border-blue-400 rounded-t-sm" title="Current Surge"></div>
            <div className="flex-1 h-3/4 bg-blue-500/30 border-t-2 border-blue-400 rounded-t-sm" title="Projected Dispersal"></div>
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-[#94A3B8]">
            <span>Baseline (Gate 1): 95 ppl/m</span>
            <span className="text-red-400 font-bold">185 ppl/m (Gate 3 Pinch)</span>
          </div>
        </div>

        {/* Risk Distribution Progress Bars */}
        <div className="bg-[#151C2C] p-3 border border-slate-800 rounded">
          <h4 className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Simulated Hydrodynamic Risk Breakdown</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="w-14 text-slate-300 font-bold">Zone C</span>
              <div className="flex-1 mx-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[82%] h-full bg-red-500"></div>
              </div>
              <span className="w-8 text-right text-red-400 font-bold">{zones.find(z => z.id === 'C')?.riskScore || 82}%</span>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="w-14 text-slate-300">Zone B</span>
              <div className="flex-1 mx-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[44%] h-full bg-amber-500"></div>
              </div>
              <span className="w-8 text-right text-amber-400 font-bold">{zones.find(z => z.id === 'B')?.riskScore || 44}%</span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span className="w-14">Zones D-F</span>
              <div className="flex-1 mx-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[20%] h-full bg-green-500"></div>
              </div>
              <span className="w-8 text-right font-bold text-green-400">~20%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
