import React, { useState } from 'react';
import { 
  UsersRound, 
  Radio, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  RotateCcw, 
  Layers, 
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const ResponseTeamsView: React.FC = () => {
  const { responseTeams, zones, dispatchTeam, recallTeam } = useDrishti();
  const [selectedTargetZone, setSelectedTargetZone] = useState<Record<string, string>>({
    ALPHA: 'C',
    BRAVO: 'E',
    CHARLIE: 'C',
    DELTA: 'F',
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 rounded shadow-md">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">
            <UsersRound className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-mono-code text-base font-bold tracking-wider text-white uppercase">
              TACTICAL RESPONSE TEAMS & NCC CADET SQUADS
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Live location, tactical assignments, equipment loadout, and rapid redeployment controls.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono-code px-2.5 py-1 rounded bg-[#0A0F1D] text-blue-300 border border-blue-800/80">
          ALL SQUADS TRAINED IN CROWD MANAGEMENT SOPs
        </span>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {responseTeams.map(team => {
          const isDeployed = team.status === 'DEPLOYED';

          return (
            <div
              key={team.id}
              className={`bg-[#151C2C] rounded border p-4 transition-all space-y-3.5 shadow-sm ${
                isDeployed 
                  ? 'border-blue-500 shadow-md shadow-blue-950/40' 
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded bg-[#0A0F1D] font-bold font-mono-code text-xs text-blue-400 flex items-center justify-center border border-slate-700">
                    {team.id.slice(0, 2)}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {team.name} ({team.id})
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Lead: <strong className="text-slate-300">{team.leader}</strong> • {team.personnelCount} Personnel
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border ${
                  isDeployed ? 'bg-blue-950/80 text-blue-300 border-blue-700' : 'bg-green-950/80 text-green-300 border-green-700'
                }`}>
                  {team.status}
                </span>
              </div>

              {/* Location & ETA */}
              <div className="grid grid-cols-2 gap-2 bg-[#0A0F1D] p-2.5 rounded border border-slate-800 text-xs font-mono-code">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Current Zone: <strong className="text-white">{team.currentLocationZone}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>ETA: <strong className="text-white">{team.etaMinutes ? `${team.etaMinutes} mins` : 'ON-SITE'}</strong></span>
                </div>
              </div>

              {/* Specialization & Equipment */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Role: {team.specialization}</span>
                  <span className="text-blue-400 font-mono-code">{team.contactRadio}</span>
                </div>

                <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800/80 flex flex-wrap gap-1.5">
                  <span className="text-[9px] text-slate-400 uppercase font-mono-code">Gear:</span>
                  {(team.equipment || ['Megaphones', 'Directional Barrier Tapes', 'First Aid Kit']).map((eq, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-[#151C2C] text-slate-300 rounded border border-slate-700 font-mono-code">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dispatch Action Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs font-mono-code">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Target:</span>
                  <select
                    value={selectedTargetZone[team.id] || 'C'}
                    onChange={(e) => setSelectedTargetZone(prev => ({ ...prev, [team.id]: e.target.value }))}
                    className="bg-[#0A0F1D] border border-slate-700 text-white rounded px-2 py-1 text-xs font-mono-code"
                  >
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>Zone {z.id}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatchTeam(team.id, selectedTargetZone[team.id] || 'C')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs shadow-md transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Dispatch</span>
                  </button>

                  {isDeployed && (
                    <button
                      onClick={() => recallTeam(team.id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700"
                    >
                      Recall
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
