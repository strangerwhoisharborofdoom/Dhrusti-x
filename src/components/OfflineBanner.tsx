import React from 'react';
import { WifiOff, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const OfflineBanner: React.FC = () => {
  const { isOfflineMode, toggleOfflineMode } = useDrishti();

  if (!isOfflineMode) return null;

  return (
    <div className="bg-[#151C2C] border-b border-amber-600/80 px-4 py-2 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 shadow font-mono-code">
      <div className="flex items-center space-x-2.5">
        <div className="p-1 rounded bg-amber-950/80 text-amber-300 animate-pulse border border-amber-800">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-white uppercase tracking-wide">
            OFFLINE LOCAL SAFETY MODE ACTIVE:
          </span>
          <span className="ml-1 text-slate-300">
            Internet connection disconnected. Operating on local edge hydrodynamic simulation cache and in-memory decision ledger.
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0A0F1D] text-amber-200 border border-amber-700">
          LOCAL STATE PERSISTENT
        </span>
        <button
          onClick={toggleOfflineMode}
          className="text-xs text-amber-400 hover:text-white underline font-semibold transition-colors"
        >
          Restore Online Connection
        </button>
      </div>
    </div>
  );
};
