import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center">
          <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent" />
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">LinkGuard</span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-xs text-text-tertiary">Sign in to your control panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-xl p-5 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger font-medium animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 font-mono transition-colors duration-100"
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 pr-10 transition-colors duration-100"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-100">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full justify-center" icon={ArrowRight}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-tertiary">
          No account?{' '}
          <Link to="/register" className="text-accent font-semibold hover:text-accent-strong transition-colors duration-100">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
