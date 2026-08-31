import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Zone, 
  Gate, 
  EmergencyExit, 
  ResponseTeam, 
  AmbulanceUnit, 
  Incident, 
  ParkingArea, 
  SystemTelemetry, 
  SimulationIntervention,
  SimulationScenarioResult,
  AuditEvent,
  RiskLevel,
  SimulatorFeedback
} from '../types';
import { 
  INITIAL_TELEMETRY, 
  INITIAL_ZONES, 
  INITIAL_GATES, 
  INITIAL_EXITS, 
  INITIAL_RESPONSE_TEAMS, 
  INITIAL_AMBULANCES, 
  INITIAL_PARKING, 
  INITIAL_INCIDENTS, 
  INITIAL_AUDIT_LOG,
  INITIAL_SIMULATOR_FEEDBACK 
} from '../mockData';

interface DrishtiContextType {
  telemetry: SystemTelemetry;
  zones: Zone[];
  gates: Gate[];
  exits: EmergencyExit[];
  responseTeams: ResponseTeam[];
  ambulances: AmbulanceUnit[];
  parkingAreas: ParkingArea[];
  incidents: Incident[];
  auditLogs: AuditEvent[];
  simulatorFeedbacks: SimulatorFeedback[];
  selectedZone: Zone | null;
  selectedIncident: Incident | null;
  activeTab: string;
  isDemoRunning: boolean;
  demoPhase: number;
  demoAutoPlay: boolean;
  isOfflineMode: boolean;
  isJudgeModeOpen: boolean;
  isAskAiOpen: boolean;
  isAlertModalOpen: boolean;
  alertModalPreset: { situation?: string; targetZones?: string; actionRequired?: string } | null;
  comparisonScenarios: SimulationScenarioResult[];
  activeScenarioResult: SimulationScenarioResult | null;
  currentInterventionDraft: SimulationIntervention;

  // Actions
  setActiveTab: (tab: string) => void;
  setSelectedZone: (zone: Zone | null) => void;
  setSelectedIncident: (incident: Incident | null) => void;
  toggleOfflineMode: () => void;
  setIsJudgeModeOpen: (open: boolean) => void;
  setIsAskAiOpen: (open: boolean) => void;
  openAlertModalWithPreset: (preset?: { situation?: string; targetZones?: string; actionRequired?: string }) => void;
  closeAlertModal: () => void;

  // Incident Operations
  verifyIncident: (incidentId: string, notes?: string) => void;
  closeIncident: (incidentId: string, notes?: string) => void;
  assignTeamToIncident: (incidentId: string, teamId: string) => void;
  createNewIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'humanVerified'>) => void;

  // Response Team Operations
  dispatchTeam: (teamId: string, zoneId: string, incidentId?: string) => void;
  recallTeam: (teamId: string) => void;

  // Gate & Exit Overrides
  updateGateStatus: (gateId: string, status: Gate['status'], throttlePercent?: number) => void;
  updateExitStatus: (exitId: string, status: EmergencyExit['status']) => void;

  // Simulation Operations
  updateInterventionDraft: (updater: (prev: SimulationIntervention) => SimulationIntervention) => void;
  runCustomSimulation: (intervention?: SimulationIntervention) => SimulationScenarioResult;
  approveIntervention: (scenario: SimulationScenarioResult) => void;
  rejectIntervention: (scenario: SimulationScenarioResult, reason?: string) => void;
  addSimulatorFeedback: (feedback: Omit<SimulatorFeedback, 'id' | 'timestamp' | 'operator'>) => void;

  // Demo Mode Controller
  startLiveDemo: () => void;
  nextDemoPhase: () => void;
  prevDemoPhase: () => void;
  jumpToDemoPhase: (phase: number) => void;
  resetDemo: () => void;
  toggleDemoAutoPlay: () => void;

  // Audit
  addAuditRecord: (actionType: AuditEvent['actionType'], details: string, targetEntity: string, decisionContext: string) => void;
}

const DrishtiContext = createContext<DrishtiContextType | undefined>(undefined);

const OPERATOR_ID = "KA2025SDIA2540816";
const OPERATOR_NAME = "Cadet Officer Pavan C N (NCC)";

