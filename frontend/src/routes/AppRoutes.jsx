import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={
          <div className="p-8 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome to LinkGuard</h2>
            <p className="text-slate-600">Frontend Foundation Initialized Successfully.</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
