import React from 'react';
import { 
  Boxes, 
  Ambulance, 
  Car, 
  Radio, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Sliders,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const ResourcesView: React.FC = () => {
  const { ambulances, parkingAreas } = useDrishti();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 rounded shadow-md">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">
            <Boxes className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-mono-code text-base font-bold tracking-wider text-white uppercase">
              RESOURCES, AMBULANCE UNITS & PARKING SPILLOVER
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Medical emergency readiness, parking occupancy thresholds, and auxiliary crowd assets.
            </p>
          </div>
        </div>
      </div>

      {/* AMBULANCES SECTION */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Ambulance className="w-4 h-4 text-green-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono-code">
            EMERGENCY MEDICAL AMBULANCE UNITS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {ambulances.map(amb => (
            <div key={amb.id} className="bg-[#0A0F1D] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono-code">{amb.id}: {amb.callSign}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono-code ${
                  amb.status === 'STANDBY' ? 'bg-green-950/80 text-green-300 border border-green-700' : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                }`}>
                  {amb.status}
                </span>
              </div>
              <div className="text-slate-300 text-[11px] font-medium">
                {amb.driver} (Driver) • {amb.paramedic}
              </div>
              <div className="text-slate-400 text-[10px] space-y-0.5 border-t border-slate-800 pt-1.5 font-mono-code">
                <div>Station: <strong className="text-slate-200">{amb.assignedZone}</strong></div>
                <div>Equipment: <strong className="text-blue-400">{amb.equipmentLevel}</strong></div>
                <div>Dispatch ETA: <strong className="text-green-400">{amb.eta}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PARKING LOTS & SPILLOVER SECTION */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Car className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono-code">
            PARKING LOT OCCUPANCY & VEHICULAR INGRESS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {parkingAreas.map(p => {
            const pct = p.occupancyPercent;
            const isFull = pct >= 90;

            return (
              <div key={p.id} className={`bg-[#0A0F1D] p-3.5 rounded border space-y-2.5 ${isFull ? 'border-red-700/80 shadow-md shadow-red-950/30' : 'border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono-code">{p.id}: {p.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono-code ${
                    isFull ? 'bg-red-950/80 text-red-300 border border-red-700' : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}>
                    {pct}% FULL
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#151C2C] rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className={`h-2 rounded-full ${isFull ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-mono-code">
                  <span>Occupancy: {p.currentOccupancy} / {p.capacity}</span>
                  <span className="text-blue-400 font-semibold">{p.connectedZone} Connector</span>
                </div>

                <div className="text-[10px] font-mono-code flex items-center justify-between text-slate-400 border-t border-slate-800 pt-1.5">
                  <span>Pedestrian Spillover Risk:</span>
                  <span className={p.spilloverRiskToPedestrians === 'HIGH' ? 'text-red-400 font-bold' : 'text-green-400'}>
                    {p.spilloverRiskToPedestrians}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
