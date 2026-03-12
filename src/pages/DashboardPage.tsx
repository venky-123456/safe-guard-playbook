import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Activity, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { currentUser, incidents, logout } = useApp();

  const openCount = incidents.filter(i => i.status === 'open').length;
  const investigatingCount = incidents.filter(i => i.status === 'investigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
  const highSeverity = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;

  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="min-h-screen cyber-grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-primary font-bold tracking-wider text-sm">CIRP</span>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild className="font-mono text-xs">
              <Link to="/report">Report Incident</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="font-mono text-xs">
              <Link to="/incidents">All Incidents</Link>
            </Button>
            {currentUser?.role === 'admin' && (
              <Button variant="ghost" size="sm" asChild className="font-mono text-xs">
                <Link to="/admin"><Settings className="w-3 h-3 mr-1" />Admin</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={logout} className="font-mono text-xs text-muted-foreground">
              <LogOut className="w-3 h-3 mr-1" />Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold font-mono text-primary">Dashboard</h1>
          <p className="text-muted-foreground text-sm font-mono">Welcome, {currentUser?.username} • {currentUser?.department}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Open" value={openCount} icon={<AlertTriangle className="w-4 h-4" />} className="text-status-open bg-status-open" />
          <StatCard label="Investigating" value={investigatingCount} icon={<Activity className="w-4 h-4" />} className="text-status-investigating bg-status-investigating" />
          <StatCard label="Resolved" value={resolvedCount} icon={<FileText className="w-4 h-4" />} className="text-status-resolved bg-status-resolved" />
          <StatCard label="Critical" value={highSeverity} icon={<AlertTriangle className="w-4 h-4" />} className="text-severity-high bg-severity-high" />
        </div>

        {/* Recent Incidents */}
        <div className="bg-card rounded-lg cyber-border p-5">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">RECENT INCIDENTS</h2>
          <div className="space-y-2">
            {recentIncidents.map(inc => (
              <Link key={inc.id} to={`/incidents/${inc.id}`} className="flex items-center justify-between p-3 rounded bg-secondary/50 hover:bg-secondary transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                  <span className="text-sm truncate">{inc.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button asChild className="font-mono text-xs">
            <Link to="/report">+ Report New Incident</Link>
          </Button>
          <Button variant="outline" asChild className="font-mono text-xs">
            <Link to="/incidents">View All Incidents</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

function StatCard({ label, value, icon, className }: { label: string; value: number; icon: React.ReactNode; className: string }) {
  const [textClass, bgClass] = className.split(' ');
  return (
    <div className="bg-card rounded-lg cyber-border p-4">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${bgClass} mb-2`}>
        <span className={textClass}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold font-mono ${textClass}`}>{value}</p>
      <p className="text-xs font-mono text-muted-foreground">{label}</p>
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const cls = severity === 'high' ? 'text-severity-high bg-severity-high' : severity === 'medium' ? 'text-severity-medium bg-severity-medium' : 'text-severity-low bg-severity-low';
  const [text, bg] = cls.split(' ');
  return <span className={`text-xs font-mono px-2 py-0.5 rounded ${text} ${bg}`}>{severity.toUpperCase()}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status === 'open' ? 'text-status-open bg-status-open' : status === 'investigating' ? 'text-status-investigating bg-status-investigating' : 'text-status-resolved bg-status-resolved';
  const [text, bg] = cls.split(' ');
  return <span className={`text-xs font-mono px-2 py-0.5 rounded ${text} ${bg}`}>{status.toUpperCase()}</span>;
}

export default DashboardPage;
