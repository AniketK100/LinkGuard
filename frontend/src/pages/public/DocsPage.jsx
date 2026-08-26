import React from 'react';
import { BookOpen, Code2, Server, Shield, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-12">
      <div className="space-y-4 border-b border-hairline pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5" /> Official Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          LinkGuard API Documentation
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Complete REST API reference, authentication protocol, error response codes, and rate limits for developers and AI agents.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Server className="w-4 h-4 text-accent" /> 1. Base Endpoints & Environments
          </h2>
          <p>The LinkGuard API is accessible across production live backend servers:</p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-text-primary">
            <li>Production Backend: <code className="text-emerald-400">https://linkguard-5a0l.onrender.com</code></li>
            <li>Production Frontend: <code className="text-emerald-400">https://link-guard-two.vercel.app</code></li>
          </ul>
        </section>

        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" /> 2. Authentication
          </h2>
          <p>Authenticated routes require a JWT Bearer token passed in the HTTP Authorization header:</p>
          <pre className="bg-canvas border border-hairline p-3.5 rounded-xl font-mono text-xs text-emerald-400">
            Authorization: Bearer &lt;YOUR_JWT_ACCESS_TOKEN&gt;
          </pre>
        </section>

        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" /> 3. Endpoints Overview
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-canvas border border-hairline rounded-lg space-y-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">POST</span>
              <span className="text-text-primary ml-2">/api/v1/urls</span>
              <p className="text-text-secondary text-[11px] font-sans mt-1">Creates short URL. Body: <code className="text-text-primary">{"{ originalUrl, customSlug, password }"}</code></p>
            </div>

            <div className="p-3 bg-canvas border border-hairline rounded-lg space-y-1">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">GET</span>
              <span className="text-text-primary ml-2">/:shortCode</span>
              <p className="text-text-secondary text-[11px] font-sans mt-1">Resolves 302 Found redirect to target URL.</p>
            </div>

            <div className="p-3 bg-canvas border border-hairline rounded-lg space-y-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">GET</span>
              <span className="text-text-primary ml-2">/api/v1/analytics/:urlId</span>
              <p className="text-text-secondary text-[11px] font-sans mt-1">Returns click count, unique visitors, device, browser, and country breakdown.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-4 flex justify-center">
        <Link to="/developers">
          <Button icon={ArrowRight}>Visit Developer Portal (/developers)</Button>
        </Link>
      </div>
    </div>
  );
}

export default DocsPage;
