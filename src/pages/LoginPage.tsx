import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lock, AlertTriangle } from 'lucide-react';
import vignanLogo from '@/assets/vignanlogo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center cyber-grid-bg">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 cyber-border mb-4 overflow-hidden">
            <img src={vignanLogo} alt="Vignan Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold font-mono text-primary tracking-wider">CYBER INCIDENT PORTAL</h1>
          <p className="text-muted-foreground text-sm mt-1">Security Operations Center</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 cyber-border cyber-glow space-y-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono border-b border-border pb-3">
            <Lock className="w-3 h-3" />
            SECURE AUTHENTICATION
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded text-sm font-mono">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">USERNAME</Label>
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" className="bg-secondary border-border font-mono" required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">PASSWORD</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="bg-secondary border-border font-mono" required />
          </div>

          <Button type="submit" className="w-full font-mono tracking-wider">
            AUTHENTICATE
          </Button>

          <div className="text-xs text-muted-foreground font-mono space-y-1 pt-2 border-t border-border">
            <p>Demo credentials:</p>
            <p>User: <span className="text-primary">analyst</span> / <span className="text-primary">analyst123</span></p>
            <p>Admin: <span className="text-primary">admin</span> / <span className="text-primary">admin123</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
