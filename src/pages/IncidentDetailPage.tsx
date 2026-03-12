import { useApp } from '@/context/AppContext';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Zap, User, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeverityBadge, StatusBadge } from '@/pages/DashboardPage';
import { playbooks } from '@/data/playbooks';

const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getIncident, updateIncidentStatus, currentUser } = useApp();
  const incident = getIncident(id || '');

  if (!incident) {
    return (
      <div className="min-h-screen cyber-grid-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <p className="font-mono text-muted-foreground">Incident not found</p>
          <Button asChild><Link to="/incidents">Back to list</Link></Button>
        </div>
      </div>
    );
  }

  const playbook = playbooks.find(p => p.incidentType === incident.type);

  return (
    <div className="min-h-screen cyber-grid-bg">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild><Link to="/incidents"><ArrowLeft className="w-4 h-4" /></Link></Button>
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-mono text-primary font-bold tracking-wider text-sm">{incident.id}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Header Info */}
        <div className="bg-card rounded-lg cyber-border p-6 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold">{incident.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div><span className="text-muted-foreground block">Type</span><span className="capitalize">{incident.type.replace('_', ' ')}</span></div>
            <div><span className="text-muted-foreground block">Reported By</span><span className="flex items-center gap-1"><User className="w-3 h-3" />{incident.reportedBy}</span></div>
            <div><span className="text-muted-foreground block">Reported At</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(incident.reportedAt).toLocaleString()}</span></div>
            {incident.resolvedAt && <div><span className="text-muted-foreground block">Resolved At</span><span>{new Date(incident.resolvedAt).toLocaleString()}</span></div>}
          </div>

          {/* Status Actions */}
          {currentUser?.role === 'admin' && incident.status !== 'resolved' && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {incident.status === 'open' && (
                <Button size="sm" variant="outline" onClick={() => updateIncidentStatus(incident.id, 'investigating')} className="font-mono text-xs">
                  Start Investigation
                </Button>
              )}
              <Button size="sm" onClick={() => updateIncidentStatus(incident.id, 'resolved')} className="font-mono text-xs">
                Mark Resolved
              </Button>
            </div>
          )}
        </div>

        {/* Playbook */}
        {playbook && (
          <div className="bg-card rounded-lg cyber-border p-6">
            <h2 className="font-mono text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> PLAYBOOK: {playbook.name}
            </h2>
            <div className="space-y-2">
              {playbook.steps.map(step => (
                <div key={step.id} className="flex items-start gap-3 p-3 rounded bg-secondary/30">
                  <span className="font-mono text-xs text-primary w-5 shrink-0">{step.order}.</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${step.automated ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                    {step.automated ? 'AUTO' : 'MANUAL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Logs */}
        <div className="bg-card rounded-lg cyber-border p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">RESPONSE LOGS</h2>
          {incident.responseLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground font-mono">No response actions recorded</p>
          ) : (
            <div className="space-y-2">
              {incident.responseLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded bg-secondary/30 text-sm">
                  <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${log.automated ? 'text-primary' : 'text-accent'}`} />
                  <div className="flex-1">
                    <p>{log.action}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {log.performedBy} • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IncidentDetailPage;
