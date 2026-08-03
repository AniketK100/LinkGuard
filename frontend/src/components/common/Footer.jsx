import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-lg text-white">
            <div className="p-1.5 bg-emerald-500 rounded-md text-slate-950">
              <Shield className="w-4 h-4" />
            </div>
            <span>LinkGuard</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enterprise intelligent URL management, high-performance redirect engine, custom QR codes, and real-time security analytics.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Analytics</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">QR Code Generator</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Connect</h4>
          <div className="flex gap-3 text-slate-400">
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white transition-colors border border-slate-800"><Github className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white transition-colors border border-slate-800"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white transition-colors border border-slate-800"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <span>&copy; {new Date().getFullYear()} LinkGuard Platform. All rights reserved.</span>
        <span>Built with Java 21 & React 19</span>
      </div>
    </footer>
  );
}

export default Footer;
