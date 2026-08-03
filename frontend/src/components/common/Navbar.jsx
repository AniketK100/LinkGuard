import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Search, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CommandPalette from './CommandPalette';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isMarketing = ['/', '/features', '/pricing', '/about', '/contact'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled ? 'glass border-b border-hairline' : 'bg-canvas border-b border-hairline'
      }`}>
        <div className="max-w-[92rem] mx-auto px-6 sm:px-10 lg:px-16 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-text-primary text-canvas rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-150 shadow-md">
              <Shield className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-text-primary">LinkGuard</span>
          </Link>

          {/* Search Bar - Pure Semantic Pill */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-surface-2 border border-hairline rounded-full text-xs font-medium hover:border-text-secondary transition-all duration-150 max-w-sm w-full shadow-sm"
          >
            <Search className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <span className="truncate text-text-secondary">Search topics or links…</span>
            <kbd className="ml-auto px-2 py-0.5 text-[10px] font-mono font-bold bg-canvas border border-hairline rounded-full text-text-secondary">⌘K</kbd>
          </button>

          {/* Right Nav Links & Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {isMarketing && (
              <div className="hidden md:flex items-center gap-6 text-xs font-extrabold uppercase tracking-widest text-text-primary">
                {[['Features','/features'],['Pricing','/pricing'],['About','/about'],['Contact','/contact']].map(([label, path]) => (
                  <Link key={path} to={path} className={`hover:opacity-75 transition-opacity duration-100 ${location.pathname === path ? 'border-b-2 border-text-primary pb-0.5' : ''}`}>
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Theme Toggle Circle Pill */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-surface-2 border border-hairline text-text-primary hover:opacity-80 transition-colors duration-100 flex items-center justify-center cursor-pointer shadow-sm"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-text-primary" />}
              </button>

              {user ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-canvas text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all duration-100 shadow-sm"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-surface-2 border border-hairline transition-all duration-100"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-text-primary text-canvas text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all duration-100 shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}

export default Navbar;
