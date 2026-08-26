import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Search, LogOut, LayoutDashboard, Sun, Moon, Menu, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CommandPalette from './CommandPalette';
import Modal from './Modal';
import Button from './Button';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isMarketing = ['/', '/features', '/pricing', '/about', '/contact', '/privacy', '/terms'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  return (
    <header role="banner" className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-200 ${
      scrolled ? 'glass border-b border-hairline shadow-md' : 'bg-canvas border-b border-hairline'
    }`}>
      <nav role="navigation" aria-label="Main Navigation">
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
          <div className="flex items-center gap-3 sm:gap-6">
            {isMarketing && (
              <div className="hidden md:flex items-center gap-6 text-xs font-extrabold uppercase tracking-widest text-text-primary">
                {[['Features','/features'],['Pricing','/pricing'],['About','/about'],['Contact','/contact']].map(([label, path]) => (
                  <Link key={path} to={path} className={`hover:opacity-75 transition-opacity duration-100 ${location.pathname === path ? 'border-b-2 border-text-primary pb-0.5' : ''}`}>
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3">
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
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-text-primary text-canvas text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all duration-100 shadow-sm"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>

                  <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-surface-2 border border-hairline rounded-full text-xs font-semibold text-text-primary shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="truncate max-w-[130px] font-mono">{user.name || user.email?.split('@')[0]}</span>
                  </div>

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-9 h-9 rounded-full bg-surface-2 border border-hairline text-text-secondary hover:text-text-primary hover:bg-surface-2/80 transition-colors duration-100 flex items-center justify-center cursor-pointer shadow-xs"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 sm:px-6 py-2.5 rounded-full bg-text-primary text-canvas text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all duration-100 shadow-md"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-surface-2 border border-hairline text-text-primary"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-hairline bg-surface p-6 space-y-4 animate-fade-in shadow-xl">
            <button
              onClick={() => { setIsCommandOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-surface-2 border border-hairline rounded-xl text-xs text-text-secondary"
            >
              <Search className="w-4 h-4" />
              <span>Search links & command palette…</span>
            </button>
            <div className="flex flex-col gap-3 pt-2 text-sm font-extrabold uppercase tracking-wider text-text-primary">
              {[['Features','/features'],['Pricing','/pricing'],['About','/about'],['Contact','/contact'],['Privacy','/privacy'],['Terms','/terms']].map(([label, path]) => (
                <Link key={path} to={path} className="py-2 border-b border-hairline/50 hover:opacity-80">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Themed Sign Out Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Sign Out Confirmation">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-warning/10 border border-warning/20 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">Are you sure you want to sign out?</p>
              <p className="text-xs text-text-secondary">You will need to sign back in to manage your active short links and view telemetry analytics.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button onClick={confirmLogout} className="bg-danger hover:bg-danger/90 text-white border-danger">
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}

export default Navbar;
