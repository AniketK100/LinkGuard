import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Link2, BarChart3, QrCode, Shield,
  Bell, Settings, Users, FileText, Wrench, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ mode = 'user' }) {
  const { isAdmin } = useAuth();

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/urls', label: 'My Links', icon: Link2 },
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/qr-codes', label: 'QR Codes', icon: QrCode },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/urls', label: 'Global Links', icon: Link2 },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/security', label: 'Security & Threats', icon: ShieldAlert },
    { to: '/admin/audit', label: 'Audit Logs', icon: FileText },
    { to: '/admin/config', label: 'System Settings', icon: Wrench },
  ];

  const links = mode === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {mode === 'admin' ? 'Admin Control Center' : 'Workspace'}
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard' || link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {isAdmin && mode !== 'admin' && (
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
        >
          <Shield className="w-4 h-4" />
          <span>Switch to Admin Portal</span>
        </NavLink>
      )}
    </aside>
  );
}

export default Sidebar;