export const DrishtiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(() => {
    const saved = localStorage.getItem('drishti_telemetry');
    return saved ? JSON.parse(saved) : INITIAL_TELEMETRY;
  });

  const [zones, setZones] = useState<Zone[]>(() => {
    const saved = localStorage.getItem('drishti_zones');
    return saved ? JSON.parse(saved) : INITIAL_ZONES;
  });

  const [gates, setGates] = useState<Gate[]>(() => {
    const saved = localStorage.getItem('drishti_gates');
    return saved ? JSON.parse(saved) : INITIAL_GATES;
  });

  const [exits, setExits] = useState<EmergencyExit[]>(() => {
    const saved = localStorage.getItem('drishti_exits');
    return saved ? JSON.parse(saved) : INITIAL_EXITS;
  });

  const [responseTeams, setResponseTeams] = useState<ResponseTeam[]>(() => {
    const saved = localStorage.getItem('drishti_teams');
    return saved ? JSON.parse(saved) : INITIAL_RESPONSE_TEAMS;
  });

  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>(() => {
    const saved = localStorage.getItem('drishti_ambulances');
    return saved ? JSON.parse(saved) : INITIAL_AMBULANCES;
  });

  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>(() => {
    const saved = localStorage.getItem('drishti_parking');
    return saved ? JSON.parse(saved) : INITIAL_PARKING;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('drishti_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem('drishti_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
  });

  const [simulatorFeedbacks, setSimulatorFeedbacks] = useState<SimulatorFeedback[]>(() => {
    const saved = localStorage.getItem('drishti_simulator_feedback');
    return saved ? JSON.parse(saved) : INITIAL_SIMULATOR_FEEDBACK;
  });

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<string>('command-centre');

  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoPhase, setDemoPhase] = useState<number>(1);
  const [demoAutoPlay, setDemoAutoPlay] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState<boolean>(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertModalPreset, setAlertModalPreset] = useState<{ situation?: string; targetZones?: string; actionRequired?: string } | null>(null);

  const [currentInterventionDraft, setCurrentInterventionDraft] = useState<SimulationIntervention>({
    gateModifications: {
      G3: { status: 'REGULATED', throttlePercent: 40 },
      G5: { status: 'OPEN', throttlePercent: 0 },
    },
    exitModifications: {
      E2: 'CLEAR',
      E3: 'CLEAR',
    },
    teamDeployments: {
      ALPHA: 'C',
    },
    parkingInflowThrottle: 'MEDIUM',
    publicBroadcast: 'REDIRECTION_ANNOUNCEMENT',
  });

  const [activeScenarioResult, setActiveScenarioResult] = useState<SimulationScenarioResult | null>(null);
  const [comparisonScenarios, setComparisonScenarios] = useState<SimulationScenarioResult[]>([]);

  // Sync to local state
  useEffect(() => {
    try {
      localStorage.setItem('drishti_telemetry', JSON.stringify(telemetry));
      localStorage.setItem('drishti_zones', JSON.stringify(zones));
      localStorage.setItem('drishti_gates', JSON.stringify(gates));
      localStorage.setItem('drishti_exits', JSON.stringify(exits));
      localStorage.setItem('drishti_teams', JSON.stringify(responseTeams));
      localStorage.setItem('drishti_incidents', JSON.stringify(incidents));
      localStorage.setItem('drishti_audit', JSON.stringify(auditLogs));
      localStorage.setItem('drishti_simulator_feedback', JSON.stringify(simulatorFeedbacks));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [telemetry, zones, gates, exits, responseTeams, incidents, auditLogs, simulatorFeedbacks]);

  // Cryptographic-style audit record helper
  const addAuditRecord = useCallback((
    actionType: AuditEvent['actionType'],
    details: string,
    targetEntity: string,
    decisionContext: string
  ) => {
    const timestamp = new Date().toLocaleTimeString('en-GB');
    const pseudoHash = Array.from(details + timestamp + Math.random().toString())
      .map(c => c.charCodeAt(0).toString(16))
      .join('')
      .slice(0, 64);

    const newRecord: AuditEvent = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp,
      operatorId: OPERATOR_ID,
      operatorName: OPERATOR_NAME,
      actionType,
      details,
      targetEntity,
      decisionContext,
      hash: pseudoHash.padEnd(64, '0'),
    };

    setAuditLogs(prev => [newRecord, ...prev]);
  }, []);

  // Update Telemetry counts when zones/incidents change
  useEffect(() => {
    const critCount = zones.filter(z => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH').length;
    const activeInc = incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;
    const deployedTeams = responseTeams.filter(t => t.status === 'DEPLOYED').length;

    setTelemetry(prev => ({
      ...prev,
      criticalZonesCount: critCount,
      activeIncidentsCount: activeInc,
      deployedTeamsCount: deployedTeams,
    }));
  }, [zones, incidents, responseTeams]);

  // Offline Mode Toggle
  const toggleOfflineMode = useCallback(() => {
    setIsOfflineMode(prev => {
      const next = !prev;
      setTelemetry(t => ({
        ...t,
        networkStatus: next ? 'OFFLINE_LOCAL_SAFETY_MODE' : 'ONLINE',
      }));
      addAuditRecord(
        'NETWORK_MODE_CHANGE',
        `Network mode switched to ${next ? 'OFFLINE LOCAL SAFETY MODE' : 'ONLINE'}`,
        'System Network Layer',
        next ? 'Simulated edge network disconnection. Local decision engine activated.' : 'Re-established online network link.'
      );
      return next;
    });
  }, [addAuditRecord]);

  // Multilingual alert modal trigger
  const openAlertModalWithPreset = useCallback((preset?: { situation?: string; targetZones?: string; actionRequired?: string }) => {
    setAlertModalPreset(preset || null);
    setIsAlertModalOpen(true);
  }, []);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
    setAlertModalPreset(null);
  }, []);

  // Incident Operations
  const verifyIncident = useCallback((incidentId: string, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          humanVerified: true,
          status: 'VERIFIED',
          operatorNotes: notes || inc.operatorNotes || 'Verified by Command Officer on ground telemetry.',
          updatedAt: new Date().toISOString(),
        };
      }
      return inc;
    }));

    addAuditRecord(
      'INCIDENT_VERIFIED',
      `Incident ${incidentId} marked as verified by human operator.`,
      `Incident ${incidentId}`,
      notes || 'Ground evidence authenticated by command staff.'
    );
  }, [addAuditRecord]);

  const closeIncident = useCallback((incidentId: string, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'CLOSED',
          operatorNotes: notes || inc.operatorNotes || 'Incident mitigated and closed.',
          updatedAt: new Date().toISOString(),
        };
      }
      return inc;
    }));

    addAuditRecord(
      'INCIDENT_CLOSED',
      `Incident ${incidentId} officially closed after mitigation.`,
      `Incident ${incidentId}`,
      notes || 'Risk reduced to normal operating limits.'
    );
  }, [addAuditRecord]);

  const assignTeamToIncident = useCallback((incidentId: string, teamId: string) => {
    const targetIncident = incidents.find(i => i.id === incidentId);
    const targetZoneId = targetIncident?.zoneId || 'C';

    setResponseTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          status: 'DEPLOYED',
          assignedIncidentId: incidentId,
          currentLocationZone: targetZoneId,
          etaMinutes: 2,
        };
      }
      return t;
    }));

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          assignedTeamId: teamId,
          status: 'MITIGATING',
          updatedAt: new Date().toISOString(),
        };
      }
      return inc;
    }));

    // Update zone assigned teams
    setZones(prev => prev.map(z => {
      if (z.id === targetZoneId && !z.assignedTeams.includes(teamId)) {
        return { ...z, assignedTeams: [...z.assignedTeams, teamId] };
      }
      return z;
    }));

    addAuditRecord(
      'TEAM_ASSIGN',
      `Deployed ${teamId} to Incident ${incidentId} in Zone ${targetZoneId}.`,
      `Team ${teamId}`,
      `Immediate crowd barrier management and lane guidance.`
    );
  }, [incidents, addAuditRecord]);

  const createNewIncident = useCallback((newInc: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'humanVerified'>) => {
    const id = `DX-00${Math.floor(45 + Math.random() * 50)}`;
    const now = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString('en-GB');

    const created: Incident = {
      ...newInc,
      id,
      timestamp: timeStr,
      humanVerified: true,
      createdAt: now,
      updatedAt: now,
    };

    setIncidents(prev => [created, ...prev]);

    // Update Zone active incident list
    setZones(prev => prev.map(z => {
      if (z.id === created.zoneId) {
        return {
          ...z,
          activeIncidentIds: [...z.activeIncidentIds, id],
        };
      }
      return z;
    }));

    addAuditRecord(
      'INCIDENT_VERIFIED',
      `Manual Incident ${id} (${created.title}) registered in Zone ${created.zoneId}.`,
      `Zone ${created.zoneId}`,
      created.description
    );
  }, [addAuditRecord]);

  const dispatchTeam = useCallback((teamId: string, zoneId: string, incidentId?: string) => {
    setResponseTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          status: 'DEPLOYED',
          currentLocationZone: zoneId,
          assignedIncidentId: incidentId || null,
          etaMinutes: 2,
        };
      }
      return t;
    }));

    setZones(prev => prev.map(z => {
      if (z.id === zoneId && !z.assignedTeams.includes(teamId)) {
        return { ...z, assignedTeams: [...z.assignedTeams, teamId] };
      }
      return z;
    }));

    addAuditRecord(
      'TEAM_ASSIGN',
      `Dispatched Team ${teamId} to Zone ${zoneId}.`,
      `Team ${teamId}`,
      `Strategic repositioning for density buffer management.`
    );
  }, [addAuditRecord]);

  const recallTeam = useCallback((teamId: string) => {
    setResponseTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          status: 'AVAILABLE',
          assignedIncidentId: null,
          etaMinutes: null,
        };
      }
      return t;
    }));

    addAuditRecord(
      'TEAM_ASSIGN',
      `Recalled Team ${teamId} to base standby.`,
      `Team ${teamId}`,
      `Task completed; returned to active reserve.`
    );
  }, [addAuditRecord]);

  const updateGateStatus = useCallback((gateId: string, status: Gate['status'], throttlePercent = 0) => {
    setGates(prev => prev.map(g => {
      if (g.id === gateId) {
        return {
          ...g,
          status,
          throttlePercent,
          inflowRate: status === 'CLOSED' ? 0 : Math.round(g.capacityRate * (1 - throttlePercent / 100)),
        };
      }
      return g;
    }));

    addAuditRecord(
      'GATE_OVERRIDE',
      `Operator modified ${gateId} status to ${status} (Throttle: ${throttlePercent}%).`,
      gateId,
      'Direct gate flow adjustment.'
    );
  }, [addAuditRecord]);

  const updateExitStatus = useCallback((exitId: string, status: EmergencyExit['status']) => {
    setExits(prev => prev.map(e => {
      if (e.id === exitId) {
        return {
          ...e,
          status,
          flowThroughput: status === 'CLEAR' ? 300 : status === 'PARTIALLY_BLOCKED' ? 120 : 0,
        };
      }
      return e;
    }));

    addAuditRecord(
      'GATE_OVERRIDE',
      `Operator updated ${exitId} status to ${status}.`,
      exitId,
      'Emergency exit clearance modification.'
    );
  }, [addAuditRecord]);

  // -------------------------------------------------------------
  // SIMULATION ENGINE: Counterfactual calculations
  // -------------------------------------------------------------
  const calculateSimulationOutcome = useCallback((
    scenarioId: string,
    scenarioName: string,
    strategyDescription: string,
    intervention: SimulationIntervention,
    rating: SimulationScenarioResult['recommendationRating']
  ): SimulationScenarioResult => {
    const zoneOutcomes: Record<string, any> = {};

    zones.forEach(z => {
      let riskDelta = 0;
      let densityDelta = 0;
      let note = "";
      let flowBal: 'POOR' | 'MODERATE' | 'IMPROVED' | 'OPTIMAL' = 'MODERATE';

      if (z.id === 'C') {
        // Gate 3 impact
        const g3 = intervention.gateModifications['G3'];
        if (g3) {
          if (g3.status === 'CLOSED') {
            riskDelta -= 36;
            densityDelta -= 1.8;
            note = "Inflow ceased. Bottleneck pressure relieved.";
          } else if (g3.status === 'REGULATED') {
            const throttle = g3.throttlePercent || 40;
            const reduction = (throttle / 100) * 44;
            riskDelta -= Math.round(reduction);
            densityDelta -= Number(((throttle / 100) * 2.2).toFixed(1));
            note = `Gate 3 throttled by ${throttle}%. Controlled inflow rate.`;
          }
        }

        // Exit E2 clearance impact
        if (intervention.exitModifications['E2'] === 'CLEAR') {
          riskDelta -= 12;
          densityDelta -= 0.6;
          note += " Exit E2 clearance restored 300 ppl/min throughput.";
        }

        // Team Alpha deployment impact
        if (intervention.teamDeployments['ALPHA'] === 'C') {
          riskDelta -= 8;
          note += " Team Alpha deployed for directional lane separation.";
        }

        // Broadcast impact
        if (intervention.publicBroadcast === 'REDIRECTION_ANNOUNCEMENT') {
          riskDelta -= 6;
          densityDelta -= 0.3;
        }

        const simRisk = Math.max(12, Math.min(98, z.riskScore + riskDelta));
        const simDensity = Math.max(0.8, Number((z.density + densityDelta).toFixed(1)));
        flowBal = simRisk < 40 ? 'OPTIMAL' : simRisk < 60 ? 'IMPROVED' : 'MODERATE';

        zoneOutcomes[z.id] = {
          zoneId: z.id,
          zoneName: z.name,
          currentRisk: z.riskScore,
          simulatedRisk: simRisk,
          riskDelta: simRisk - z.riskScore,
          currentDensity: z.density,
          simulatedDensity: simDensity,
          expectedFlowBalance: flowBal,
          warningNote: note,
        };
      } else if (z.id === 'D') {
        // Zone D absorbs spillover if Gate 3 is abruptly closed without Gate 5 opening
        const g3 = intervention.gateModifications['G3'];
        const g5 = intervention.gateModifications['G5'];

        if (g3?.status === 'CLOSED' && g5?.status !== 'OPEN') {
          riskDelta += 14;
          densityDelta += 0.8;
          note = "WARNING: Heavy diverted inflow from closed Gate 3 creates secondary pinch point.";
          flowBal = 'POOR';
        } else if (g5?.status === 'OPEN') {
          riskDelta -= 18;
          densityDelta -= 0.7;
          note = "South avenue diversion distributes pedestrian load away from East corridor.";
          flowBal = 'IMPROVED';
        } else {
          riskDelta -= 5;
        }

        const simRisk = Math.max(10, Math.min(95, z.riskScore + riskDelta));
        const simDensity = Math.max(0.5, Number((z.density + densityDelta).toFixed(1)));

        zoneOutcomes[z.id] = {
          zoneId: z.id,
          zoneName: z.name,
          currentRisk: z.riskScore,
          simulatedRisk: simRisk,
          riskDelta: simRisk - z.riskScore,
          currentDensity: z.density,
          simulatedDensity: simDensity,
          expectedFlowBalance: flowBal,
          warningNote: note,
        };
      } else if (z.id === 'E') {
        // Zone E absorbs flow when Gate 5 is opened
        const g5 = intervention.gateModifications['G5'];
        if (g5?.status === 'OPEN') {
          riskDelta += 8;
          densityDelta += 0.6;
          note = "Absorbs redirected attendees with wide boulevard capacity.";
          flowBal = 'OPTIMAL';
        } else {
          riskDelta -= 2;
        }

        const simRisk = Math.max(10, Math.min(80, z.riskScore + riskDelta));
        const simDensity = Math.max(0.5, Number((z.density + densityDelta).toFixed(1)));

        zoneOutcomes[z.id] = {
          zoneId: z.id,
          zoneName: z.name,
          currentRisk: z.riskScore,
          simulatedRisk: simRisk,
          riskDelta: simRisk - z.riskScore,
          currentDensity: z.density,
          simulatedDensity: simDensity,
          expectedFlowBalance: flowBal,
          warningNote: note,
        };
      } else {
        // Other zones (A, B, F)
        const simRisk = Math.max(10, z.riskScore - 2);
        zoneOutcomes[z.id] = {
          zoneId: z.id,
          zoneName: z.name,
          currentRisk: z.riskScore,
          simulatedRisk: simRisk,
          riskDelta: simRisk - z.riskScore,
          currentDensity: z.density,
          simulatedDensity: z.density,
          expectedFlowBalance: 'BALANCED' as const,
          warningNote: "Stable baseline flow.",
        };
      }
    });

    const simRisks = Object.values(zoneOutcomes).map((o: any) => o.simulatedRisk);
    const overallRisk = Math.round(simRisks.reduce((a, b) => a + b, 0) / simRisks.length);
    const critZones = simRisks.filter(r => r >= 60).length;

    let flowScore: 'POOR' | 'BALANCED' | 'HIGHLY_BALANCED' = 'BALANCED';
    if (rating === 'BEST_SIMULATED_OPTION') flowScore = 'HIGHLY_BALANCED';
    if (rating === 'HIGHER_RISK_OPTION') flowScore = 'POOR';

    const tradeOffsList: string[] = [];
    if (intervention.gateModifications['G3']?.status === 'CLOSED') {
      tradeOffsList.push("Abrupt Gate 3 closure displaces pedestrian ingress to Zone D.");
    }
    if (intervention.gateModifications['G5']?.status === 'OPEN') {
      tradeOffsList.push("Zone E pedestrian density increases by ~0.6 ppl/m² (well within safe limit).");
    }
    if (intervention.teamDeployments['ALPHA'] === 'C') {
      tradeOffsList.push("Team Alpha redeployed from Zone D; perimeter reserve must cover East corridor.");
    }

    return {
      id: scenarioId,
      name: scenarioName,
      strategyDescription,
      intervention,
      zoneOutcomes,
      overallSimulatedRisk: overallRisk,
      criticalZonesCount: critZones,
      flowBalanceScore: flowScore,
      responseCoverageScore: intervention.teamDeployments['ALPHA'] ? 92 : 70,
      recommendationRating: rating,
      tradeOffs: tradeOffsList.length > 0 ? tradeOffsList : ["Minimal secondary operational friction."],
      rationale: rating === 'BEST_SIMULATED_OPTION'
        ? "Opening Gate 5 while regulating Gate 3 produces the lowest simulated maximum zone risk without causing secondary bottlenecks."
        : rating === 'ALTERNATIVE'
        ? "Opening Gate 5 relieves pressure, but unabated Gate 3 inflow leaves Zone C at moderate risk."
        : "Complete closure of Gate 3 shifts excessive congestion directly into Zone D.",
      confidenceScore: 86,
    };
  }, [zones]);

  // Generate 3 standard comparison scenarios
  const generateComparisonScenarios = useCallback(() => {
    // Strategy A: Close Gate 3
    const stratA: SimulationIntervention = {
      gateModifications: { G3: { status: 'CLOSED', throttlePercent: 100 } },
      exitModifications: { E2: 'PARTIALLY_BLOCKED' },
      teamDeployments: {},
      parkingInflowThrottle: 'LOW',
      publicBroadcast: 'NONE',
    };

    // Strategy B: Open Gate 5
    const stratB: SimulationIntervention = {
      gateModifications: { G5: { status: 'OPEN', throttlePercent: 0 } },
      exitModifications: { E2: 'CLEAR' },
      teamDeployments: { BRAVO: 'E' },
      parkingInflowThrottle: 'MEDIUM',
      publicBroadcast: 'CALM_PACING',
    };

    // Strategy C: Regulate Gate 3 + Open Gate 5 + Clear E2 + Deploy Team Alpha
    const stratC: SimulationIntervention = {
      gateModifications: { 
        G3: { status: 'REGULATED', throttlePercent: 40 },
        G5: { status: 'OPEN', throttlePercent: 0 }
      },
      exitModifications: { E2: 'CLEAR', E3: 'CLEAR' },
      teamDeployments: { ALPHA: 'C', BRAVO: 'E' },
      parkingInflowThrottle: 'HIGH',
      publicBroadcast: 'REDIRECTION_ANNOUNCEMENT',
    };

    const resA = calculateSimulationOutcome('SCENARIO_A', 'Strategy A: Abrupt Gate 3 Closure', 'Completely close Gate 3 without opening auxiliary avenues.', stratA, 'HIGHER_RISK_OPTION');
    const resB = calculateSimulationOutcome('SCENARIO_B', 'Strategy B: Open Gate 5 Auxiliary', 'Open Gate 5 fully while leaving Gate 3 inflow unmodified.', stratB, 'ALTERNATIVE');
    const resC = calculateSimulationOutcome('SCENARIO_C', 'Strategy C: Coordinated Throttle & Diversion', 'Regulate Gate 3 (-40%), open Gate 5, clear Exit E2, and deploy Team Alpha.', stratC, 'BEST_SIMULATED_OPTION');

    setComparisonScenarios([resC, resB, resA]);
    setActiveScenarioResult(resC);
  }, [calculateSimulationOutcome]);

  // Run initial comparison generation
  useEffect(() => {
    generateComparisonScenarios();
  }, [generateComparisonScenarios]);

  const updateInterventionDraft = useCallback((updater: (prev: SimulationIntervention) => SimulationIntervention) => {
    setCurrentInterventionDraft(prev => {
      const next = updater(prev);
      return next;
    });
  }, []);

  const runCustomSimulation = useCallback((customIntervention?: SimulationIntervention): SimulationScenarioResult => {
    const interventionToUse = customIntervention || currentInterventionDraft;
    const result = calculateSimulationOutcome(
      `CUSTOM_${Date.now()}`,
      'Custom Operator Simulation',
      'Custom parameters specified by operator controls.',
      interventionToUse,
      'BEST_SIMULATED_OPTION'
    );
    setActiveScenarioResult(result);
    addAuditRecord(
      'SIMULATION_EXECUTED',
      `Ran counterfactual crowd response simulation (Expected Max Risk: ${result.overallSimulatedRisk}/100).`,
      'Simulation Engine',
      `Tested ${Object.keys(interventionToUse.gateModifications).length} gate adjustments & team deployments.`
    );
    return result;
  }, [currentInterventionDraft, calculateSimulationOutcome, addAuditRecord]);

  // Human-in-the-loop: Approve Intervention
  const approveIntervention = useCallback((scenario: SimulationScenarioResult) => {
    // Apply simulated outcomes to active state
    setZones(prev => prev.map(z => {
      const outcome = scenario.zoneOutcomes[z.id];
      if (outcome) {
        let newLevel: RiskLevel = 'LOW';
        if (outcome.simulatedRisk >= 76) newLevel = 'CRITICAL';
        else if (outcome.simulatedRisk >= 51) newLevel = 'HIGH';
        else if (outcome.simulatedRisk >= 26) newLevel = 'MODERATE';

        return {
          ...z,
          riskScore: outcome.simulatedRisk,
          riskLevel: newLevel,
          density: outcome.simulatedDensity,
          reasons: [
            `Simulated Intervention Approved (${scenario.name})`,
            outcome.warningNote || "Dispersal flow normalized.",
          ],
        };
      }
      return z;
    }));

    // Update gates based on intervention
    if (scenario.intervention.gateModifications) {
      setGates(prev => prev.map(g => {
        const mod = scenario.intervention.gateModifications[g.id];
        if (mod) {
          return {
            ...g,
            status: mod.status,
            throttlePercent: mod.throttlePercent,
            isCongested: false,
          };
        }
        return g;
      }));
    }

    // Update exits based on intervention
    if (scenario.intervention.exitModifications) {
      setExits(prev => prev.map(e => {
        const mod = scenario.intervention.exitModifications[e.id];
        if (mod) {
          return {
            ...e,
            status: mod,
            flowThroughput: mod === 'CLEAR' ? 300 : 120,
          };
        }
        return e;
      }));
    }

    // Deploy assigned teams
    if (scenario.intervention.teamDeployments) {
      Object.entries(scenario.intervention.teamDeployments).forEach(([tId, zId]) => {
        dispatchTeam(tId, zId);
      });
    }

    addAuditRecord(
      'INTERVENTION_APPROVE',
      `HUMAN OPERATOR APPROVED ${scenario.name}. Operational orders dispatched.`,
      `Scenario ${scenario.id}`,
      `Expected result: Simulated risk reduced from 84 to ${scenario.zoneOutcomes['C']?.simulatedRisk || 36}. Decision made with authorized command oversight.`
    );
  }, [dispatchTeam, addAuditRecord]);

  const rejectIntervention = useCallback((scenario: SimulationScenarioResult, reason?: string) => {
    addAuditRecord(
      'INTERVENTION_REJECT',
      `Operator rejected ${scenario.name}.`,
      `Scenario ${scenario.id}`,
      reason || 'Operator elected to maintain current physical posture or test alternative parameters.'
    );
  }, [addAuditRecord]);

  const addSimulatorFeedback = useCallback((feedback: Omit<SimulatorFeedback, 'id' | 'timestamp' | 'operator'>) => {
    const timestamp = new Date().toLocaleTimeString('en-GB');
    const newFeedback: SimulatorFeedback = {
      ...feedback,
      id: `SFB-${Date.now().toString().slice(-4)}`,
      timestamp,
      operator: OPERATOR_NAME,
    };
    setSimulatorFeedbacks(prev => [newFeedback, ...prev]);
    addAuditRecord(
      'SIMULATION_EXECUTED',
      `Simulation feedback submitted (${newFeedback.vote === 'UP' ? 'Thumbs Up' : 'Thumbs Down'}, ${newFeedback.utilityRating}/5) for ${newFeedback.scenarioName}`,
      newFeedback.scenarioId,
      newFeedback.comments || 'Feedback stored locally for demonstration calibration.'
    );
  }, [addAuditRecord]);

  // -------------------------------------------------------------
  // DEMO MODE CONTROLLER (8 Automated Phases)
  // -------------------------------------------------------------
  const applyDemoPhaseState = useCallback((phase: number) => {
    setDemoPhase(phase);

    if (phase === 1) {
      // Phase 1: Normal crowd (All green / yellow)
      setZones(INITIAL_ZONES.map(z => ({
        ...z,
        riskScore: z.id === 'C' ? 26 : z.id === 'D' ? 30 : z.riskScore,
        riskLevel: 'LOW',
        density: z.id === 'C' ? 2.1 : z.density,
        reasons: ["Steady crowd entry", "Normal flow velocity"],
      })));
      setGates(INITIAL_GATES);
      setActiveTab('command-centre');
    } else if (phase === 2) {
      // Phase 2: Gate 3 inflow increases -> Zone C orange (Moderate/High)
      setZones(prev => prev.map(z => {
        if (z.id === 'C') {
          return {
            ...z,
            riskScore: 62,
            riskLevel: 'HIGH',
            density: 3.8,
            inflowRate: 150,
            reasons: ["+ Sudden surge through Gate 3", "+ Inflow exceeds normal concourse capacity"],
          };
        }
        return z;
      }));
      setGates(prev => prev.map(g => g.id === 'G3' ? { ...g, inflowRate: 150, isCongested: true } : g));
      setActiveTab('command-centre');
    } else if (phase === 3) {
      // Phase 3: Counter-flow appears -> Zone C Red (Critical, 84/100)
      setZones(INITIAL_ZONES);
      setGates(INITIAL_GATES);
      setActiveTab('command-centre');
      addAuditRecord(
        'DEMO_TRIGGER',
        'Phase 3: Critical crowd compression & counter-flow escalated in Zone C.',
        'Zone C',
        'Density reached 4.9 ppl/m². Emergency decision support triggered.'
      );
    } else if (phase === 4) {
      // Phase 4: AI explains reasons
      setActiveTab('risk-analysis');
    } else if (phase === 5) {
      // Phase 5: Run What-If Simulation
      generateComparisonScenarios();
      setActiveTab('what-if-simulator');
    } else if (phase === 6) {
      // Phase 6: Show Comparison
      setActiveTab('what-if-simulator');
    } else if (phase === 7) {
      // Phase 7: Human Operator approves Scenario C
      const best = comparisonScenarios.find(s => s.recommendationRating === 'BEST_SIMULATED_OPTION') || comparisonScenarios[0];
      if (best) {
        approveIntervention(best);
      }
      setActiveTab('what-if-simulator');
    } else if (phase === 8) {
      // Phase 8: Dashboard shows simulated risk reduced & action logged
      setActiveTab('command-centre');
    }
  }, [comparisonScenarios, generateComparisonScenarios, approveIntervention, addAuditRecord]);

  const startLiveDemo = useCallback(() => {
    setIsDemoRunning(true);
    applyDemoPhaseState(1);
    setDemoAutoPlay(true);
  }, [applyDemoPhaseState]);

  const nextDemoPhase = useCallback(() => {
    if (demoPhase < 8) {
      applyDemoPhaseState(demoPhase + 1);
    } else {
      setDemoAutoPlay(false);
    }
  }, [demoPhase, applyDemoPhaseState]);

  const prevDemoPhase = useCallback(() => {
    if (demoPhase > 1) {
      applyDemoPhaseState(demoPhase - 1);
    }
  }, [demoPhase, applyDemoPhaseState]);

  const jumpToDemoPhase = useCallback((phase: number) => {
    if (phase >= 1 && phase <= 8) {
      applyDemoPhaseState(phase);
    }
  }, [applyDemoPhaseState]);

  const resetDemo = useCallback(() => {
    setIsDemoRunning(false);
    setDemoPhase(1);
    setDemoAutoPlay(false);
    setTelemetry(INITIAL_TELEMETRY);
    setZones(INITIAL_ZONES);
    setGates(INITIAL_GATES);
    setExits(INITIAL_EXITS);
    setResponseTeams(INITIAL_RESPONSE_TEAMS);
    setAmbulances(INITIAL_AMBULANCES);
    setParkingAreas(INITIAL_PARKING);
    setIncidents(INITIAL_INCIDENTS);
    generateComparisonScenarios();
    setActiveTab('command-centre');
    addAuditRecord(
      'DEMO_TRIGGER',
      'Demo reset to initial pristine competition state.',
      'System State',
      'Restored baseline telemetry and incident ledger.'
    );
  }, [generateComparisonScenarios, addAuditRecord]);

  const toggleDemoAutoPlay = useCallback(() => {
    setDemoAutoPlay(prev => !prev);
  }, []);

  // Demo auto-play interval
  useEffect(() => {
    if (!isDemoRunning || !demoAutoPlay) return;

    const timer = setTimeout(() => {
      if (demoPhase < 8) {
        applyDemoPhaseState(demoPhase + 1);
      } else {
        setDemoAutoPlay(false);
      }
    }, 4500); // 4.5 seconds per phase for crisp demo pacing

    return () => clearTimeout(timer);
  }, [isDemoRunning, demoAutoPlay, demoPhase, applyDemoPhaseState]);

  return (
    <DrishtiContext.Provider
      value={{
        telemetry,
        zones,
        gates,
        exits,
        responseTeams,
        ambulances,
        parkingAreas,
        incidents,
        auditLogs,
        simulatorFeedbacks,
        selectedZone,
        selectedIncident,
        activeTab,
        isDemoRunning,
        demoPhase,
        demoAutoPlay,
        isOfflineMode,
        isJudgeModeOpen,
        isAskAiOpen,
        isAlertModalOpen,
        alertModalPreset,
        comparisonScenarios,
        activeScenarioResult,
        currentInterventionDraft,
        setActiveTab,
        setSelectedZone,
        setSelectedIncident,
        toggleOfflineMode,
        setIsJudgeModeOpen,
        setIsAskAiOpen,
        openAlertModalWithPreset,
        closeAlertModal,
        verifyIncident,
        closeIncident,
        assignTeamToIncident,
        createNewIncident,
        dispatchTeam,
        recallTeam,
        updateGateStatus,
        updateExitStatus,
        updateInterventionDraft,
        runCustomSimulation,
        approveIntervention,
        rejectIntervention,
        addSimulatorFeedback,
        startLiveDemo,
        nextDemoPhase,
        prevDemoPhase,
        jumpToDemoPhase,
        resetDemo,
        toggleDemoAutoPlay,
        addAuditRecord,
      }}
    >
      {children}
    </DrishtiContext.Provider>
  );
};

export const useDrishti = (): DrishtiContextType => {
  const context = useContext(DrishtiContext);
  if (!context) {
    throw new Error('useDrishti must be used within a DrishtiProvider');
  }
  return context;
};
