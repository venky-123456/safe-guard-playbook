import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Activity, LogOut, Settings, Target, Gauge, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import vignanLogo from '@/assets/vignanlogo.png';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const DashboardPage = () => {
  const { currentUser, incidents, logout } = useApp();

  const openCount = incidents.filter(i => i.status === 'open').length;
  const investigatingCount = incidents.filter(i => i.status === 'investigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
  const highSeverity = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;

  // Aggregate metrics
  const avgConfidence = incidents.length > 0
    ? Math.round(incidents.reduce((a, i) => a + i.metrics.confidenceScore, 0) / incidents.length) : 0;
  const avgAccuracy = incidents.length > 0
    ? Math.round(incidents.reduce((a, i) => a + i.metrics.classificationAccuracy, 0) / incidents.length) : 0;
  const avgRiskScore = incidents.length > 0
    ? Math.round(incidents.reduce((a, i) => a + i.metrics.riskScore, 0) / incidents.length) : 0;
  const avgResponseTime = incidents.length > 0
    ? Math.round(incidents.reduce((a, i) => a + i.metrics.responseTimeMs, 0) / incidents.length) : 0;
  const avgAutomation = incidents.length > 0
    ? Math.round(incidents.reduce((a, i) => a + i.metrics.automationRate, 0) / incidents.length) : 0;
  const avgFalsePositive = incidents.length > 0
    ? Math.round(incidents.reduce((a, i) => a + i.metrics.falsePositiveProbability, 0) / incidents.length) : 0;

  // MTTR for resolved incidents
  const resolvedIncidents = incidents.filter(i => i.resolvedAt);
  const mttr = resolvedIncidents.length > 0
    ? Math.round(resolvedIncidents.reduce((a, i) => a + (new Date(i.resolvedAt!).getTime() - new Date(i.reportedAt).getTime()), 0) / resolvedIncidents.length / 3600000 * 10) / 10
    : 0;

  const recentIncidents = incidents.slice(0, 5);

  // Chart data
  const severityData = [
    { name: 'High', value: incidents.filter(i => i.severity === 'high').length, color: 'hsl(0, 72%, 51%)' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'low').length, color: 'hsl(142, 71%, 45%)' },
  ].filter(d => d.value > 0);

  const typeData = [
    { name: 'Phishing', count: incidents.filter(i => i.type === 'phishing').length },
    { name: 'Malware', count: incidents.filter(i => i.type === 'malware').length },
    { name: 'Unauth Access', count: incidents.filter(i => i.type === 'unauthorized_access').length },
    { name: 'Other', count: incidents.filter(i => i.type === 'other').length },
  ].filter(d => d.count > 0);

  const threatDistribution = [
    { name: 'Critical', value: incidents.filter(i => i.metrics.threatLevel === 'critical').length },
    { name: 'Elevated', value: incidents.filter(i => i.metrics.threatLevel === 'elevated').length },
    { name: 'Moderate', value: incidents.filter(i => i.metrics.threatLevel === 'moderate').length },
    { name: 'Low', value: incidents.filter(i => i.metrics.threatLevel === 'low').length },
  ].filter(d => d.value > 0);

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

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold font-mono text-primary">Security Dashboard</h1>
          <p className="text-muted-foreground text-sm font-mono">Welcome, {currentUser?.username} • {currentUser?.department}</p>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Open" value={openCount} icon={<AlertTriangle className="w-4 h-4" />} colorClass="text-status-open bg-status-open" />
          <StatCard label="Investigating" value={investigatingCount} icon={<Activity className="w-4 h-4" />} colorClass="text-status-investigating bg-status-investigating" />
          <StatCard label="Resolved" value={resolvedCount} icon={<FileText className="w-4 h-4" />} colorClass="text-status-resolved bg-status-resolved" />
          <StatCard label="Critical Active" value={highSeverity} icon={<AlertTriangle className="w-4 h-4" />} colorClass="text-severity-high bg-severity-high" />
        </div>

        {/* Analytics KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="Avg Accuracy" value={`${avgAccuracy}%`} icon={<Target className="w-4 h-4" />} description="Classification accuracy" />
          <MetricCard label="Confidence" value={`${avgConfidence}%`} icon={<Gauge className="w-4 h-4" />} description="Avg confidence score" />
          <MetricCard label="Risk Score" value={`${avgRiskScore}`} icon={<TrendingUp className="w-4 h-4" />} description="Avg risk assessment" />
          <MetricCard label="Response Time" value={`${(avgResponseTime / 1000).toFixed(1)}s`} icon={<Zap className="w-4 h-4" />} description="Avg first response" />
          <MetricCard label="Automation" value={`${avgAutomation}%`} icon={<BarChart3 className="w-4 h-4" />} description="Playbook automation" />
          <MetricCard label="MTTR" value={`${mttr}h`} icon={<Activity className="w-4 h-4" />} description="Mean time to resolve" />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Severity Distribution */}
          <div className="bg-card rounded-lg cyber-border p-5">
            <h3 className="font-mono text-xs text-muted-foreground mb-3">SEVERITY DISTRIBUTION</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                    {severityData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(185, 80%, 50%, 0.2)', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'hsl(200, 20%, 90%)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs font-mono">
              {severityData.map(d => (
                <span key={d.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.name}: {d.value}
                </span>
              ))}
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-card rounded-lg cyber-border p-5">
            <h3 className="font-mono text-xs text-muted-foreground mb-3">INCIDENT TYPES</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={90} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(185, 80%, 50%, 0.2)', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'hsl(200, 20%, 90%)' }} />
                  <Bar dataKey="count" fill="hsl(185, 80%, 50%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* False Positive & Accuracy Gauge */}
          <div className="bg-card rounded-lg cyber-border p-5">
            <h3 className="font-mono text-xs text-muted-foreground mb-3">DETECTION QUALITY</h3>
            <div className="space-y-4 pt-2">
              <GaugeBar label="Classification Accuracy" value={avgAccuracy} color="hsl(142, 71%, 45%)" />
              <GaugeBar label="Confidence Score" value={avgConfidence} color="hsl(185, 80%, 50%)" />
              <GaugeBar label="Automation Rate" value={avgAutomation} color="hsl(210, 100%, 56%)" />
              <GaugeBar label="False Positive Rate" value={avgFalsePositive} color="hsl(0, 72%, 51%)" inverted />
            </div>
          </div>
        </div>

        {/* Recent Incidents with Metrics */}
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
                  <span className="text-xs font-mono text-muted-foreground hidden md:inline">
                    Acc: {inc.metrics.classificationAccuracy}%
                  </span>
                  <span className="text-xs font-mono text-muted-foreground hidden md:inline">
                    Risk: {inc.metrics.riskScore}
                  </span>
                  <ThreatBadge level={inc.metrics.threatLevel} />
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

function StatCard({ label, value, icon, colorClass }: { label: string; value: number; icon: React.ReactNode; colorClass: string }) {
  const [textClass, bgClass] = colorClass.split(' ');
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

function MetricCard({ label, value, icon, description }: { label: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <div className="bg-card rounded-lg cyber-border p-3 space-y-1">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-mono text-muted-foreground">{label}</span></div>
      <p className="text-xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-[10px] font-mono text-muted-foreground">{description}</p>
    </div>
  );
}

function GaugeBar({ label, value, color, inverted }: { label: string; value: number; color: string; inverted?: boolean }) {
  const displayColor = inverted ? (value > 30 ? 'hsl(0, 72%, 51%)' : value > 15 ? 'hsl(38, 92%, 50%)' : 'hsl(142, 71%, 45%)') : color;
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span style={{ color: displayColor }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, value)}%`, background: displayColor }} />
      </div>
    </div>
  );
}

export function ThreatBadge({ level }: { level: string }) {
  const cls = level === 'critical' ? 'text-severity-high bg-severity-high'
    : level === 'elevated' ? 'text-severity-medium bg-severity-medium'
    : level === 'moderate' ? 'text-status-investigating bg-status-investigating'
    : 'text-severity-low bg-severity-low';
  const [text, bg] = cls.split(' ');
  return <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${text} ${bg}`}>{level.toUpperCase()}</span>;
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
