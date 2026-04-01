import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Activity, LogOut, Settings, TrendingUp, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';

const DashboardPage = () => {
  const { currentUser, incidents, logout } = useApp();

  const openCount = incidents.filter(i => i.status === 'open').length;
  const investigatingCount = incidents.filter(i => i.status === 'investigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
  const highSeverity = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;
  const totalLogs = incidents.reduce((a, i) => a + i.responseLogs.length, 0);
  const automatedLogs = incidents.reduce((a, i) => a + i.responseLogs.filter(l => l.automated).length, 0);
  const automationRate = totalLogs > 0 ? Math.round((automatedLogs / totalLogs) * 100) : 0;

  // Mean Time to Resolve (hours)
  const resolvedIncidents = incidents.filter(i => i.resolvedAt);
  const avgResolveTime = resolvedIncidents.length > 0
    ? (resolvedIncidents.reduce((a, i) => {
        const diff = new Date(i.resolvedAt!).getTime() - new Date(i.reportedAt).getTime();
        return a + diff / (1000 * 60 * 60);
      }, 0) / resolvedIncidents.length).toFixed(1)
    : '—';

  // Chart data
  const severityData = [
    { name: 'Low', value: incidents.filter(i => i.severity === 'low').length },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length },
    { name: 'High', value: incidents.filter(i => i.severity === 'high').length },
  ];

  const typeData = [
    { name: 'Phishing', count: incidents.filter(i => i.type === 'phishing').length },
    { name: 'Malware', count: incidents.filter(i => i.type === 'malware').length },
    { name: 'Unauth Access', count: incidents.filter(i => i.type === 'unauthorized_access').length },
    { name: 'Other', count: incidents.filter(i => i.type === 'other').length },
  ];

  const statusData = [
    { name: 'Open', value: openCount },
    { name: 'Investigating', value: investigatingCount },
    { name: 'Resolved', value: resolvedCount },
  ];

  const PIE_COLORS = [
    'hsl(var(--severity-low))',
    'hsl(var(--severity-medium))',
    'hsl(var(--severity-high))',
  ];

  const STATUS_COLORS = [
    'hsl(var(--status-open))',
    'hsl(var(--status-investigating))',
    'hsl(var(--status-resolved))',
  ];

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

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Open" value={openCount} icon={<AlertTriangle className="w-4 h-4" />} colorClass="text-status-open bg-status-open" />
          <StatCard label="Investigating" value={investigatingCount} icon={<Activity className="w-4 h-4" />} colorClass="text-status-investigating bg-status-investigating" />
          <StatCard label="Resolved" value={resolvedCount} icon={<FileText className="w-4 h-4" />} colorClass="text-status-resolved bg-status-resolved" />
          <StatCard label="Critical" value={highSeverity} icon={<AlertTriangle className="w-4 h-4" />} colorClass="text-destructive bg-destructive/15" />
          <StatCard label="MTTR (hrs)" value={avgResolveTime} icon={<Clock className="w-4 h-4" />} colorClass="text-info bg-info/15" />
          <StatCard label="Total Actions" value={totalLogs} icon={<Zap className="w-4 h-4" />} colorClass="text-primary bg-primary/15" />
        </div>

        {/* Automation Rate */}
        <div className="bg-card rounded-lg cyber-border p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> AUTOMATION RATE
            </h2>
            <span className="font-mono text-sm text-primary font-bold">{automationRate}%</span>
          </div>
          <Progress value={automationRate} className="h-2" />
          <p className="text-xs text-muted-foreground font-mono mt-2">
            {automatedLogs} of {totalLogs} response actions were automated
          </p>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Severity Distribution */}
          <div className="bg-card rounded-lg cyber-border p-5">
            <h2 className="font-mono text-sm text-muted-foreground mb-4">SEVERITY DISTRIBUTION</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {severityData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.375rem', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {severityData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>

          {/* Incidents by Type */}
          <div className="bg-card rounded-lg cyber-border p-5">
            <h2 className="font-mono text-sm text-muted-foreground mb-4">INCIDENTS BY TYPE</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.375rem', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Breakdown */}
          <div className="bg-card rounded-lg cyber-border p-5">
            <h2 className="font-mono text-sm text-muted-foreground mb-4">STATUS BREAKDOWN</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.375rem', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[i] }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Response Activity Timeline */}
        <div className="bg-card rounded-lg cyber-border p-5">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">RESPONSE ACTIONS PER INCIDENT</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={incidents.map(i => ({ name: i.id, actions: i.responseLogs.length, automated: i.responseLogs.filter(l => l.automated).length }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.375rem', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'hsl(var(--foreground))' }}
              />
              <Area type="monotone" dataKey="actions" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
              <Area type="monotone" dataKey="automated" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
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

function StatCard({ label, value, icon, colorClass }: { label: string; value: number | string; icon: React.ReactNode; colorClass: string }) {
  const parts = colorClass.split(' ');
  const textClass = parts[0];
  const bgClass = parts.slice(1).join(' ');
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
