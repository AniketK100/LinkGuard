import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16 bg-canvas">
      <div className="max-w-md w-full text-center space-y-6 bg-surface border border-hairline p-6 sm:p-8 rounded-2xl shadow-lg">
        
        {/* Brand Shield Icon */}
        <div className="w-12 h-12 bg-text-primary text-canvas rounded-xl flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-6 h-6" strokeWidth={2.25} />
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          404 — LINK NOT FOUND
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">
            Link Not Found
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            The short link you tried to access does not exist, has expired, or was disabled by the owner.
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center items-stretch sm:items-center">
          <Link to="/" className="flex-1">
            <Button variant="primary" size="sm" icon={Home} className="w-full justify-center rounded-xl py-2.5 text-xs font-extrabold uppercase tracking-wider">
              Back to Home
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-hairline bg-surface-2 text-text-primary text-xs font-extrabold uppercase tracking-wider hover:opacity-80 transition-opacity inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default NotFoundPage;
