import { Incident, Zone, IncidentPriorityAnalysis } from '../types';

/**
 * AI-Powered Incident Prioritization Engine for DRISHTI-X
 * Evaluates multi-factor attributes:
 * 1. Base Severity Weight (CRITICAL=40, HIGH=28, MEDIUM=16, LOW=8)
 * 2. Zone Risk & Density Impact (Zone risk score * density factor)
 * 3. Cascading & Connected Zones (Bottlenecks affecting adjacent zones)
 * 4. Human Verification & Time Latency Penalty
 */
export function prioritizeIncidents(
  incidents: Incident[],
  zones: Zone[]
): {
  prioritizedList: { incident: Incident; analysis: IncidentPriorityAnalysis }[];
  summary: {
    criticalP1Count: number;
    elevatedP2Count: number;
    averageResolutionUrgency: number;
    highestRiskZone: string;
  };
} {
  const zoneMap = new Map<string, Zone>();
  zones.forEach(z => zoneMap.set(z.id, z));

  const analyzed = incidents.map(incident => {
    const primaryZone = zoneMap.get(incident.zoneId);
    const zoneRisk = primaryZone ? primaryZone.riskScore : 30;
    const zoneDensity = primaryZone ? primaryZone.density : 2.0;

    // 1. Severity Base Score (0 - 40)
    let severityBase = 10;
    switch (incident.severity) {
      case 'CRITICAL':
        severityBase = 40;
        break;
      case 'HIGH':
        severityBase = 28;
        break;
      case 'MEDIUM':
        severityBase = 18;
        break;
      case 'LOW':
        severityBase = 8;
        break;
    }

    // 2. Zone Hydrodynamic Risk Factor (0 - 30)
    const riskFactor = Math.min(30, Math.round((zoneRisk / 100) * 20 + (zoneDensity / 6) * 10));

    // 3. Connected / Cascading Zones Impact (0 - 20)
    // Identify adjacent zones that share gates or flow paths
    const affectedZones: string[] = [incident.zoneId];
    if (incident.zoneId === 'C') {
      affectedZones.push('B', 'D');
    } else if (incident.zoneId === 'B') {
      affectedZones.push('A', 'C');
    } else if (incident.zoneId === 'D') {
      affectedZones.push('C', 'E');
    } else if (incident.zoneId === 'A') {
      affectedZones.push('B');
    }

    const cascadingMultiplier = affectedZones.length >= 3 ? 1.4 : affectedZones.length === 2 ? 1.2 : 1.0;
    const cascadingScore = Math.min(20, Math.round(affectedZones.length * 6 * cascadingMultiplier));

    // 4. Status & Verification Urgency Modifier (0 - 10)
    let urgencyModifier = 0;
    if (incident.status === 'REPORTED' || incident.status === 'OPEN') {
      urgencyModifier += 6;
    } else if (incident.status === 'MITIGATING') {
      urgencyModifier += 3;
    }
    if (!incident.humanVerified && incident.status !== 'CLOSED') {
      urgencyModifier += 4;
    }

    // Total Priority Score (0 - 100)
    let priorityScore = Math.min(99, Math.max(15, severityBase + riskFactor + cascadingScore + urgencyModifier));
    if (incident.status === 'CLOSED') {
      priorityScore = Math.max(5, Math.round(priorityScore * 0.15));
    }

    // Urgency Category Tier
    let urgencyLevel: IncidentPriorityAnalysis['urgencyLevel'] = 'P4_ROUTINE';
    if (priorityScore >= 80) {
      urgencyLevel = 'P1_CRITICAL';
    } else if (priorityScore >= 60) {
      urgencyLevel = 'P2_ELEVATED';
    } else if (priorityScore >= 40) {
      urgencyLevel = 'P3_MODERATE';
    }

    // Rationale Generation
    let aiRationale = "";
    let suggestedAction = "";

    if (incident.zoneId === 'C' && (incident.severity === 'CRITICAL' || incident.severity === 'HIGH')) {
      aiRationale = `High priority: Zone C risk is at ${zoneRisk}% with density ${zoneDensity} ppl/m². Risk of cascading bottleneck spillover to Zones ${affectedZones.slice(1).join(' and ')}.`;
      suggestedAction = "Simulate Gate 3 inflow throttle and dispatch Team Alpha for crowd pacing.";
    } else if (incident.severity === 'CRITICAL') {
      aiRationale = `Critical severity report in Zone ${incident.zoneId}. Requires immediate human verification and squad routing.`;
      suggestedAction = "Verify ground observation and dispatch nearest available response team.";
    } else if (!incident.humanVerified && incident.status !== 'CLOSED') {
      aiRationale = `Pending human verification in Zone ${incident.zoneId}. Rapid triage required to prevent escalation.`;
      suggestedAction = "Request visual confirmation from Sector A camera or perimeter squad.";
    } else {
      aiRationale = `Moderate impact in Zone ${incident.zoneId}. Monitored under standard command protocol.`;
      suggestedAction = "Maintain monitoring and confirm exit flow clearance.";
    }

    const analysis: IncidentPriorityAnalysis = {
      incidentId: incident.id,
      priorityScore,
      rank: 1, // Will be set after sorting
      urgencyLevel,
      affectedZonesCount: affectedZones.length,
      affectedZonesList: affectedZones,
      cascadingRiskMultiplier: cascadingMultiplier,
      riskScoreFactor: riskFactor,
      severityWeight: severityBase,
      aiRationale,
      suggestedAction,
    };

    return {
      incident,
      analysis,
    };
  });

  // Sort descending by priorityScore
  analyzed.sort((a, b) => b.analysis.priorityScore - a.analysis.priorityScore);

  // Assign 1-indexed ranks
  analyzed.forEach((item, index) => {
    item.analysis.rank = index + 1;
  });

  const criticalP1Count = analyzed.filter(a => a.analysis.urgencyLevel === 'P1_CRITICAL' && a.incident.status !== 'CLOSED').length;
  const elevatedP2Count = analyzed.filter(a => a.analysis.urgencyLevel === 'P2_ELEVATED' && a.incident.status !== 'CLOSED').length;
  const avgUrgency = Math.round(
    analyzed.filter(a => a.incident.status !== 'CLOSED').reduce((acc, curr) => acc + curr.analysis.priorityScore, 0) /
    (analyzed.filter(a => a.incident.status !== 'CLOSED').length || 1)
  );

  return {
    prioritizedList: analyzed,
    summary: {
      criticalP1Count,
      elevatedP2Count,
      averageResolutionUrgency: avgUrgency,
      highestRiskZone: zones.reduce((prev, curr) => (curr.riskScore > prev.riskScore ? curr : prev), zones[0])?.id || 'C',
    },
  };
}
