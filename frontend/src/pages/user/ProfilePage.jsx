import React from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">User Profile</h1>
        <p className="text-xs text-slate-400">View and update your personal account information.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Role: {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
