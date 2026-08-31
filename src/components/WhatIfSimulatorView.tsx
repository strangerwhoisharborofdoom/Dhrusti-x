import React, { useState } from 'react';
import { 
  GitFork, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Sliders, 
  Info, 
  RefreshCw, 
  DoorOpen, 
  Megaphone, 
  Users, 
  Radio,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  FileCheck,
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageSquare,
  Send,
  History,
  Check
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';
import { SimulationScenarioResult, SimulationIntervention, GateStatus, ExitStatus, SimulatorFeedback } from '../types';

export const WhatIfSimulatorView: React.FC = () => {
  const { 
    zones, 
    gates, 
    exits, 
    responseTeams, 
    comparisonScenarios, 
    activeScenarioResult, 
    currentInterventionDraft, 
    updateInterventionDraft, 
    runCustomSimulation, 
    approveIntervention, 
    rejectIntervention,
    simulatorFeedbacks,
    addSimulatorFeedback
  } = useDrishti();

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [activeTabSub, setActiveTabSub] = useState<'scenarios' | 'custom'>('scenarios');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Feedback Form State
  const [vote, setVote] = useState<'UP' | 'DOWN'>('UP');
  const [utilityRating, setUtilityRating] = useState<number>(5);
  const [accuracyRating, setAccuracyRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Realistic crowd flow', 'Clear trade-offs']);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmittedMsg, setFeedbackSubmittedMsg] = useState<string | null>(null);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState<boolean>(true);

  const availableTags = [
    'Realistic crowd flow',
    'Clear trade-offs',
    'Identified secondary bottleneck',
    'Accurate warning indicators',
    'Dispersal ETA reasonable',
    'Conservative risk estimate',
    'Practical for field deployment'
  ];

  const displayedScenario: SimulationScenarioResult = activeTabSub === 'scenarios' 
    ? (comparisonScenarios[selectedScenarioIndex] || comparisonScenarios[0])
    : (activeScenarioResult || comparisonScenarios[0]);

  const handleApprove = (scenario: SimulationScenarioResult) => {
    approveIntervention(scenario);
    setActionSuccessMessage(`Human Operator Approved: ${scenario.name}. Orders logged in Audit Trail.`);
    setTimeout(() => setActionSuccessMessage(null), 6000);
  };

  const handleReject = (scenario: SimulationScenarioResult) => {
    rejectIntervention(scenario, "Operator elected not to proceed with this configuration.");
    setActionSuccessMessage(`Intervention rejected by Operator.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSimulatorFeedback({
      scenarioId: displayedScenario.id,
      scenarioName: displayedScenario.name,
      vote,
      utilityRating,
      accuracyRating,
      tags: selectedTags,
      comments: feedbackComment || 'Demonstration evaluation recorded by operator.',
    });

    setFeedbackSubmittedMsg(`Feedback logged for ${displayedScenario.name}! Saved to local storage.`);
    setFeedbackComment('');
    setTimeout(() => setFeedbackSubmittedMsg(null), 5000);
  };

  // Compute aggregate feedback statistics
  const avgUtility = simulatorFeedbacks.length > 0
    ? (simulatorFeedbacks.reduce((acc, f) => acc + f.utilityRating, 0) / simulatorFeedbacks.length).toFixed(1)
    : '5.0';

  const avgAccuracy = simulatorFeedbacks.length > 0
    ? (simulatorFeedbacks.reduce((acc, f) => acc + f.accuracyRating, 0) / simulatorFeedbacks.length).toFixed(1)
    : '4.8';

  const upvotePercent = simulatorFeedbacks.length > 0
    ? Math.round((simulatorFeedbacks.filter(f => f.vote === 'UP').length / simulatorFeedbacks.length) * 100)
    : 100;

  return (
    <div className="space-y-4 font-mono-code">
      {/* Header Banner */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 shadow-md rounded">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-700/80">
                <GitFork className="w-5 h-5" />
              </span>
              <h2 className="font-mono-code text-base sm:text-lg font-bold tracking-wider text-white uppercase">
                COUNTERFACTUAL INTERVENTION SIMULATOR
              </h2>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-700">
                WHAT-IF ENGINE
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-3xl">
              Model the systemic impact of opening/closing gates, adjusting flow throttles, clearing exits, and dispatching personnel <em>before</em> physical orders are issued.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono-code px-2.5 py-1 rounded bg-[#0A0F1D] text-amber-300 border border-amber-800/80">
              SIMULATION / DEMONSTRATION OUTPUT
            </span>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>⚠️ <em>Simulation suggests expected outcomes based on hydrodynamic flow models. It does not guarantee stampede prevention.</em></span>
          <span className="text-blue-400 font-semibold font-mono-code">Human Approval Required for all actions.</span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="bg-green-950/80 border border-green-500 text-green-200 px-4 py-3 rounded flex items-center space-x-3 shadow-lg font-mono-code">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className="text-xs font-semibold">
            {actionSuccessMessage}
          </div>
        </div>
      )}

      {/* Mode Switcher: Pre-configured Scenarios vs Custom Parameter Sandbox */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 font-mono-code">
        <button
          onClick={() => setActiveTabSub('scenarios')}
          className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all border ${
            activeTabSub === 'scenarios'
              ? 'bg-[#151C2C] text-white border-blue-500 shadow-sm'
              : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          Preset Strategies (A vs B vs C)
        </button>
        <button
          onClick={() => setActiveTabSub('custom')}
          className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all border ${
            activeTabSub === 'custom'
              ? 'bg-[#151C2C] text-white border-blue-500 shadow-sm'
              : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          Interactive Parameter Sandbox
        </button>
      </div>

      {/* SUB-VIEW 1: MULTI-SCENARIO COMPARISON (Strategy A vs B vs C) */}
      {activeTabSub === 'scenarios' && (
        <div className="space-y-4">
          
          {/* Strategy Selector Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {comparisonScenarios.map((scenario, index) => {
              const isSelected = selectedScenarioIndex === index;
              const isBest = scenario.recommendationRating === 'BEST_SIMULATED_OPTION';
              const isRisky = scenario.recommendationRating === 'HIGHER_RISK_OPTION';

              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenarioIndex(index)}
                  className={`p-3.5 rounded border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-[#151C2C] border-blue-500 shadow-md shadow-blue-950/50' 
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Rating Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border ${
                      isBest ? 'bg-green-950/80 text-green-400 border-green-700' :
                      isRisky ? 'bg-red-950/80 text-red-400 border-red-700' :
                      'bg-amber-950/80 text-amber-400 border-amber-700'
                    }`}>
                      {scenario.recommendationRating.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code font-bold">
                      {scenario.id}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1.5">
                    {scenario.name}
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 mb-3">
                    {scenario.strategyDescription}
                  </p>

                  {/* Key Projected Result */}
                  <div className="bg-[#0A0F1D] p-2 rounded border border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
                    <span className="text-slate-400">Zone C Projected:</span>
                    <span className={`font-bold ${isBest ? 'text-green-400' : isRisky ? 'text-red-400' : 'text-amber-400'}`}>
                      {scenario.zoneOutcomes['C']?.simulatedRisk || 45}/100 Risk
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: CUSTOM PARAMETER SANDBOX (Tweak gates, exits, teams in real-time) */}
      {activeTabSub === 'custom' && (
        <div className="bg-[#151C2C] border border-slate-800 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-mono-code text-sm font-bold text-white uppercase flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>CUSTOM PARAMETER COUNTERFACTUAL SANDBOX</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Adjust live gate throttles and exit statuses to observe calculated hydrodynamic risk variations.
              </p>
            </div>
            <button
              onClick={() => runCustomSimulation()}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs font-mono-code shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RUN SIMULATION</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
            {/* Gate Controls */}
            <div className="bg-[#0F172A] p-3 rounded border border-slate-800 space-y-2.5">
              <span className="font-bold text-slate-300 block uppercase text-[10px]">1. Gate Throttling</span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Gate 3 (Fast-Pass Bottleneck):</label>
                <select
                  value={currentInterventionDraft.gateModifications?.['G3']?.status || 'REGULATED'}
                  onChange={(e) => {
                    const val = e.target.value as GateStatus;
                    updateInterventionDraft(prev => ({
                      ...prev,
                      gateModifications: {
                        ...prev.gateModifications,
                        G3: { status: val, throttlePercent: val === 'CLOSED' ? 100 : val === 'REGULATED' ? 40 : 0 }
                      }
                    }));
                  }}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded p-1.5 text-xs"
                >
                  <option value="OPEN">OPEN (100% Inflow - Risky)</option>
                  <option value="REGULATED">REGULATED (Paced 40% Throttle)</option>
                  <option value="CLOSED">CLOSED (Full Inflow Halt)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Gate 5 (South Dispersal):</label>
                <select
                  value={currentInterventionDraft.gateModifications?.['G5']?.status || 'OPEN'}
                  onChange={(e) => {
                    const val = e.target.value as GateStatus;
                    updateInterventionDraft(prev => ({
                      ...prev,
                      gateModifications: {
                        ...prev.gateModifications,
                        G5: { status: val, throttlePercent: 0 }
                      }
                    }));
                  }}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded p-1.5 text-xs"
                >
                  <option value="OPEN">OPEN (Dispersal Pathway Active)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* Exit Controls */}
            <div className="bg-[#0F172A] p-3 rounded border border-slate-800 space-y-2.5">
              <span className="font-bold text-slate-300 block uppercase text-[10px]">2. Emergency Exits</span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Exit E2 (South-West):</label>
                <select
                  value={currentInterventionDraft.exitModifications?.['E2'] || 'CLEAR'}
                  onChange={(e) => {
                    const val = e.target.value as ExitStatus;
                    updateInterventionDraft(prev => ({
                      ...prev,
                      exitModifications: {
                        ...prev.exitModifications,
                        E2: val
                      }
                    }));
                  }}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded p-1.5 text-xs"
                >
                  <option value="CLEAR">CLEAR (Full 300 ppl/m Capacity)</option>
                  <option value="PARTIAL_OBSTRUCTION">PARTIAL (Reduced 120 ppl/m)</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Exit E3 (East):</label>
                <select
                  value={currentInterventionDraft.exitModifications?.['E3'] || 'CLEAR'}
                  onChange={(e) => {
                    const val = e.target.value as ExitStatus;
                    updateInterventionDraft(prev => ({
                      ...prev,
                      exitModifications: {
                        ...prev.exitModifications,
                        E3: val
                      }
                    }));
                  }}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded p-1.5 text-xs"
                >
                  <option value="CLEAR">CLEAR (Active)</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>
            </div>

            {/* Tactical Deployment & Broadcast */}
            <div className="bg-[#0F172A] p-3 rounded border border-slate-800 space-y-2.5">
              <span className="font-bold text-slate-300 block uppercase text-[10px]">3. Response Squad Routing</span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Deploy Team Alpha to:</label>
                <select
                  value={currentInterventionDraft.teamDeployments?.['ALPHA'] || 'C'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateInterventionDraft(prev => ({
                      ...prev,
                      teamDeployments: {
                        ...prev.teamDeployments,
                        ALPHA: val
                      }
                    }));
                  }}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded p-1.5 text-xs"
                >
                  <option value="C">Zone C (High Density Core)</option>
                  <option value="B">Zone B (Concourse Buffer)</option>
                  <option value="G3">Gate 3 Perimeter</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">PA Audio Advisory:</label>
                <select
                  value={currentInterventionDraft.publicBroadcast || 'REDIRECTION_ANNOUNCEMENT'}
                  onChange={(e) => {
                    const val = e.target.value as SimulationIntervention['publicBroadcast'];
                    updateInterventionDraft(prev => ({
                      ...prev,
                      publicBroadcast: val
                    }));
                  }}
                  className="w-full bg-[#0A0F1D] border border-slate-700 text-slate-200 rounded p-1.5 text-xs"
                >
                  <option value="REDIRECTION_ANNOUNCEMENT">Redirection: "Proceed smoothly to Gate 5"</option>
                  <option value="CALM_PACING_NOTICE">Calm Pacing: "Maintain steady movement"</option>
                  <option value="EVACUATION_INSTRUCTION">Full Evacuation Broadcast</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RESULTS DISPLAY FOR SELECTED SCENARIO */}
      <div className="bg-[#151C2C] border border-slate-800 rounded p-4 space-y-4">
        
        {/* Scenario Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono-code font-bold text-sm text-blue-400">
                {displayedScenario.id}:
              </span>
              <h3 className="font-bold text-base text-white">
                {displayedScenario.name}
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {displayedScenario.strategyDescription}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0A0F1D] text-slate-300 border border-slate-700">
              Confidence: {Math.round(displayedScenario.confidenceScore * 100)}%
            </span>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700">
              Coverage Score: {displayedScenario.responseCoverageScore}%
            </span>
          </div>
        </div>

        {/* COMPARISON TABLE: CURRENT STATE vs SIMULATED STATE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-code font-bold text-slate-400 uppercase px-2">
            <span>ZONE / METRIC</span>
            <div className="flex space-x-12 sm:space-x-20 pr-4">
              <span>CURRENT</span>
              <span>SIMULATED</span>
              <span>IMPACT (Δ)</span>
            </div>
          </div>

          <div className="space-y-2">
            {Object.values(displayedScenario.zoneOutcomes).map((outcome) => {
              const isImproved = outcome.riskDelta < 0;
              const isWorsened = outcome.riskDelta > 0;

              return (
                <div 
                  key={outcome.zoneId}
                  className={`p-3 rounded border text-xs transition-all ${
                    outcome.zoneId === 'C' ? 'bg-[#0F172A] border-blue-600/70 shadow-sm' : 'bg-[#0A0F1D] border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-[#151C2C] text-blue-300 font-bold font-mono-code flex items-center justify-center border border-slate-700 text-xs">
                        {outcome.zoneId}
                      </span>
                      <div>
                        <span className="font-bold text-white text-xs">{outcome.zoneName}</span>
                        {outcome.warningNote && (
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {outcome.warningNote}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-10 sm:space-x-16 font-mono-code text-xs pr-2">
                      {/* Current Risk */}
                      <span className="text-slate-300 font-semibold w-12 text-right">
                        {outcome.currentRisk}/100
                      </span>

                      {/* Simulated Risk */}
                      <span className={`font-bold w-12 text-right ${
                        outcome.simulatedRisk < 40 ? 'text-green-400' :
                        outcome.simulatedRisk < 60 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {outcome.simulatedRisk}/100
                      </span>

                      {/* Delta */}
                      <span className={`font-bold flex items-center justify-end w-14 ${
                        isImproved ? 'text-green-400' : isWorsened ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {isImproved ? <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> : isWorsened ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : null}
                        {outcome.riskDelta > 0 ? `+${outcome.riskDelta}` : outcome.riskDelta}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI RATIONALE & TRADE-OFFS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          
          {/* Recommendation Box */}
          <div className="bg-[#0A0F1D] rounded p-3.5 border border-blue-800/60 text-xs space-y-1.5">
            <span className="font-mono-code uppercase font-bold text-blue-400 text-[10px] block flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>SIMULATION RECOMMENDATION:</span>
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              "{displayedScenario.rationale}"
            </p>
          </div>

          {/* Explicit Trade-Offs Box */}
          <div className="bg-[#0A0F1D] rounded p-3.5 border border-amber-800/60 text-xs space-y-1.5">
            <span className="font-mono-code uppercase font-bold text-amber-400 text-[10px] block flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>IDENTIFIED OPERATIONAL TRADE-OFFS:</span>
            </span>
            <ul className="space-y-1 text-slate-300">
              {displayedScenario.tradeOffs.map((t, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* MANDATORY HUMAN-IN-THE-LOOP APPROVAL WORKFLOW */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#0A0F1D] p-3 rounded border border-slate-800">
          <div>
            <span className="text-[10px] font-mono-code uppercase text-slate-400 font-bold block">
              HUMAN COMMAND AUTHORIZATION REQUIRED
            </span>
            <p className="text-xs text-slate-300">
              DRISHTI-X provides decision support. Final operational decisions remain with authorized personnel.
            </p>
          </div>

          {/* Action Buttons: Review, Approve, Reject */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleReject(displayedScenario)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-red-300 font-semibold rounded text-xs border border-red-800/60 transition-colors font-mono-code"
            >
              <XCircle className="w-4 h-4 text-red-400" />
              <span>REJECT INTERVENTION</span>
            </button>

            <button
              onClick={() => handleApprove(displayedScenario)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded text-xs shadow-md border border-green-400/40 transition-colors font-mono-code"
            >
              <CheckCircle2 className="w-4 h-4 text-green-200" />
              <span>APPROVE & DISPATCH ORDERS</span>
            </button>
          </div>
        </div>

      </div>

      {/* FEEDBACK MECHANISM: OPERATOR & JUDGE SIMULATION ACCURACY / UTILITY FEEDBACK */}
      <div className="bg-[#151C2C] border border-blue-900/60 rounded p-4 space-y-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-white uppercase flex items-center space-x-2">
                <span>SIMULATION FEEDBACK &amp; UTILITY EVALUATION</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-green-950 text-green-400 border border-green-800 font-bold">
                  LOCAL PERSISTENCE
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Provide operator feedback on the perceived utility, accuracy, and trade-off realism of <strong>{displayedScenario.name}</strong>.
              </p>
            </div>
          </div>

          {/* Aggregate Quick Metrics */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-[#0A0F1D] px-2.5 py-1 rounded border border-slate-800 text-[11px]">
              <span className="text-slate-400">Avg Utility: </span>
              <strong className="text-green-400 font-bold">{avgUtility} / 5.0</strong>
            </div>
            <div className="bg-[#0A0F1D] px-2.5 py-1 rounded border border-slate-800 text-[11px]">
              <span className="text-slate-400">Accuracy Score: </span>
              <strong className="text-blue-400 font-bold">{avgAccuracy} / 5.0</strong>
            </div>
            <div className="bg-[#0A0F1D] px-2.5 py-1 rounded border border-slate-800 text-[11px]">
              <span className="text-slate-400">Positive: </span>
              <strong className="text-amber-300 font-bold">{upvotePercent}%</strong>
            </div>
          </div>
        </div>

        {/* Feedback Success Notification */}
        {feedbackSubmittedMsg && (
          <div className="bg-green-950/90 border border-green-500 text-green-200 px-3.5 py-2.5 rounded text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{feedbackSubmittedMsg}</span>
          </div>
        )}

        {/* Feedback Submission Form */}
        <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 text-xs bg-[#0F172A] p-3.5 rounded border border-slate-800">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Thumbs Up / Down */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block uppercase text-[10px]">
                1. Overall Assessment
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setVote('UP')}
                  className={`flex-1 py-2 px-3 rounded flex items-center justify-center space-x-2 border transition-all ${
                    vote === 'UP'
                      ? 'bg-green-950 text-green-300 border-green-500 shadow-sm'
                      : 'bg-[#0A0F1D] text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="font-bold">Useful / Sound</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVote('DOWN')}
                  className={`flex-1 py-2 px-3 rounded flex items-center justify-center space-x-2 border transition-all ${
                    vote === 'DOWN'
                      ? 'bg-red-950 text-red-300 border-red-500 shadow-sm'
                      : 'bg-[#0A0F1D] text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 text-red-400" />
                  <span className="font-bold">Flawed / Unsafe</span>
                </button>
              </div>
            </div>

            {/* 2. Utility Rating (1-5 Stars) */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block uppercase text-[10px] flex items-center justify-between">
                <span>2. Perceived Decision Utility</span>
                <span className="text-blue-400 font-bold">{utilityRating} / 5 Stars</span>
              </label>
              <div className="flex items-center space-x-1 bg-[#0A0F1D] p-1.5 rounded border border-slate-800 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setUtilityRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= utilityRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Accuracy / Physical Realism (1-5 Stars) */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block uppercase text-[10px] flex items-center justify-between">
                <span>3. Dispersal Model Realism</span>
                <span className="text-green-400 font-bold">{accuracyRating} / 5 Stars</span>
              </label>
              <div className="flex items-center space-x-1 bg-[#0A0F1D] p-1.5 rounded border border-slate-800 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setAccuracyRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= accuracyRating ? 'text-green-400 fill-green-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tag Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-slate-300 font-bold block uppercase text-[10px]">
              Observation Tags (Select all that apply):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded text-[11px] border transition-all flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-blue-950 text-blue-300 border-blue-500 font-bold'
                        : 'bg-[#0A0F1D] text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-blue-400" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qualitative Comment Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-slate-300 font-bold block uppercase text-[10px]">
              Operator Qualitative Observations &amp; Calibration Notes:
            </label>
            <input
              type="text"
              placeholder="e.g. Model accurately anticipated secondary surge in Zone D when Gate 3 was throttled..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-blue-500 font-mono-code"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>LOG EVALUATION FEEDBACK</span>
            </button>
          </div>
        </form>

        {/* FEEDBACK HISTORY LIST */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setShowFeedbackHistory(!showFeedbackHistory)}
              className="flex items-center space-x-1.5 text-slate-300 font-bold hover:text-white"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Operator Feedback Audit Log ({simulatorFeedbacks.length} Entries)</span>
            </button>
            <span className="text-[10px] text-slate-400">Stored locally in browser state</span>
          </div>

          {showFeedbackHistory && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {simulatorFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-[#0A0F1D] p-2.5 rounded border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        fb.vote === 'UP' ? 'bg-green-950 text-green-300 border border-green-700' : 'bg-red-950 text-red-300 border border-red-700'
                      }`}>
                        {fb.vote === 'UP' ? 'THUMBS UP' : 'THUMBS DOWN'}
                      </span>
                      <strong className="text-white">{fb.scenarioName}</strong>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-400 text-[10px]">
                      <span>Utility: <strong className="text-amber-400">{fb.utilityRating}/5</strong></span>
                      <span>Realism: <strong className="text-green-400">{fb.accuracyRating}/5</strong></span>
                      <span>{fb.timestamp}</span>
                    </div>
                  </div>

                  {fb.comments && (
                    <p className="text-[11px] text-slate-300 italic">
                      "{fb.comments}"
                    </p>
                  )}

                  {fb.tags && fb.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {fb.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
