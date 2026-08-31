export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TeamStatus = 'AVAILABLE' | 'DEPLOYED' | 'EN_ROUTE' | 'STANDBY';
export type GateStatus = 'OPEN' | 'CLOSED' | 'REGULATED';
export type ExitStatus = 'CLEAR' | 'PARTIALLY_BLOCKED' | 'BLOCKED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'REPORTED' | 'OPEN' | 'VERIFIED' | 'MITIGATING' | 'RESOLVED' | 'CLOSED';

export interface Zone {
  id: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  name: string;
  capacity: number;
  currentCount: number;
  density: number; // people per m^2
  densityGrowthRate: number; // % change per 5 min
  flowDirection: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'MIXED' | 'CONVERGING' | 'COUNTER_FLOW';
  flowSpeed: number; // m/s
  inflowRate: number; // people/min
  outflowRate: number; // people/min
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0 - 100
  confidenceLevel: ConfidenceLevel;
  nearbyGates: string[];
  nearbyExits: string[];
  assignedTeams: string[];
  activeIncidentIds: string[];
  reasons: string[];
  evidenceConfidence: {
    density: ConfidenceLevel;
    flow: ConfidenceLevel;
    exitStatus: ConfidenceLevel;
    incidentReports: ConfidenceLevel;
  };
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Gate {
  id: string; // 'G1', 'G2', 'G3', 'G4', 'G5'
  name: string;
  status: GateStatus;
  inflowRate: number; // people/min
  capacityRate: number; // max people/min
  throttlePercent: number; // 0 - 100%
  connectedZoneId: string;
  isCongested: boolean;
}

export interface EmergencyExit {
  id: string; // 'E1', 'E2', 'E3'
  name: string;
  status: ExitStatus;
  widthMeters: number;
  flowThroughput: number; // people/min
  connectedZoneId: string;
  obstructionReason?: string;
}

export interface ResponseTeam {
  id: string; // 'ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', etc.
  name: string;
  leader: string;
  personnelCount: number;
  status: TeamStatus;
  currentLocationZone: string;
  assignedIncidentId: string | null;
  etaMinutes: number | null;
  coverageZones: string[];
  specialization: 'CROWD_REGULATION' | 'MEDICAL_FIRST_AID' | 'EVACUATION_ESCORT' | 'PERIMETER_CONTROL';
  contactRadio: string;
  equipment?: string[];
}

export interface AmbulanceUnit {
  id: string; // 'AMB-01', 'AMB-02', 'AMB-03'
  callSign: string;
  status: 'STANDBY' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'HOSPITAL_TRANSIT';
  assignedZone: string;
  driver: string;
  paramedic: string;
  eta: string;
  equipmentLevel: 'BASIC' | 'ADVANCED_LIFE_SUPPORT';
}

export interface Incident {
  id: string; // 'DX-0042'
  zoneId: string;
  timestamp: string;
  type: 'CROWD_COMPRESSION' | 'BOTTLENECK_PINCH' | 'EXIT_OBSTRUCTION' | 'COUNTER_FLOW_CONFLICT' | 'MEDICAL_ASSISTANCE' | 'PARKING_SPILLOVER';
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  evidence: string[];
  recommendedResponse: string[];
  assignedTeamId: string | null;
  humanVerified: boolean;
  operatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingArea {
  id: string; // 'P1', 'P2', 'P3'
  name: string;
  capacity: number;
  currentOccupancy: number;
  occupancyPercent: number;
  status: 'NORMAL' | 'NEAR_CAPACITY' | 'CRITICAL_FULL';
  spilloverRiskToPedestrians: RiskLevel;
  connectedZone: string;
}

export interface SimulationIntervention {
  gateModifications: Record<string, { status: GateStatus; throttlePercent: number }>;
  exitModifications: Record<string, ExitStatus>;
  teamDeployments: Record<string, string>; // teamId -> zoneId
  parkingInflowThrottle: 'LOW' | 'MEDIUM' | 'HIGH';
  publicBroadcast: 'NONE' | 'CALM_PACING' | 'REDIRECTION_ANNOUNCEMENT' | 'EMERGENCY_DISPERSAL';
}

export interface SimulationZoneOutcome {
  zoneId: string;
  zoneName: string;
  currentRisk: number;
  simulatedRisk: number;
  riskDelta: number;
  currentDensity: number;
  simulatedDensity: number;
  expectedFlowBalance: 'POOR' | 'MODERATE' | 'IMPROVED' | 'OPTIMAL';
  warningNote?: string;
}

export interface SimulationScenarioResult {
  id: string;
  name: string;
  strategyDescription: string;
  intervention: SimulationIntervention;
  zoneOutcomes: Record<string, SimulationZoneOutcome>;
  overallSimulatedRisk: number;
  criticalZonesCount: number;
  flowBalanceScore: 'POOR' | 'BALANCED' | 'HIGHLY_BALANCED';
  responseCoverageScore: number; // 0 - 100%
  recommendationRating: 'BEST_SIMULATED_OPTION' | 'ALTERNATIVE' | 'HIGHER_RISK_OPTION';
  tradeOffs: string[];
  rationale: string;
  confidenceScore: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  actionType: 'INTERVENTION_REVIEW' | 'INTERVENTION_APPROVE' | 'INTERVENTION_REJECT' | 'TEAM_ASSIGN' | 'GATE_OVERRIDE' | 'INCIDENT_VERIFIED' | 'INCIDENT_CLOSED' | 'SIMULATION_EXECUTED' | 'NETWORK_MODE_CHANGE' | 'DEMO_TRIGGER' | 'ALERT_BROADCAST';
  details: string;
  targetEntity: string;
  decisionContext: string;
  hash: string;
}

export interface SystemTelemetry {
  eventName: string;
  location: string;
  totalAttendees: number;
  peakCapacity: number;
  activeIncidentsCount: number;
  criticalZonesCount: number;
  deployedTeamsCount: number;
  availableAmbulancesCount: number;
  networkStatus: 'ONLINE' | 'OFFLINE_LOCAL_SAFETY_MODE';
  lastTelemetryUpdate: string;
  systemHealth: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
}

export interface ValidationMetric {
  id: string;
  category: string;
  metricName: string;
  targetValue: string;
  currentSimulatedBenchmark: string;
  description: string;
  status: 'MEETS_TARGET' | 'IN_VALIDATION' | 'UNDER_REVIEW';
}

export interface SimulatorFeedback {
  id: string;
  scenarioId: string;
  scenarioName: string;
  timestamp: string;
  vote: 'UP' | 'DOWN';
  utilityRating: number; // 1 - 5
  accuracyRating: number; // 1 - 5
  tags: string[];
  comments?: string;
  operator: string;
}

export interface IncidentPriorityAnalysis {
  incidentId: string;
  priorityScore: number; // 0 - 100
  rank: number;
  urgencyLevel: 'P1_CRITICAL' | 'P2_ELEVATED' | 'P3_MODERATE' | 'P4_ROUTINE';
  affectedZonesCount: number;
  affectedZonesList: string[];
  cascadingRiskMultiplier: number;
  riskScoreFactor: number;
  severityWeight: number;
  aiRationale: string;
  suggestedAction: string;
}
