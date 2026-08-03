import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center space-y-4 animate-fade-in">
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 text-accent w-fit mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Account created</h2>
          <p className="text-sm text-text-secondary">Your workspace is ready. Sign in to access your control panel.</p>
          <Link to="/login">
            <Button icon={ArrowRight}>Go to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-2.5 justify-center">
          <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent" />
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">LinkGuard</span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-text-primary">Create your account</h1>
          <p className="text-xs text-text-tertiary">Free tier — 50 links with full analytics</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-xl p-5 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger font-medium animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors duration-100" placeholder="Your name" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 font-mono transition-colors duration-100" placeholder="you@company.com" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 pr-10 transition-colors duration-100" placeholder="Min 8 characters" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-100">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full justify-center" icon={ArrowRight}>
            {loading ? 'Creating…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-tertiary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-semibold hover:text-accent-strong transition-colors duration-100">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
