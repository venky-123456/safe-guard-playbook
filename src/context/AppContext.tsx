import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Incident, ResponseLog, IncidentStatus, IncidentMetrics } from '@/types/cyber';
import { playbooks, classifyIncident } from '@/data/playbooks';

interface AppState {
  currentUser: User | null;
  incidents: Incident[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  reportIncident: (title: string, description: string) => Incident;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  getIncident: (id: string) => Incident | undefined;
}

const AppContext = createContext<AppState | null>(null);

const MOCK_USERS: (User & { password: string })[] = [
  { id: 'u1', username: 'analyst', email: 'analyst@corp.com', role: 'user', department: 'IT Security', password: 'analyst123' },
  { id: 'u2', username: 'admin', email: 'admin@corp.com', role: 'admin', department: 'SOC', password: 'admin123' },
];

const seedMetrics = (type: string, severity: string): IncidentMetrics => {
  const isHigh = severity === 'high';
  const isMed = severity === 'medium';
  const pb = playbooks.find(p => p.incidentType === type);
  const automationRate = pb ? Math.round((pb.steps.filter(s => s.automated).length / pb.steps.length) * 100) : 0;
  const confidenceScore = type === 'other' ? 22 : isHigh ? 92 : isMed ? 78 : 55;
  const riskScore = isHigh ? 88 : isMed ? 62 : 35;
  return {
    confidenceScore,
    riskScore,
    keywordsMatched: isHigh ? 3 : isMed ? 2 : 1,
    totalKeywordsChecked: 25,
    classificationAccuracy: type === 'other' ? 35 : isHigh ? 95 : isMed ? 82 : 60,
    responseTimeMs: pb ? (isHigh ? 1200 : 2100) : 8500,
    automationRate,
    threatLevel: riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'elevated' : riskScore >= 35 ? 'moderate' : 'low',
    falsePositiveProbability: type === 'other' ? 65 : isHigh ? 5 : isMed ? 15 : 30,
  };
};

const SEED_INCIDENTS: Incident[] = [
  {
    id: 'INC-001', title: 'Phishing email targeting finance team', description: 'Multiple users in finance received a suspicious email with a fake login page link.', type: 'phishing', severity: 'medium', status: 'investigating', reportedBy: 'analyst', reportedAt: '2026-03-10T09:15:00Z',
    metrics: seedMetrics('phishing', 'medium'),
    responseLogs: [
      { id: 'rl-1', incidentId: 'INC-001', action: 'Email quarantined from all mailboxes', performedBy: 'System', timestamp: '2026-03-10T09:16:00Z', automated: true },
      { id: 'rl-2', incidentId: 'INC-001', action: 'Sender domain added to blocklist', performedBy: 'System', timestamp: '2026-03-10T09:16:30Z', automated: true },
    ],
  },
  {
    id: 'INC-002', title: 'Ransomware detected on workstation', description: 'Malware ransomware encryption detected on endpoint WS-0142.', type: 'malware', severity: 'high', status: 'open', reportedBy: 'analyst', reportedAt: '2026-03-11T14:30:00Z',
    metrics: seedMetrics('malware', 'high'),
    responseLogs: [],
  },
  {
    id: 'INC-003', title: 'Unauthorized access to admin panel', description: 'Brute force login attempts detected against the admin portal from external IP.', type: 'unauthorized_access', severity: 'high', status: 'resolved', reportedBy: 'admin', reportedAt: '2026-03-09T03:45:00Z', resolvedAt: '2026-03-09T08:12:00Z',
    metrics: seedMetrics('unauthorized_access', 'high'),
    responseLogs: [
      { id: 'rl-3', incidentId: 'INC-003', action: 'Account locked', performedBy: 'System', timestamp: '2026-03-09T03:46:00Z', automated: true },
      { id: 'rl-4', incidentId: 'INC-003', action: 'All sessions revoked', performedBy: 'System', timestamp: '2026-03-09T03:46:30Z', automated: true },
      { id: 'rl-5', incidentId: 'INC-003', action: 'Incident resolved after full audit', performedBy: 'admin', timestamp: '2026-03-09T08:12:00Z', automated: false },
    ],
  },
];

let incidentCounter = 4;

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(SEED_INCIDENTS);

  const login = useCallback((username: string, password: string) => {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      const { password: _, ...userData } = user;
      setCurrentUser(userData);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const reportIncident = useCallback((title: string, description: string) => {
    const { type, severity, metrics } = classifyIncident(title, description);
    const id = `INC-${String(incidentCounter++).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const playbook = playbooks.find(p => p.incidentType === type);
    const responseLogs: ResponseLog[] = playbook
      ? playbook.steps.filter(s => s.automated).map((step, i) => ({
          id: `rl-auto-${id}-${i}`,
          incidentId: id,
          action: `[AUTO] ${step.title}: ${step.description}`,
          performedBy: 'System',
          timestamp: new Date(Date.now() + (i + 1) * 30000).toISOString(),
          automated: true,
        }))
      : [];

    const incident: Incident = {
      id, title, description, type, severity, status: 'open', reportedBy: currentUser?.username || 'unknown', reportedAt: now, responseLogs, metrics,
    };

    setIncidents(prev => [incident, ...prev]);
    return incident;
  }, [currentUser]);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      const log: ResponseLog = {
        id: `rl-${Date.now()}`, incidentId: id,
        action: `Status changed to ${status}`,
        performedBy: currentUser?.username || 'system',
        timestamp: new Date().toISOString(), automated: false,
      };
      return { ...inc, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : inc.resolvedAt, responseLogs: [...inc.responseLogs, log] };
    }));
  }, [currentUser]);

  const getIncident = useCallback((id: string) => incidents.find(i => i.id === id), [incidents]);

  return (
    <AppContext.Provider value={{ currentUser, incidents, login, logout, reportIncident, updateIncidentStatus, getIncident }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
