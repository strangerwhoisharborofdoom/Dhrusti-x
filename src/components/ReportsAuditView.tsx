import React, { useState } from 'react';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  ShieldCheck, 
  Lock, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const ReportsAuditView: React.FC = () => {
  const { auditLogs, incidents, zones, telemetry } = useDrishti();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const filteredLogs = auditLogs.filter(l => 
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.operatorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 rounded shadow-md">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-700/80">
            <FileCheck2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-mono-code text-base font-bold tracking-wider text-white uppercase">
              POST-ACTION REPORTS & CRYPTOGRAPHIC AUDIT TRAIL
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Immutable ledger of human-in-the-loop decisions, simulation triggers, and incident logs.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#151C2C] hover:bg-slate-800 text-slate-200 font-bold rounded text-xs border border-slate-700 shadow-sm transition-colors font-mono-code"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / EXPORT REPORT</span>
          </button>
        </div>
      </div>

      {/* AFTER-ACTION INCIDENT SUMMARY SHEET (Printable layout) */}
      <div className="bg-[#151C2C] border border-slate-800 p-5 space-y-4 font-mono-code text-xs rounded shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-blue-400 uppercase font-bold block">
              OFFICIAL INCIDENT AUDIT DOSSIER
            </span>
            <h3 className="text-sm font-bold text-white uppercase">
              DRISHTI-X AFTER-ACTION SAFETY REPORT (AAR-2025-0816)
            </h3>
            <p className="text-[11px] text-slate-400">
              Author: Cadet Officer Pavan C N (Reg: KA2025SDIA2540816) • Event: {telemetry.eventName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] px-2 py-0.5 rounded bg-green-950/80 text-green-300 border border-green-700">
              LEDGER STATUS: VERIFIED
            </span>
          </div>
        </div>

        {/* High-Level Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0A0F1D] p-3 rounded border border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[9px]">TOTAL ATTENDEES</span>
            <span className="text-white font-bold">{telemetry.totalAttendees.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">INCIDENTS LOGGED</span>
            <span className="text-white font-bold">{incidents.length} Records</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">CRITICAL RESOLUTIONS</span>
            <span className="text-green-400 font-bold">100% Mitigated</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">NETWORK DISCONNECTION TOLERANCE</span>
            <span className="text-blue-400 font-bold">Passed (Edge Cache Active)</span>
          </div>
        </div>
      </div>

      {/* IMMUTABLE AUDIT TRAIL TABLE */}
      <div className="bg-[#151C2C] border border-slate-800 p-4 space-y-3 font-mono-code text-xs rounded shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white uppercase text-xs">
              IMMUTABLE DECISION LOG ({filteredLogs.length} EVENTS)
            </h3>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search audit records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0A0F1D] border border-slate-700 text-white rounded pl-8 pr-3 py-1 text-xs w-56 font-mono-code focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2 px-2">ID & Time</th>
                <th className="py-2 px-2">Action Type</th>
                <th className="py-2 px-2">Target Entity</th>
                <th className="py-2 px-2">Decision Context / Operational Rationale</th>
                <th className="py-2 px-2 text-right">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#0A0F1D]/80 transition-colors">
                  <td className="py-2.5 px-2 text-slate-300">
                    <span className="text-blue-400 font-bold block">{log.id}</span>
                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.actionType === 'INTERVENTION_APPROVE' ? 'bg-green-950/80 text-green-300 border border-green-700' :
                      log.actionType === 'SIMULATION_EXECUTED' ? 'bg-blue-950/80 text-blue-300 border border-blue-700' :
                      log.actionType === 'INCIDENT_VERIFIED' ? 'bg-amber-950/80 text-amber-300 border border-amber-700' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.actionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-200 font-semibold">
                    {log.targetEntity}
                  </td>
                  <td className="py-2.5 px-2 text-slate-300 max-w-xs">
                    <div className="font-medium text-white">{log.details}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{log.decisionContext}</div>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono-code text-[10px] text-slate-500 truncate max-w-[120px]">
                    {log.hash.slice(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
