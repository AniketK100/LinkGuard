import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function PasswordVerifyPage() {
  const { shortCode } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/api/v1/urls/${shortCode}/verify`, { password });
      if (response.data?.success && response.data?.data?.originalUrl) {
        window.location.href = response.data.data.originalUrl;
      } else {
        setError('Invalid password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="p-3 rounded-lg bg-warning/5 border border-warning/10 text-warning w-fit mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Protected Link</h1>
          <p className="text-xs text-text-tertiary">
            Destination <span className="font-mono text-text-secondary">/{shortCode}</span> requires a password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-xl p-5 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger font-medium animate-fade-in">{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors duration-100"
              placeholder="Enter link password"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full justify-center" icon={ArrowRight}>
            {loading ? 'Verifying…' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default PasswordVerifyPage;
