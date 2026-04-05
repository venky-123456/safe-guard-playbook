import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import vignanLogo from '@/assets/vignanlogo.png';
import { Button } from '@/components/ui/button';
import { SeverityBadge, StatusBadge } from '@/pages/DashboardPage';
import { useState } from 'react';
import { IncidentStatus, IncidentType } from '@/types/cyber';

const IncidentListPage = () => {
  const { incidents } = useApp();
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');

  const filtered = incidents.filter(i =>
    (statusFilter === 'all' || i.status === statusFilter) &&
    (typeFilter === 'all' || i.type === typeFilter)
  );

  return (
    <div className="min-h-screen cyber-grid-bg">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild><Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link></Button>
          <img src={vignanLogo} alt="Logo" className="w-5 h-5 object-contain" />
          <span className="font-mono text-primary font-bold tracking-wider text-sm">INCIDENT LIST</span>
          <span className="text-xs font-mono text-muted-foreground ml-auto">{filtered.length} incidents</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'open', 'investigating', 'resolved'] as const).map(s => (
            <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)} className="font-mono text-xs capitalize">
              {s}
            </Button>
          ))}
          <span className="text-border mx-1">|</span>
          {(['all', 'phishing', 'malware', 'unauthorized_access', 'other'] as const).map(t => (
            <Button key={t} variant={typeFilter === t ? 'default' : 'outline'} size="sm" onClick={() => setTypeFilter(t)} className="font-mono text-xs capitalize">
              {t.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg cyber-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs font-mono text-muted-foreground">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">TITLE</th>
                  <th className="text-left p-3">TYPE</th>
                  <th className="text-left p-3">SEVERITY</th>
                  <th className="text-left p-3">STATUS</th>
                  <th className="text-left p-3">REPORTED</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inc => (
                  <tr key={inc.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-mono text-xs text-primary">
                      <Link to={`/incidents/${inc.id}`} className="hover:underline">{inc.id}</Link>
                    </td>
                    <td className="p-3 text-sm">
                      <Link to={`/incidents/${inc.id}`} className="hover:text-primary transition-colors">{inc.title}</Link>
                    </td>
                    <td className="p-3 text-xs font-mono text-muted-foreground capitalize">{inc.type.replace('_', ' ')}</td>
                    <td className="p-3"><SeverityBadge severity={inc.severity} /></td>
                    <td className="p-3"><StatusBadge status={inc.status} /></td>
                    <td className="p-3 text-xs font-mono text-muted-foreground">{new Date(inc.reportedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm font-mono py-8">No incidents found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default IncidentListPage;
