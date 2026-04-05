import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, AlertTriangle } from 'lucide-react';
import vignanLogo from '@/assets/vignanlogo.png';
import { Button } from '@/components/ui/button';
import { SeverityBadge, StatusBadge } from '@/pages/DashboardPage';
import { playbooks } from '@/data/playbooks';

const AdminDashboardPage = () => {
  const { incidents, updateIncidentStatus, currentUser } = useApp();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen cyber-grid-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <p className="font-mono text-muted-foreground">Access denied. Admin only.</p>
          <Button asChild><Link to="/dashboard">Back to Dashboard</Link></Button>
        </div>
      </div>
    );
  }

  const openIncidents = incidents.filter(i => i.status !== 'resolved');

  return (
    <div className="min-h-screen cyber-grid-bg">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild><Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link></Button>
          <img src={vignanLogo} alt="Logo" className="w-5 h-5 object-contain" />
          <span className="font-mono text-primary font-bold tracking-wider text-sm">ADMIN DASHBOARD</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Active Incidents Requiring Action */}
        <section>
          <h2 className="font-mono text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> ACTIVE INCIDENTS ({openIncidents.length})
          </h2>
          <div className="space-y-3">
            {openIncidents.map(inc => (
              <div key={inc.id} className="bg-card rounded-lg cyber-border p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-primary">{inc.id}</span>
                  <Link to={`/incidents/${inc.id}`} className="text-sm hover:text-primary transition-colors truncate">{inc.title}</Link>
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>
                <div className="flex gap-2">
                  {inc.status === 'open' && (
                    <Button size="sm" variant="outline" onClick={() => updateIncidentStatus(inc.id, 'investigating')} className="font-mono text-xs">
                      Investigate
                    </Button>
                  )}
                  <Button size="sm" onClick={() => updateIncidentStatus(inc.id, 'resolved')} className="font-mono text-xs">
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
            {openIncidents.length === 0 && (
              <p className="text-sm text-muted-foreground font-mono text-center py-4">All incidents resolved ✓</p>
            )}
          </div>
        </section>

        {/* Playbooks */}
        <section>
          <h2 className="font-mono text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-info" /> PLAYBOOKS
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {playbooks.map(pb => (
              <div key={pb.id} className="bg-card rounded-lg cyber-border p-4 space-y-2">
                <h3 className="font-mono text-sm text-primary">{pb.name}</h3>
                <p className="text-xs text-muted-foreground">{pb.description}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {pb.steps.length} steps • {pb.steps.filter(s => s.automated).length} automated
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="font-mono text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> SYSTEM STATS
          </h2>
          <div className="bg-card rounded-lg cyber-border p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
            <div><p className="text-2xl font-bold text-foreground">{incidents.length}</p><p className="text-xs text-muted-foreground">Total Incidents</p></div>
            <div><p className="text-2xl font-bold text-severity-high">{incidents.filter(i => i.severity === 'high').length}</p><p className="text-xs text-muted-foreground">High Severity</p></div>
            <div><p className="text-2xl font-bold text-primary">{incidents.reduce((a, i) => a + i.responseLogs.length, 0)}</p><p className="text-xs text-muted-foreground">Response Actions</p></div>
            <div><p className="text-2xl font-bold text-success">{incidents.filter(i => i.status === 'resolved').length}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
