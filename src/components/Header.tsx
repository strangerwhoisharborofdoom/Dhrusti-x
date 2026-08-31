import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Play, 
  RotateCcw, 
  Award, 
  Bot, 
  Megaphone, 
  Users, 
  AlertTriangle, 
  Ambulance, 
  Radio, 
  Pause,
  Clock
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const Header: React.FC = () => {
  const { 
    telemetry, 
    isDemoRunning, 
    demoPhase, 
    demoAutoPlay, 
    isOfflineMode, 
    toggleOfflineMode, 
    startLiveDemo, 
    resetDemo, 
    nextDemoPhase,
    prevDemoPhase,
    toggleDemoAutoPlay,
    setIsJudgeModeOpen, 
    setIsAskAiOpen, 
    openAlertModalWithPreset 
  } = useDrishti();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const phaseTitles = [
    "Baseline Normal Crowd Flow",
    "Gate 3 Inflow Rate Increases",
    "Counter-Flow & Critical Compression Surge",
    "AI Transparent Root-Cause Analysis",
    "What-If Counterfactual Response Engine",
    "Multi-Scenario Ranking & Trade-Offs",
    "Human-in-the-Loop Operational Approval",
    "Simulated Risk Reduced & Audit Trail Logged"
  ];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 shadow-xl sticky top-0 z-40">
      {/* Primary Technical Command Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        
        {/* Brand Emblem & Nomenclature */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#FF4444] rounded flex items-center justify-center font-bold text-white text-xl shadow-md flex-shrink-0">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-tactical">
                DRISHTI-X
              </h1>
              <span className="text-[9px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 font-semibold">
                v2.4
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-medium">
              Public Gathering Safety & Response Intelligence
            </p>
          </div>
        </div>

        {/* Tactical Status, Project Ownership & Real-Time Clock */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          {/* Project Owner Meta */}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Project Owner</p>
            <p className="text-xs font-mono-code text-white">PAVAN C N | NCC KA2025SDIA2540816</p>
          </div>

          {/* Operational State Indicator */}
          <div className={`px-3 py-1 rounded flex items-center gap-2 border ${
            isOfflineMode 
              ? 'bg-amber-950/40 border-amber-500/50' 
              : 'bg-green-900/30 border-green-500/50'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isOfflineMode ? 'bg-amber-400 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
            <span className={`text-[10px] font-bold tracking-wider ${isOfflineMode ? 'text-amber-400' : 'text-green-400'}`}>
              {isOfflineMode ? 'OFFLINE SAFETY ACTIVE' : 'SYSTEM OPERATIONAL'}
            </span>
          </div>

          {/* Digital Clock */}
          <div className="text-lg font-mono-code text-white font-semibold tracking-wider flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-blue-400 opacity-80" />
            <span>{currentTime || '14:48:02'}</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar & Live Demo Controllers */}
      <div className="bg-[#151C2C] px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center flex-wrap gap-2">
            {/* Start / Control Live Demo */}
            {!isDemoRunning ? (
              <button
                onClick={startLiveDemo}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 font-bold text-xs tracking-widest uppercase transition-colors rounded flex items-center gap-1.5 shadow-sm shadow-blue-900/40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Live Demo</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded border border-blue-500/50">
                <button
                  onClick={toggleDemoAutoPlay}
                  className="px-2.5 py-1 bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-xs rounded font-medium flex items-center space-x-1"
                >
                  {demoAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{demoAutoPlay ? "Pause" : "Play"}</span>
                </button>
                <button
                  onClick={prevDemoPhase}
                  disabled={demoPhase <= 1}
                  className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30 text-xs"
                >
                  ◀
                </button>
                <span className="text-[11px] font-mono-code font-bold px-2 text-blue-400">
                  PHASE {demoPhase}/8
                </span>
                <button
                  onClick={nextDemoPhase}
                  disabled={demoPhase >= 8}
                  className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30 text-xs"
                >
                  ▶
                </button>
                <button
                  onClick={resetDemo}
                  title="Reset Demo to Baseline"
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Judge Mode Button */}
            <button
              onClick={() => setIsJudgeModeOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold rounded border border-amber-500/40 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Mode (90s)</span>
            </button>

            {/* Ask AI Assistant */}
            <button
              onClick={() => setIsAskAiOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded border border-blue-500/30 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask DRISHTI AI</span>
            </button>

            {/* Multilingual Alerts */}
            <button
              onClick={() => openAlertModalWithPreset()}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded border border-slate-700 transition-colors"
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Public Alerts</span>
            </button>
          </div>

          {/* Network Failure Simulator Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleOfflineMode}
              title={isOfflineMode ? "Switch to Online Mode" : "Simulate Network Failure (Offline Safety Mode)"}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                isOfflineMode 
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse' 
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isOfflineMode ? "Offline Active" : "Simulate Offline"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Demo Progression Strip */}
      {isDemoRunning && (
        <div className="bg-[#0A0F1D] border-b border-blue-900/60 px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-bold text-blue-400 uppercase tracking-widest text-[10px]">
              DEMO PHASE {demoPhase} of 8:
            </span>
            <span className="text-white font-medium">
              {phaseTitles[demoPhase - 1]}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono-code">
            <span>[SCENARIO MODE]</span>
            <button 
              onClick={resetDemo}
              className="text-blue-400 hover:text-blue-300 underline ml-2"
            >
              Exit Demo
            </button>
          </div>
        </div>
      )}

      {/* Telemetry Status Strip */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-[#94A3B8] gap-y-1.5 bg-[#0F172A]">
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#64748B] uppercase text-[10px] font-semibold">Active Event:</span>
            <span className="font-semibold text-slate-200">{telemetry.eventName}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#64748B] uppercase text-[10px] font-semibold">Venue:</span>
            <span className="text-slate-300 font-mono-code">{telemetry.location}</span>
          </div>
        </div>

        {/* Live Technical Grid Counters */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 font-mono-code text-[11px]">
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">ATTENDEES</span>
            <span className="text-white font-bold">{telemetry.totalAttendees.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">CRITICAL ZONES</span>
            <span className={`font-bold ${telemetry.criticalZonesCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              0{telemetry.criticalZonesCount}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">TEAMS ACTIVE</span>
            <span className="text-white font-bold">{telemetry.deployedTeamsCount}/8</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">AMBULANCES</span>
            <span className="text-green-400 font-bold">{telemetry.availableAmbulancesCount} READY</span>
          </div>
        </div>
      </div>
    </header>
  );
};
