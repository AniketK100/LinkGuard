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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="w-10 h-10 bg-text-primary text-canvas rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-display font-extrabold text-text-primary tracking-tight">LinkGuard</span>
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">Welcome back</h1>
          <p className="text-xs sm:text-sm text-text-secondary">Sign in to your link control panel</p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg">
          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-semibold animate-fade-in">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-text-primary">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-2 border border-hairline rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-text-primary font-mono transition-all duration-100 shadow-inner"
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-text-primary">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-surface-2 border border-hairline rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-text-primary pr-10 transition-all duration-100 shadow-inner"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-100 p-1"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full justify-center py-2.5 text-xs sm:text-sm rounded-full mt-1" icon={ArrowRight}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs sm:text-sm font-medium text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-text-primary font-extrabold underline hover:opacity-80 transition-opacity">Create one now</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
