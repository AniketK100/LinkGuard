import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-surface border border-hairline p-8 sm:p-10 rounded-2xl shadow-xl animate-fade-in">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7" strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">Error 404</span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            The link or page you are trying to access does not exist, has expired, or was removed.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="md" icon={Home} className="w-full sm:w-auto">Return Home</Button>
          </Link>
          <button onClick={() => window.history.back()} className="px-5 py-2 rounded-full border border-hairline bg-surface-2 text-text-primary text-xs font-extrabold uppercase hover:opacity-80 transition-opacity inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
