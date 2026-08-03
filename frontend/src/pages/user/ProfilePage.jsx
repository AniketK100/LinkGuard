import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Account Profile</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Manage user information and role assignments.</p>
      </div>

      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-hairline">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center font-bold text-lg font-mono">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">{user?.name || 'User'}</h3>
            <p className="text-xs font-mono text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="font-semibold text-text-tertiary uppercase tracking-widest text-[10px]">User Role</span>
            <Badge variant="admin">{user?.role || 'USER'}</Badge>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="font-semibold text-text-tertiary uppercase tracking-widest text-[10px]">Account ID</span>
            <span className="font-mono text-text-primary font-medium">#{user?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
