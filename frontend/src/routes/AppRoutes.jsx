import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import PricingPage from '../pages/public/PricingPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import PasswordVerifyPage from '../pages/public/PasswordVerifyPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import TermsPage from '../pages/public/TermsPage';
import DocsPage from '../pages/public/DocsPage';
import ShortCodeRedirect from '../pages/public/ShortCodeRedirect';
import NotFoundPage from '../pages/public/NotFoundPage';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import UrlManagementPage from '../pages/user/UrlManagementPage';
import AnalyticsPage from '../pages/user/AnalyticsPage';
import QrCodePage from '../pages/user/QrCodePage';
import NotificationsPage from '../pages/user/NotificationsPage';
import ProfilePage from '../pages/user/ProfilePage';
import SettingsPage from '../pages/user/SettingsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminUrlsPage from '../pages/admin/AdminUrlsPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminSecurityPage from '../pages/admin/AdminSecurityPage';
import AdminAuditPage from '../pages/admin/AdminAuditPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminConfigPage from '../pages/admin/AdminConfigPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="api" element={<DocsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-password" element={<PasswordVerifyPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
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
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="urls" element={<AdminUrlsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="security" element={<AdminSecurityPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="config" element={<AdminConfigPage />} />
      </Route>

      {/* Short Link Resolution Route */}
      <Route path="/:shortCode" element={<ShortCodeRedirect />} />

      {/* 404 Catch-All Wrapped in PublicLayout */}
      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
    </Routes>
  );
}

export default AppRoutes;
