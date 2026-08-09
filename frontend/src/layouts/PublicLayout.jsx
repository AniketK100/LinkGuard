import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary font-sans pt-18 sm:pt-20">
      <Navbar />
      <main id="main-content" role="main" className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
