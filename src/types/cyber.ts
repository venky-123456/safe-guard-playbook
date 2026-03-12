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
