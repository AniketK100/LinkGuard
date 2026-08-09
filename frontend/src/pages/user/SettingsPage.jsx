import React, { useState } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Settings</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Manage your workspace preferences.</p>
      </div>

      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" strokeWidth={1.75} />
          <span>Notifications</span>
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Email Notifications</p>
            <p className="text-xs text-text-tertiary">Receive email alerts when links get clicks.</p>
          </div>
          <button
            type="button"
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${emailNotifs ? 'bg-accent' : 'bg-surface-2 border border-hairline'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailNotifs ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
          {isDark ? <Moon className="w-4 h-4 text-accent" strokeWidth={1.75} /> : <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.75} />}
          <span>Appearance</span>
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Dark Mode</p>
            <p className="text-xs text-text-tertiary">Use dark theme across the application.</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isDark ? 'bg-accent' : 'bg-surface-2 border border-hairline'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isDark ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
