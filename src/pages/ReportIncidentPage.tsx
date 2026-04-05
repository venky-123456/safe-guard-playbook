import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import vignanLogo from '@/assets/vignanlogo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SeverityBadge, StatusBadge } from '@/pages/DashboardPage';
import { classifyIncident } from '@/data/playbooks';
import { playbooks } from '@/data/playbooks';

const ReportIncidentPage = () => {
  const { reportIncident } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState<ReturnType<typeof reportIncident> | null>(null);

  // Live classification preview
  const preview = title || description ? classifyIncident(title, description) : null;
  const matchedPlaybook = preview ? playbooks.find(p => p.incidentType === preview.type) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incident = reportIncident(title, description);
    setSubmitted(incident);
  };

  if (submitted) {
    return (
      <div className="min-h-screen cyber-grid-bg flex items-center justify-center p-4">
        <div className="bg-card rounded-lg cyber-border cyber-glow p-8 max-w-lg w-full text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-success mx-auto" />
          <h2 className="text-xl font-bold font-mono text-primary">INCIDENT REPORTED</h2>
          <div className="space-y-2 text-sm font-mono">
            <p>ID: <span className="text-primary">{submitted.id}</span></p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-muted-foreground">Classification:</span>
              <span className="text-foreground">{submitted.type.replace('_', ' ').toUpperCase()}</span>
            </div>
          <div className="flex items-center justify-center gap-2">
              <SeverityBadge severity={submitted.severity} />
              <StatusBadge status={submitted.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-secondary/30 rounded p-3">
              <div><span className="text-muted-foreground block">Accuracy</span><span className="text-foreground">{submitted.metrics.classificationAccuracy}%</span></div>
              <div><span className="text-muted-foreground block">Confidence</span><span className="text-foreground">{submitted.metrics.confidenceScore}%</span></div>
              <div><span className="text-muted-foreground block">Risk Score</span><span className="text-foreground">{submitted.metrics.riskScore}/100</span></div>
            </div>
            {submitted.responseLogs.length > 0 && (
              <div className="text-left mt-4 bg-secondary/50 rounded p-3 space-y-1">
                <p className="text-xs text-muted-foreground mb-2">AUTOMATED RESPONSES TRIGGERED:</p>
                {submitted.responseLogs.map(log => (
                  <p key={log.id} className="text-xs text-success flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {log.action}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={() => navigate(`/incidents/${submitted.id}`)} className="font-mono text-xs">View Incident</Button>
            <Button variant="outline" onClick={() => { setSubmitted(null); setTitle(''); setDescription(''); }} className="font-mono text-xs">Report Another</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid-bg">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild><Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link></Button>
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-mono text-primary font-bold tracking-wider text-sm">REPORT INCIDENT</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-card rounded-lg cyber-border p-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">INCIDENT TITLE</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Phishing email detected in finance department" className="bg-secondary border-border font-mono text-sm" required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">DESCRIPTION</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the incident in detail..." className="bg-secondary border-border font-mono text-sm min-h-[120px]" required />
          </div>

          {/* Live classification preview */}
          {preview && (
            <div className="bg-secondary/50 rounded p-4 space-y-2 cyber-border">
              <p className="text-xs font-mono text-muted-foreground">AUTO-CLASSIFICATION PREVIEW</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-foreground">{preview.type.replace('_', ' ').toUpperCase()}</span>
                <SeverityBadge severity={preview.severity} />
              </div>
              {matchedPlaybook && (
                <div className="text-xs font-mono text-muted-foreground">
                  <Zap className="w-3 h-3 inline text-primary mr-1" />
                  Playbook: {matchedPlaybook.name} ({matchedPlaybook.steps.length} steps)
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full font-mono tracking-wider">
            SUBMIT INCIDENT REPORT
          </Button>
        </form>
      </main>
    </div>
  );
};

export default ReportIncidentPage;
