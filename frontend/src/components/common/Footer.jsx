import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-hairline text-text-secondary bg-canvas w-full">
      <div className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        {/* Brand Column */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 text-text-primary group cursor-pointer">
            <div className="w-9 h-9 bg-text-primary text-canvas rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-text-primary">LinkGuard</span>
          </div>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-sm font-sans">
            Fast, secure URL shortener with real-time analytics, privacy protection, and customizable QR codes.
          </p>
        </div>

        {/* Links Columns */}
        {[
          { title: 'NAVIGATION', links: [['Home','/'],['Features','/features'],['Pricing','/pricing'],['About Us','/about']] },
          { title: 'TOPICS', links: [['Analytics Dashboard','/dashboard/analytics'],['QR Code Studio','/dashboard/qr-codes'],['Instant Redirection','/features'],['Password Protection','/features']] },
          { title: 'SUPPORT', links: [['Contact Us','/contact'],['Privacy Policy','/privacy'],['Terms Policy','/terms']] },
        ].map((section) => (
          <div key={section.title} className="space-y-3 sm:space-y-4">
            <h4 className="text-text-primary font-extrabold text-[11px] sm:text-xs uppercase tracking-widest">{section.title}</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm font-medium">
              {section.links.map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-text-secondary hover:text-text-primary transition-colors duration-150 inline-block py-0.5">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-6 border-t border-hairline flex flex-col sm:flex-row justify-between items-center text-xs text-text-tertiary gap-3 text-center sm:text-left">
        <span>&copy; {new Date().getFullYear()} LinkGuard Platform Inc. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
