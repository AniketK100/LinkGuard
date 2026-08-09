import React, { useState } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';

export function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

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
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${emailNotifs ? 'bg-accent' : 'bg-surface-2 border border-hairline'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailNotifs ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-accent" strokeWidth={1.75} /> : <Sun className="w-4 h-4 text-accent" strokeWidth={1.75} />}
          <span>Appearance</span>
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Dark Mode</p>
            <p className="text-xs text-text-tertiary">Use dark theme across the dashboard.</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${darkMode ? 'bg-accent' : 'bg-surface-2 border border-hairline'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
