import React from 'react';
import { 
  Activity, 
  Users, 
  ArrowDownUp, 
  Gauge, 
  ShieldAlert, 
  TrendingUp, 
  DoorOpen, 
  AlertTriangle,
  Sliders,
  CheckCircle
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from 'recharts';

export const LiveSituationView: React.FC = () => {
  const { zones, gates, exits, telemetry, updateGateStatus } = useDrishti();

  // Synthetic live density timeline data (last 30 minutes)
  const densityTimelineData = [
    { time: '14:05', ZoneA: 1.4, ZoneB: 2.1, ZoneC: 2.5, ZoneD: 2.0, ZoneE: 1.2 },
    { time: '14:10', ZoneA: 1.5, ZoneB: 2.3, ZoneC: 3.1, ZoneD: 2.4, ZoneE: 1.3 },
    { time: '14:15', ZoneA: 1.6, ZoneB: 2.5, ZoneC: 3.8, ZoneD: 2.8, ZoneE: 1.3 },
    { time: '14:20', ZoneA: 1.7, ZoneB: 2.6, ZoneC: 4.2, ZoneD: 3.1, ZoneE: 1.4 },
    { time: '14:25', ZoneA: 1.8, ZoneB: 2.7, ZoneC: 4.6, ZoneD: 3.4, ZoneE: 1.4 },
    { time: '14:30', ZoneA: 1.8, ZoneB: 2.7, ZoneC: 4.9, ZoneD: 3.6, ZoneE: 1.4 },
  ];

  // Inflow vs Outflow comparison across gates
  const flowRatesData = gates.map(g => ({
    name: g.name.split(' ')[0] + ' ' + g.name.split(' ')[1],
    Inflow: g.inflowRate,
    Capacity: g.capacityRate,
  }));

  return (
    <div className="space-y-4">
      {/* Top Banner Notice */}
      <div className="bg-[#0F172A] border border-slate-800 p-3 flex items-center justify-between text-xs rounded shadow-md">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white uppercase font-mono-code tracking-wide">
            REAL-TIME SITUATIONAL TELEMETRY & FLOW DYNAMICS
          </span>
        </div>
        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0A0F1D] text-slate-400 border border-slate-800">
          DATA REFRESH: REALTIME (DEMO STREAM)
        </span>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#151C2C] border border-slate-800 p-3.5 space-y-1 font-mono-code rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>TOTAL ATTENDEES</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {telemetry.totalAttendees.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">Venue Capacity: {telemetry.peakCapacity.toLocaleString()}</div>
        </div>

        <div className="bg-[#151C2C] border border-slate-800 p-3.5 space-y-1 font-mono-code rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>MAX DENSITY</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400">
            4.9 ppl/m²
          </div>
          <div className="text-[10px] text-slate-500">Safe Baseline: ≤ 2.5 ppl/m²</div>
        </div>

        <div className="bg-[#151C2C] border border-slate-800 p-3.5 space-y-1 font-mono-code rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AVG FLOW VELOCITY</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">
            0.88 m/s
          </div>
          <div className="text-[10px] text-slate-500">Zone C Constrained: 0.30 m/s</div>
        </div>

        <div className="bg-[#151C2C] border border-slate-800 p-3.5 space-y-1 font-mono-code rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>COUNTER-FLOW</span>
            <ArrowDownUp className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400">
            1 ACTIVE
          </div>
          <div className="text-[10px] text-slate-500">Detected in Zone C junction</div>
        </div>
      </div>

      {/* CHARTS ROW: Density Timeline + Inflow vs Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Crowd Density Growth Over Time */}
        <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono-code">
              CROWD DENSITY EVOLUTION BY ZONE (ppl/m²)
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">LAST 30 MINS</span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={densityTimelineData}>
                <defs>
                  <linearGradient id="colorZoneC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorZoneD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="ZoneC" name="Zone C (Central)" stroke="#ef4444" fillOpacity={1} fill="url(#colorZoneC)" strokeWidth={2} />
                <Area type="monotone" dataKey="ZoneD" name="Zone D (East)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorZoneD)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="ZoneB" name="Zone B (Grandstand)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1} />
                <Area type="monotone" dataKey="ZoneA" name="Zone A (North)" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inflow vs Gate Capacity */}
        <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono-code">
              GATE INFLOW vs RATED CAPACITY (ppl/min)
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">TELEMETRY</span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowRatesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Inflow" name="Current Inflow" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Capacity" name="Rated Capacity" fill="#334155" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LIVE GATE REGULATION CONTROLS */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 rounded shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono-code">
              LIVE PERIMETER GATES & EXITS THROTTLE CONTROLS
            </h3>
          </div>
          <span className="text-[10px] font-mono-code text-slate-400">DIRECT OPERATOR OVERRIDES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {gates.map(gate => (
            <div key={gate.id} className="bg-[#0A0F1D] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono-code">{gate.id}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono-code ${
                  gate.status === 'OPEN' ? 'bg-green-950/80 text-green-300 border border-green-700' :
                  gate.status === 'REGULATED' ? 'bg-amber-950/80 text-amber-300 border border-amber-700' :
                  'bg-red-950/80 text-red-300 border border-red-700'
                }`}>
                  {gate.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium truncate">{gate.name.split('(')[0]}</div>
              <div className="text-[10px] text-slate-400 font-mono-code">
                Flow: <strong className="text-white">{gate.inflowRate}</strong> / {gate.capacityRate} ppl/m
              </div>

              {/* Status Selector */}
              <div className="pt-1">
                <select
                  value={gate.status}
                  onChange={(e) => updateGateStatus(gate.id, e.target.value as any, gate.throttlePercent)}
                  className="w-full bg-[#151C2C] border border-slate-700 text-white rounded px-2 py-1 text-[11px] font-mono-code"
                >
                  <option value="OPEN">OPEN (100%)</option>
                  <option value="REGULATED">REGULATED</option>
                  <option value="CLOSED">CLOSED (0%)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
