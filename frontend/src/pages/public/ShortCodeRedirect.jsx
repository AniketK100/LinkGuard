import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import api from '../../lib/axios';
import PublicLayout from '../../layouts/PublicLayout';
import NotFoundPage from './NotFoundPage';

export function ShortCodeRedirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    let isMounted = true;
    const resolveRedirect = async () => {
      try {
        const response = await api.get(`/api/v1/redirects/${shortCode}`);
        const data = response.data?.data;

        if (data?.passwordProtected) {
          if (isMounted) navigate(`/${shortCode}/verify`, { replace: true });
          return;
        }

        if (data?.originalUrl) {
          window.location.replace(data.originalUrl);
          return;
        }

        if (isMounted) setError(true);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.data?.passwordRequired) {
          if (isMounted) navigate(`/${shortCode}/verify`, { replace: true });
          return;
        }
        if (isMounted) setError(true);
      }
    };

    resolveRedirect();

    return () => { isMounted = false; };
  }, [shortCode, navigate]);

  if (error) {
    return (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    );
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center px-4 py-16 bg-canvas">
      <div className="space-y-6 max-w-sm w-full bg-surface border border-hairline p-8 rounded-2xl shadow-xl flex flex-col items-center animate-fade-in">
        
        {/* Animated Brand Shield Icon with Pulsing Online Ping */}
        <div className="relative">
          <div className="w-14 h-14 bg-text-primary text-canvas rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105">
            <Shield className="w-7 h-7" strokeWidth={2.25} />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-surface" />
        </div>

        {/* Dynamic Animated Telemetry Progress Bar */}
        <div className="w-48 h-1.5 bg-surface-2 border border-hairline rounded-full overflow-hidden relative">
          <div className="h-full bg-accent rounded-full animate-pulse w-full transform -translate-x-full animate-[shimmer_1.5s_infinite]" style={{ animation: 'themeSpread 1.4s ease-in-out infinite' }} />
        </div>

        {/* Animated Status Copy */}
        <div className="space-y-1">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center justify-center gap-1.5">
            <span>Redirecting to destination</span>
            <span className="inline-flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </p>
          <p className="text-[11px] text-text-tertiary font-mono">
            /{shortCode} • Memory Cache Lookup
          </p>
        </div>

      </div>
    </div>
  );
}

export default ShortCodeRedirect;
