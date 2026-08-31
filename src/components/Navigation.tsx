import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  TrendingUp, 
  GitFork, 
  AlertOctagon, 
  UsersRound, 
  Boxes, 
  FileCheck2, 
  Eye, 
  BookOpenCheck 
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, incidents, telemetry } = useDrishti();

  const activeIncidentCount = incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;

  const navItems = [
    { id: 'command-centre', label: '1. Command Centre', icon: LayoutDashboard, badge: null },
    { id: 'live-situation', label: '2. Live Situation', icon: Activity, badge: null },
    { id: 'risk-analysis', label: '3. Risk Analysis', icon: TrendingUp, badge: telemetry.criticalZonesCount > 0 ? `${telemetry.criticalZonesCount} CRIT` : null, badgeColor: 'bg-red-950/80 text-red-400 border-red-800' },
    { id: 'what-if-simulator', label: '4. What-If Simulator', icon: GitFork, badge: 'CORE INNOVATION', badgeColor: 'bg-blue-950/80 text-blue-400 border-blue-700' },
    { id: 'incidents', label: '5. Incidents', icon: AlertOctagon, badge: activeIncidentCount > 0 ? `0${activeIncidentCount}` : null, badgeColor: 'bg-amber-950/80 text-amber-400 border-amber-800' },
    { id: 'response-teams', label: '6. Response Teams', icon: UsersRound, badge: null },
    { id: 'resources', label: '7. Resources & Logistics', icon: Boxes, badge: null },
    { id: 'reports-audit', label: '8. Reports & Audit', icon: FileCheck2, badge: null },
    { id: 'vision-input', label: 'Vision Input', icon: Eye, badge: 'CCTV/UAV', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
    { id: 'validation', label: 'Validation & Prior Art', icon: BookOpenCheck, badge: null },
  ];

  return (
    <nav className="bg-[#0F172A] border-b border-slate-800 sticky top-[108px] sm:top-[104px] z-30 overflow-x-auto shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex space-x-1 py-1.5 min-w-max">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-semibold transition-all whitespace-nowrap border ${
                isActive 
                  ? 'bg-[#151C2C] text-white border-blue-500 shadow-sm shadow-blue-950/50' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono-code border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
