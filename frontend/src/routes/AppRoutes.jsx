import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Eager landing page for instant first paint
import LandingPage from '../pages/public/LandingPage';

// Lazy-loaded routes for code splitting & ultra-fast initial load
const FeaturesPage = lazy(() => import('../pages/public/FeaturesPage'));
const PricingPage = lazy(() => import('../pages/public/PricingPage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = lazy(() => import('../pages/public/RegisterPage'));
const PasswordVerifyPage = lazy(() => import('../pages/public/PasswordVerifyPage'));
const PrivacyPage = lazy(() => import('../pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/public/TermsPage'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'));

// User Pages (Lazy)
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const UrlManagementPage = lazy(() => import('../pages/user/UrlManagementPage'));
const AnalyticsPage = lazy(() => import('../pages/user/AnalyticsPage'));
const QrCodePage = lazy(() => import('../pages/user/QrCodePage'));
const NotificationsPage = lazy(() => import('../pages/user/NotificationsPage'));
const ProfilePage = lazy(() => import('../pages/user/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/user/SettingsPage'));

// Admin Pages (Lazy)
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminUrlsPage = lazy(() => import('../pages/admin/AdminUrlsPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const AdminSecurityPage = lazy(() => import('../pages/admin/AdminSecurityPage'));
const AdminAuditPage = lazy(() => import('../pages/admin/AdminAuditPage'));
const AdminReportsPage = lazy(() => import('../pages/admin/AdminReportsPage'));
const AdminConfigPage = lazy(() => import('../pages/admin/AdminConfigPage'));

const PageSkeleton = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path=":shortCode/verify" element={<PasswordVerifyPage />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="urls" element={<UrlManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="qr-codes" element={<QrCodePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="urls" element={<AdminUrlsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="security" element={<AdminSecurityPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="config" element={<AdminConfigPage />} />
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
