import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Link2, BarChart3, QrCode, Shield, Bell, Settings, Users, FileText, Wrench, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ mode = 'user' }) {
  const { isAdmin } = useAuth();

  const userLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/urls', label: 'My Links', icon: Link2 },
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/qr-codes', label: 'QR Studio', icon: QrCode },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/urls', label: 'Global Links', icon: Link2 },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/security', label: 'Threat Center', icon: ShieldAlert },
    { to: '/admin/audit', label: 'Audit Log', icon: FileText },
    { to: '/admin/config', label: 'Config', icon: Wrench },
  ];

  const links = mode === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-52 bg-surface border-r border-hairline sticky top-14 h-[calc(100vh-3.5rem)] py-4 px-2 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
      <div className="space-y-1">
        <div className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          {mode === 'admin' ? 'Administration' : 'Workspace'}
        </div>
        <nav className="space-y-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard' || link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-100 ${
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/15'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {isAdmin && mode !== 'admin' && (
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-accent text-xs font-semibold hover:bg-accent/10 transition-colors duration-100"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </NavLink>
      )}
    </aside>
  );
}

export default Sidebar;
