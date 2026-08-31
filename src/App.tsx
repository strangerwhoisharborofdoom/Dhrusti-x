import React from 'react';
import { DrishtiProvider, useDrishti } from './context/DrishtiContext';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { Navigation } from './components/Navigation';
import { CommandCentreView } from './components/CommandCentreView';
import { LiveSituationView } from './components/LiveSituationView';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { IncidentsView } from './components/IncidentsView';
import { ResponseTeamsView } from './components/ResponseTeamsView';
import { ResourcesView } from './components/ResourcesView';
import { ReportsAuditView } from './components/ReportsAuditView';
import { VisionInputView } from './components/VisionInputView';
import { ValidationView } from './components/ValidationView';
import { AskAiDrawer } from './components/AskAiDrawer';
import { AlertGeneratorModal } from './components/AlertGeneratorModal';
import { JudgeModeModal } from './components/JudgeModeModal';

const AppContent: React.FC = () => {
  const { activeTab, responseTeams, ambulances } = useDrishti();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'command-centre':
        return <CommandCentreView />;
      case 'live-situation':
        return <LiveSituationView />;
      case 'risk-analysis':
        return <RiskAnalysisView />;
      case 'what-if-simulator':
        return <WhatIfSimulatorView />;
      case 'incidents':
        return <IncidentsView />;
      case 'response-teams':
        return <ResponseTeamsView />;
      case 'resources':
        return <ResourcesView />;
      case 'reports-audit':
        return <ReportsAuditView />;
      case 'vision-input':
        return <VisionInputView />;
      case 'validation':
        return <ValidationView />;
      default:
        return <CommandCentreView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-[#E2E8F0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Offline Status Alert if simulated offline */}
      <OfflineBanner />

      {/* Main Tab Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-3 lg:p-4 space-y-4">
        {renderActiveView()}
      </main>

      {/* Technical Dashboard Footer */}
      <footer className="bg-[#0F172A] border-t border-slate-800 px-4 py-3 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            
            {/* Tactical Teams Standby Indicators */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono-code">Teams:</span>
              <span className="px-2 py-0.5 bg-slate-800/80 text-[9px] text-green-400 border border-slate-700 rounded font-mono-code">
                Alpha [STBY]
              </span>
              <span className="px-2 py-0.5 bg-blue-950/60 text-[9px] text-blue-400 border border-blue-500/50 rounded font-mono-code font-semibold">
                Bravo [ENR]
              </span>
              <span className="px-2 py-0.5 bg-slate-800/80 text-[9px] text-slate-400 border border-slate-700 rounded font-mono-code">
                Charlie [OFF]
              </span>
              <span className="px-2 py-0.5 bg-slate-800/80 text-[9px] text-green-400 border border-slate-700 rounded font-mono-code">
                Delta [STBY]
              </span>
            </div>

            <div className="h-4 w-[1px] bg-slate-700 hidden md:block"></div>

            {/* Resources Tally */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono-code">Resources:</span>
              <span className="text-[10px] font-mono-code text-white">
                Amb: {ambulances.filter(a => a.status === 'STANDBY').length} | First Aid: 2 | Police: 24 | Volunteers: 48
              </span>
            </div>
          </div>

          {/* Operational Control Disclaimer */}
          <div className="text-[10px] text-slate-400 italic">
            DRISHTI-X is a decision-support prototype. Final operational control remains with authorized human personnel.
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AskAiDrawer />
      <AlertGeneratorModal />
      <JudgeModeModal />
    </div>
  );
};

export function App() {
  return (
    <DrishtiProvider>
      <AppContent />
    </DrishtiProvider>
  );
}

export default App;
