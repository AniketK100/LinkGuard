import React, { useState } from 'react';
import { Bell, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Settings</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Manage your workspace preferences and appearance.</p>
      </div>

      {/* Notifications Preference */}
      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" strokeWidth={1.75} />
          <span>Notifications</span>
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-primary">Email Notifications</p>
            <p className="text-xs text-text-tertiary">Receive email alerts when your links get clicks.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={emailNotifs}
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              emailNotifs ? 'bg-indigo-600' : 'bg-surface-2 border border-hairline'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                emailNotifs ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Appearance & Dark Mode Preference */}
      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
          {isDark ? <Moon className="w-4 h-4 text-accent" strokeWidth={1.75} /> : <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.75} />}
          <span>Appearance</span>
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-primary">Dark Mode</p>
            <p className="text-xs text-text-tertiary">Switch between sleek dark mode and crisp light mode.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDark ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isDark ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
