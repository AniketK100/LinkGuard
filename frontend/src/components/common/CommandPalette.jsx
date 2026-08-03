import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Link2, BarChart3, QrCode, Shield, Settings, Users, X, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Create new short link', icon: Plus, path: '/dashboard', shortcut: 'N' },
    { label: 'Go to Dashboard', icon: Link2, path: '/dashboard' },
    { label: 'View Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { label: 'QR Code Studio', icon: QrCode, path: '/dashboard/qr-codes' },
    { label: 'Account Settings', icon: Settings, path: '/dashboard/settings' },
    ...(isAdmin ? [
      { label: 'Admin Portal', icon: Shield, path: '/admin/dashboard' },
      { label: 'User Directory', icon: Users, path: '/admin/users' },
    ] : []),
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="glass rounded-xl max-w-lg w-full overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-hairline gap-3">
          <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 bg-transparent text-sm text-text-primary placeholder-text-tertiary focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-hairline rounded text-text-tertiary">ESC</kbd>
        </div>

        <div className="p-1.5 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-tertiary">No matching commands.</div>
          ) : (
            filtered.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(action.path)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-100 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors duration-100" />
                    <span>{action.label}</span>
                  </div>
                  {action.shortcut && (
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-hairline rounded text-text-tertiary">
                      {action.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
