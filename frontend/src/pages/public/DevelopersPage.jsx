import React, { useState } from 'react';
import { Terminal, Code2, Copy, Check, FileJson, Shield, Cpu, BookOpen, Layers } from 'lucide-react';
import Button from '../../components/common/Button';

export function DevelopersPage() {
  const [copied, setCopied] = useState(false);

  const curlExample = `curl -X POST https://linkguard-5a0l.onrender.com/api/v1/urls \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://github.com/AniketK100/LinkGuard",
    "customSlug": "linkguard-repo"
  }'`;

  const mcpConfigExample = `{
  "mcpServers": {
    "linkguard": {
      "command": "npx",
      "args": ["-y", "@linkguard/mcp-server"],
      "env": {
        "LINKGUARD_API_BASE": "https://linkguard-5a0l.onrender.com"
      }
    }
  }
}`;

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
          <Code2 className="w-3.5 h-3.5" /> LinkGuard Platform Developer Portal
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Build with LinkGuard API
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Programmatic REST API, OpenAPI 3.0 specification, agent instructions, and MCP server tools for seamless AI agent integration.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="/openapi.json" target="_blank" rel="noopener noreferrer">
            <Button size="sm" icon={FileJson} variant="secondary">OpenAPI Spec (.json)</Button>
          </a>
          <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
            <Button size="sm" icon={Layers} variant="secondary">OpenAPI Spec (.yaml)</Button>
          </a>
          <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
            <Button size="sm" icon={BookOpen} variant="secondary">llms.txt Guidance</Button>
          </a>
        </div>
      </div>

      {/* Quickstart Code Box */}
      <div className="bg-surface border border-hairline rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary font-mono text-xs font-bold">
            <Terminal className="w-4 h-4 text-accent" /> Quickstart: Create Short Link
          </div>
          <button
            onClick={() => copyCode(curlExample)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-hairline text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
          </button>
        </div>
        <pre className="bg-canvas border border-hairline rounded-xl p-4 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed">
          {curlExample}
        </pre>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-hairline rounded-xl p-6 space-y-3">
          <div className="p-2.5 rounded-lg bg-accent/10 text-accent w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">Sub-10ms Redis Speed</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            High-concurrency cache-aside Redis engine delivers sub-10ms redirect resolution for high-traffic links.
          </p>
        </div>

        <div className="bg-surface border border-hairline rounded-xl p-6 space-y-3">
          <div className="p-2.5 rounded-lg bg-accent/10 text-accent w-fit">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">SHA-256 IP Anonymization</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Zero raw IP logging. All visitor IPs pass through daily salted SHA-256 cryptographic hashing.
          </p>
        </div>

        <div className="bg-surface border border-hairline rounded-xl p-6 space-y-3">
          <div className="p-2.5 rounded-lg bg-accent/10 text-accent w-fit">
            <FileJson className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">Machine Discoverable</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Complete OpenAPI 3.0 spec, llms.txt, agent instructions, and structured JSON error responses.
          </p>
        </div>
      </div>

      {/* MCP Configuration Box */}
      <div className="bg-surface border border-hairline rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" /> Model Context Protocol (MCP) Server
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Connect your AI agent or assistant (Claude Desktop, Cursor, Antigravity) to LinkGuard using our MCP configuration.
        </p>
        <pre className="bg-canvas border border-hairline rounded-xl p-4 text-xs font-mono text-text-primary overflow-x-auto">
          {mcpConfigExample}
        </pre>
      </div>
    </div>
  );
}

export default DevelopersPage;
