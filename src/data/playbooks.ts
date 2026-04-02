import { Playbook, IncidentMetrics } from '@/types/cyber';

export const playbooks: Playbook[] = [
  {
    id: 'pb-phishing',
    name: 'Phishing Incident Response',
    incidentType: 'phishing',
    description: 'Automated response playbook for phishing attacks',
    steps: [
      { id: 'ps-1', order: 1, title: 'Isolate Email', description: 'Quarantine the suspicious email from all mailboxes', automated: true },
      { id: 'ps-2', order: 2, title: 'Block Sender Domain', description: 'Add sender domain to blocklist in email gateway', automated: true },
      { id: 'ps-3', order: 3, title: 'Scan for Clicks', description: 'Check if any users clicked malicious links', automated: true },
      { id: 'ps-4', order: 4, title: 'Reset Credentials', description: 'Force password reset for affected users', automated: false },
      { id: 'ps-5', order: 5, title: 'Notify Users', description: 'Send awareness alert to all employees', automated: true },
      { id: 'ps-6', order: 6, title: 'Update Threat Intel', description: 'Add IOCs to threat intelligence platform', automated: true },
    ],
  },
  {
    id: 'pb-malware',
    name: 'Malware Incident Response',
    incidentType: 'malware',
    description: 'Automated response playbook for malware infections',
    steps: [
      { id: 'ms-1', order: 1, title: 'Isolate Endpoint', description: 'Disconnect infected machine from network', automated: true },
      { id: 'ms-2', order: 2, title: 'Capture Forensics', description: 'Take memory dump and disk image', automated: true },
      { id: 'ms-3', order: 3, title: 'Run AV Scan', description: 'Execute full antivirus scan on endpoint', automated: true },
      { id: 'ms-4', order: 4, title: 'Check Lateral Movement', description: 'Scan network for signs of spread', automated: true },
      { id: 'ms-5', order: 5, title: 'Remediate System', description: 'Clean or reimage affected system', automated: false },
      { id: 'ms-6', order: 6, title: 'Update Signatures', description: 'Push new malware signatures to all endpoints', automated: true },
    ],
  },
  {
    id: 'pb-unauth',
    name: 'Unauthorized Access Response',
    incidentType: 'unauthorized_access',
    description: 'Automated response playbook for unauthorized access attempts',
    steps: [
      { id: 'us-1', order: 1, title: 'Lock Account', description: 'Immediately lock the compromised account', automated: true },
      { id: 'us-2', order: 2, title: 'Revoke Sessions', description: 'Terminate all active sessions for the account', automated: true },
      { id: 'us-3', order: 3, title: 'Audit Access Logs', description: 'Review all recent access logs for anomalies', automated: true },
      { id: 'us-4', order: 4, title: 'Reset Credentials', description: 'Force password and MFA reset', automated: false },
      { id: 'us-5', order: 5, title: 'Notify Security Team', description: 'Alert SOC team for further investigation', automated: true },
    ],
  },
];

interface ClassificationResult {
  type: import('@/types/cyber').IncidentType;
  severity: import('@/types/cyber').IncidentSeverity;
  metrics: IncidentMetrics;
}

const phishingKeywords = ['phishing', 'phish', 'suspicious email', 'fake login', 'credential harvest', 'spear phishing', 'social engineering'];
const malwareKeywords = ['malware', 'virus', 'ransomware', 'trojan', 'worm', 'infected', 'cryptominer', 'backdoor', 'keylogger'];
const unauthKeywords = ['unauthorized access', 'brute force', 'privilege escalation', 'unauthorized login', 'account compromise', 'intruder'];

const allKeywords = [...phishingKeywords, ...malwareKeywords, ...unauthKeywords];

export const classifyIncident = (title: string, description: string): ClassificationResult => {
  const text = `${title} ${description}`.toLowerCase();

  const phishingMatches = phishingKeywords.filter(k => text.includes(k)).length;
  const malwareMatches = malwareKeywords.filter(k => text.includes(k)).length;
  const unauthMatches = unauthKeywords.filter(k => text.includes(k)).length;
  const totalMatches = phishingMatches + malwareMatches + unauthMatches;
  const totalKeywordsChecked = allKeywords.length;

  let type: import('@/types/cyber').IncidentType = 'other';
  let severity: import('@/types/cyber').IncidentSeverity = 'low';
  let maxMatches = 0;

  if (malwareMatches > 0 && malwareMatches >= phishingMatches && malwareMatches >= unauthMatches) {
    type = 'malware';
    maxMatches = malwareMatches;
    severity = text.includes('ransomware') || text.includes('backdoor') ? 'high' : 'medium';
  } else if (unauthMatches > 0 && unauthMatches >= phishingMatches) {
    type = 'unauthorized_access';
    maxMatches = unauthMatches;
    severity = text.includes('privilege escalation') || text.includes('intruder') ? 'high' : 'medium';
  } else if (phishingMatches > 0) {
    type = 'phishing';
    maxMatches = phishingMatches;
    severity = text.includes('spear phishing') || text.includes('credential harvest') ? 'high' : 'medium';
  }

  // Compute confidence based on keyword density and match strength
  const categoryKeywordCount = type === 'malware' ? malwareKeywords.length
    : type === 'unauthorized_access' ? unauthKeywords.length
    : type === 'phishing' ? phishingKeywords.length : 1;

  const matchRatio = maxMatches / categoryKeywordCount;
  const confidenceScore = type === 'other'
    ? Math.round(15 + Math.random() * 10)
    : Math.round(Math.min(98, 55 + matchRatio * 40 + (totalMatches > 2 ? 10 : 0)));

  // Risk score based on severity + confidence
  const severityWeight = severity === 'high' ? 85 : severity === 'medium' ? 55 : 25;
  const riskScore = Math.round(Math.min(100, severityWeight * 0.6 + confidenceScore * 0.4));

  // Threat level
  const threatLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'elevated' : riskScore >= 35 ? 'moderate' : 'low';

  // False positive probability (inverse of confidence with some noise)
  const falsePositiveProbability = Math.round(Math.max(2, 100 - confidenceScore - (maxMatches * 5) + Math.random() * 8));

  // Classification accuracy estimate
  const classificationAccuracy = type === 'other'
    ? Math.round(30 + Math.random() * 15)
    : Math.round(Math.min(99, confidenceScore + (maxMatches > 1 ? 8 : 0) - Math.random() * 5));

  // Playbook automation rate
  const playbook = playbooks.find(p => p.incidentType === type);
  const automationRate = playbook
    ? Math.round((playbook.steps.filter(s => s.automated).length / playbook.steps.length) * 100)
    : 0;

  // Simulated response time (faster for automated)
  const responseTimeMs = playbook
    ? Math.round(800 + Math.random() * 2200)
    : Math.round(5000 + Math.random() * 10000);

  const metrics: IncidentMetrics = {
    confidenceScore,
    riskScore,
    keywordsMatched: totalMatches,
    totalKeywordsChecked,
    classificationAccuracy,
    responseTimeMs,
    automationRate,
    threatLevel,
    falsePositiveProbability,
  };

  return { type, severity, metrics };
};
