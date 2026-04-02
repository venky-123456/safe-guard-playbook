export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
}

export type IncidentSeverity = 'low' | 'medium' | 'high';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';
export type IncidentType = 'phishing' | 'malware' | 'unauthorized_access' | 'other';

export interface IncidentMetrics {
  confidenceScore: number;       // 0-100 classification confidence
  riskScore: number;             // 0-100 overall risk assessment
  keywordsMatched: number;       // number of keywords matched
  totalKeywordsChecked: number;  // total keywords checked
  classificationAccuracy: number; // estimated accuracy percentage
  responseTimeMs: number;        // time to first automated response (ms)
  automationRate: number;        // % of steps that are automated
  threatLevel: 'critical' | 'elevated' | 'moderate' | 'low';
  falsePositiveProbability: number; // 0-100
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  responseLogs: ResponseLog[];
  metrics: IncidentMetrics;
}

export interface Playbook {
  id: string;
  name: string;
  incidentType: IncidentType;
  description: string;
  steps: PlaybookStep[];
}

export interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  automated: boolean;
}

export interface ResponseLog {
  id: string;
  incidentId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  automated: boolean;
}
