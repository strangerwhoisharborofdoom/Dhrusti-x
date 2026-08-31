import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  Flame, 
  GitFork, 
  Plus, 
  ShieldAlert, 
  Users, 
  XCircle, 
  Filter,
  Radio,
  FileText,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import { prioritizeIncidents } from '../utils/incidentPrioritizer';

export const IncidentsView: React.FC = () => {
  const { 
    incidents, 
    responseTeams, 
    verifyIncident, 
    closeIncident, 
    assignTeamToIncident, 
    createNewIncident, 
    setActiveTab, 
    setSelectedZone, 
    zones 
  } = useDrishti();

  const [viewMode, setViewMode] = useState<'PRIORITIZED' | 'GRID'>('PRIORITIZED');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // New incident form state
  const [newTitle, setNewTitle] = useState('');
  const [newZone, setNewZone] = useState('C');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('HIGH');
  const [newDesc, setNewDesc] = useState('');

  // AI Prioritization calculation
  const prioritizationResult = useMemo(() => {
    return prioritizeIncidents(incidents, zones);
  }, [incidents, zones]);

  const { prioritizedList, summary } = prioritizationResult;

  const filteredList = useMemo(() => {
    return prioritizedList.filter(({ incident }) => {
      if (filterSeverity !== 'ALL' && incident.severity !== filterSeverity) return false;
      if (filterStatus !== 'ALL' && incident.status !== filterStatus) return false;
      return true;
    });
  }, [prioritizedList, filterSeverity, filterStatus]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createNewIncident({
      title: newTitle,
      zoneId: newZone,
      severity: newSeverity,
      status: 'REPORTED',
      type: 'CROWD_COMPRESSION',
      timestamp: new Date().toLocaleTimeString('en-GB'),
      description: newDesc || 'Ground observation report registered by duty officer.',
      evidence: ['Ground observation registered by command duty officer'],
      recommendedResponse: ['Evaluate local bottleneck', 'Coordinate with perimeter team'],
      assignedTeamId: null,
      operatorNotes: 'Registered manually in command ledger.',
    });

    setNewTitle('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-4 font-mono-code">
      
      {/* Top Header & Action Row */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 rounded shadow-md">
        <div className="flex items-center space-x-3">
          <span className="p-2 rounded bg-amber-950/80 text-amber-400 border border-amber-800 shadow-sm">
            <AlertOctagon className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-mono-code text-sm sm:text-base font-bold tracking-wider text-white uppercase flex items-center space-x-2">
              <span>INCIDENT QUEUE & AI TRIAGE MODULE</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                ACTIVE TRIAGE ENGINE
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Automated multi-factor risk prioritization, cascading impact detection, and human verification queue.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#0A0F1D] p-1 rounded border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('PRIORITIZED')}
              className={`px-2.5 py-1 rounded text-xs flex items-center space-x-1.5 transition-all ${
                viewMode === 'PRIORITIZED'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI Prioritized List</span>
            </button>
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-2.5 py-1 rounded text-xs flex items-center space-x-1.5 transition-all ${
                viewMode === 'GRID'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Standard Grid</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs shadow-md transition-colors font-mono-code"
          >
            <Plus className="w-4 h-4" />
            <span>REGISTER INCIDENT</span>
          </button>
        </div>
      </div>

      {/* AI INCIDENT PRIORITIZATION SUMMARY CAROUSEL / STATS BANNER */}
      <div className="bg-[#151C2C] border border-slate-800 rounded p-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              AI Triage Intelligence Assessment
            </span>
            <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-[#0F172A] border border-slate-800">
              Evaluates Severity • Zone Hydrodynamic Risk • Cascading Bottleneck Reach
            </span>
          </div>

          <div className="text-[11px] text-slate-300">
            Highest Risk Epicenter: <strong className="text-red-400 font-bold">Zone {summary.highestRiskZone}</strong>
          </div>
        </div>

        {/* 4 Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-xs">
          <div className="bg-[#0F172A] p-2.5 rounded border border-red-900/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">P1 Critical Queue</div>
              <div className="text-lg font-bold text-red-400">{summary.criticalP1Count} Incidents</div>
            </div>
            <Flame className="w-5 h-5 text-red-400" />
          </div>

          <div className="bg-[#0F172A] p-2.5 rounded border border-amber-900/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">P2 Elevated Watch</div>
              <div className="text-lg font-bold text-amber-400">{summary.elevatedP2Count} Incidents</div>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>

          <div className="bg-[#0F172A] p-2.5 rounded border border-blue-900/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Avg Triage Urgency</div>
              <div className="text-lg font-bold text-blue-400">{summary.averageResolutionUrgency}/100</div>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>

          <div className="bg-[#0F172A] p-2.5 rounded border border-green-900/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Verification Rate</div>
              <div className="text-lg font-bold text-green-400">
                {Math.round((incidents.filter(i => i.humanVerified).length / (incidents.length || 1)) * 100)}%
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0F172A] p-2.5 rounded border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold text-[11px]">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code transition-all border ${
                filterSeverity === sev 
                  ? 'bg-[#151C2C] text-white font-bold border-blue-500 shadow-sm' 
                  : 'bg-[#0A0F1D] text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold text-[11px]">Status:</span>
          {['ALL', 'OPEN', 'REPORTED', 'VERIFIED', 'MITIGATING', 'CLOSED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code transition-all border ${
                filterStatus === st 
                  ? 'bg-[#151C2C] text-white font-bold border-blue-500 shadow-sm' 
                  : 'bg-[#0A0F1D] text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* PRIORITIZED LIST / GRID VIEW */}
      <div className="space-y-3">
        {filteredList.map(({ incident, analysis }) => {
          const isP1 = analysis.urgencyLevel === 'P1_CRITICAL';
          const isP2 = analysis.urgencyLevel === 'P2_ELEVATED';
          const targetZone = zones.find(z => z.id === incident.zoneId);

          return (
            <div
              key={incident.id}
              className={`bg-[#151C2C] rounded border p-4 transition-all relative shadow-sm ${
                isP1 && incident.status !== 'CLOSED' ? 'border-red-600/90 shadow-md shadow-red-950/40 bg-gradient-to-r from-red-950/20 via-[#151C2C] to-[#151C2C]' :
                isP2 && incident.status !== 'CLOSED' ? 'border-amber-600/80 shadow-sm shadow-amber-950/30' :
                'border-slate-800'
              }`}
            >
              {/* TOP RANK & BADGES BAR */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  {/* AI Rank Badge */}
                  <span className={`px-2.5 py-0.5 rounded font-bold text-xs flex items-center space-x-1 ${
                    isP1 && incident.status !== 'CLOSED' ? 'bg-red-600 text-white shadow-sm' :
                    isP2 && incident.status !== 'CLOSED' ? 'bg-amber-600 text-white' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    <span>AI RANK #{analysis.rank}</span>
                  </span>

                  {/* Priority Tier */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    analysis.urgencyLevel === 'P1_CRITICAL' ? 'bg-red-950 text-red-300 border-red-700' :
                    analysis.urgencyLevel === 'P2_ELEVATED' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                    'bg-slate-900 text-slate-300 border-slate-700'
                  }`}>
                    {analysis.urgencyLevel === 'P1_CRITICAL' ? 'P1 - IMMEDIATE REVIEW' :
                     analysis.urgencyLevel === 'P2_ELEVATED' ? 'P2 - ELEVATED ACTION' :
                     analysis.urgencyLevel === 'P3_MODERATE' ? 'P3 - MODERATE QUEUE' : 'P4 - ROUTINE'}
                  </span>

                  <span className="text-xs font-bold text-blue-400">
                    #{incident.id}
                  </span>

                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A0F1D] text-blue-300 border border-slate-800">
                    ZONE {incident.zoneId}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  {/* Priority Score Bar */}
                  <div className="flex items-center space-x-1.5 bg-[#0A0F1D] px-2 py-1 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400">AI Priority Score:</span>
                    <strong className={`font-bold ${
                      analysis.priorityScore >= 80 ? 'text-red-400' :
                      analysis.priorityScore >= 60 ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      {analysis.priorityScore}/100
                    </strong>
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{incident.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* MAIN BODY: Two Columns (Left Details & Right AI Analysis) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 my-3">
                {/* Left: Incident Details (7 cols) */}
                <div className="lg:col-span-7 space-y-2">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <span>{incident.title}</span>
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                      {incident.description}
                    </p>
                  </div>

                  {/* Status, Human Verification & Assigned Team */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#0A0F1D] p-2.5 rounded border border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Operational Status</span>
                      <strong className={`text-xs ${
                        incident.status === 'CLOSED' ? 'text-slate-500' :
                        incident.status === 'MITIGATING' ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>
                        {incident.status}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Human Verification</span>
                      <strong className={`text-xs ${
                        incident.humanVerified ? 'text-green-400' : 'text-amber-400'
                      }`}>
                        {incident.humanVerified ? 'VERIFIED (Command Confirmed)' : 'PENDING GROUND VERIFY'}
                      </strong>
                    </div>
                  </div>

                  {incident.assignedTeamId && (
                    <div className="text-xs text-slate-300 flex items-center space-x-1.5 bg-[#0A0F1D] p-2 rounded border border-blue-900">
                      <Radio className="w-3.5 h-3.5 text-blue-400" />
                      <span>Assigned Unit: <strong className="text-white">{incident.assignedTeamId}</strong> (Active Deployment)</span>
                    </div>
                  )}
                </div>

                {/* Right: AI Prioritization Rationale & Factors (5 cols) */}
                <div className="lg:col-span-5 bg-[#0A0F1D] p-3 rounded border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
                    <span className="text-blue-400 font-bold flex items-center space-x-1">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>AI Triage Rationale</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Impact Zones: <strong className="text-slate-200">{analysis.affectedZonesList.join(', ')}</strong> ({analysis.affectedZonesCount})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed italic">
                    "{analysis.aiRationale}"
                  </p>

                  <div className="pt-1 text-[10px] bg-blue-950/40 p-2 rounded border border-blue-900/60 text-blue-300">
                    <strong className="text-white block mb-0.5">Recommended Action:</strong>
                    {analysis.suggestedAction}
                  </div>
                </div>
              </div>

              {/* ACTION TOOLBAR */}
              <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                
                {/* Team Assign Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Assign:</span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) assignTeamToIncident(incident.id, e.target.value);
                    }}
                    className="bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded px-2 py-1 text-[11px]"
                  >
                    <option value="" disabled>Select Response Unit...</option>
                    {responseTeams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.status} - {t.currentLocationZone ? `Zone ${t.currentLocationZone}` : 'Staging'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Simulate Counterfactual Button */}
                  <button
                    onClick={() => {
                      if (targetZone) setSelectedZone(targetZone);
                      setActiveTab('what-if-simulator');
                    }}
                    className="px-3 py-1 bg-blue-600/90 hover:bg-blue-500 text-white font-bold rounded text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Simulate Counterfactual Response</span>
                  </button>

                  {!incident.humanVerified && (
                    <button
                      onClick={() => verifyIncident(incident.id)}
                      className="px-3 py-1 bg-green-950/80 hover:bg-green-900 text-green-300 border border-green-700 rounded text-xs font-bold transition-colors"
                    >
                      Confirm / Verify
                    </button>
                  )}

                  {incident.status !== 'CLOSED' && (
                    <button
                      onClick={() => closeIncident(incident.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs transition-colors"
                    >
                      Resolve &amp; Close
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE NEW INCIDENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151C2C] border border-slate-700 rounded p-5 max-w-md w-full shadow-2xl space-y-4 font-mono-code">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white uppercase flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>REGISTER GROUND INCIDENT / ALERT</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Incident Title / Summary:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bottleneck surge near Gate 3 barricade"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-blue-500 font-mono-code"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Zone:</label>
                  <select
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded p-2 text-xs font-mono-code"
                  >
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>Zone {z.id} - {z.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity:</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded p-2 text-xs font-mono-code"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observation Details:</label>
                <textarea
                  rows={3}
                  placeholder="Describe ground evidence, crowd density observations, or obstruction points..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-blue-500 font-mono-code"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-md"
                >
                  Register Incident &amp; Trigger AI Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
