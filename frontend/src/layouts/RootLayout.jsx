import React from 'react';
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">LinkGuard</h1>
          <span className="text-sm text-slate-500 font-medium">Intelligent URL Platform</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} LinkGuard Platform. All rights reserved.
      </footer>
    </div>
  );
}

export default RootLayout;
