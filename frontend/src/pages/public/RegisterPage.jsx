import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../lib/posthog';

export function RegisterPage() {
  const { user, register, isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (user) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      trackEvent('user_registered');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-5 animate-fade-in bg-surface border border-hairline p-8 rounded-2xl shadow-lg">
          <div className="p-3 rounded-xl bg-text-primary text-canvas w-fit mx-auto shadow-md">
            <Shield className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-text-primary">Account created</h2>
          <p className="text-sm text-text-secondary">Your workspace is ready. Sign in to access your link control panel.</p>
          <Link to="/login"><Button size="lg" icon={ArrowRight} className="w-full justify-center py-2.5">Go to Sign In</Button></Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">Create your account</h1>
          <p className="text-xs sm:text-sm text-text-secondary">Free tier — 50 links with full analytics</p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg">
          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-semibold animate-fade-in">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-text-primary">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-2 border border-hairline rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-text-primary transition-all duration-100 shadow-inner"
              placeholder="Your full name"
            />
          </div>

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
                placeholder="Min 8 characters"
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
            {loading ? 'Creating…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs sm:text-sm font-medium text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-text-primary font-extrabold underline hover:opacity-80 transition-opacity">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
