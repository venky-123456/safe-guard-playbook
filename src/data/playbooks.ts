import { Playbook } from '@/types/cyber';

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

export const classifyIncident = (title: string, description: string): { type: import('@/types/cyber').IncidentType; severity: import('@/types/cyber').IncidentSeverity } => {
  const text = `${title} ${description}`.toLowerCase();

  const phishingKeywords = ['phishing', 'phish', 'suspicious email', 'fake login', 'credential harvest', 'spear phishing', 'social engineering'];
  const malwareKeywords = ['malware', 'virus', 'ransomware', 'trojan', 'worm', 'infected', 'cryptominer', 'backdoor', 'keylogger'];
  const unauthKeywords = ['unauthorized access', 'brute force', 'privilege escalation', 'unauthorized login', 'account compromise', 'intruder'];

  let type: import('@/types/cyber').IncidentType = 'other';
  let severity: import('@/types/cyber').IncidentSeverity = 'low';

  if (malwareKeywords.some(k => text.includes(k))) {
    type = 'malware';
    severity = text.includes('ransomware') || text.includes('backdoor') ? 'high' : 'medium';
  } else if (unauthKeywords.some(k => text.includes(k))) {
    type = 'unauthorized_access';
    severity = text.includes('privilege escalation') || text.includes('intruder') ? 'high' : 'medium';
  } else if (phishingKeywords.some(k => text.includes(k))) {
    type = 'phishing';
    severity = text.includes('spear phishing') || text.includes('credential harvest') ? 'high' : 'medium';
  }

  return { type, severity };
};
