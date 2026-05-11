import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { ForgetPasswordPage } from './components/ForgetPasswordPage';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { AIAnalysisPage } from './components/AIAnalysisPage';
import { SalesDashboard } from './components/SalesDashboard';
import { CustomersDashboard } from './components/CustomersDashboard';
import { OperationsDashboard } from './components/OperationsDashboard';
import { MarketingDashboard } from './components/MarketingDashboard';
import { RecommendationsDashboard } from './components/RecommendationsDashboard';
import { OpportunitiesDashboard } from './components/OpportunitiesDashboard';
import { ProfitabilityDashboard } from './components/ProfitabilityDashboard';
import { HRDashboard } from './components/HRDashboard';
import { InventoryDashboard } from './components/InventoryDashboard';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'auth',
        Component: AuthLayout,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace />,
          },
          {
            path: 'login',
            Component: LoginPage,
          },
          {
            path: 'register',
            Component: RegistrationPage,
          },
          {
            path: 'forgot-password',
            Component: ForgetPasswordPage,
          },
        ],
      },
      {
        path: 'dashboard',
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: ExecutiveDashboard,
          },
          {
            path: 'ai-analysis',
            Component: AIAnalysisPage,
          },
          {
            path: 'sales',
            Component: SalesDashboard,
          },
          {
            path: 'customers',
            Component: CustomersDashboard,
          },
          {
            path: 'operations',
            Component: OperationsDashboard,
          },
          {
            path: 'marketing',
            Component: MarketingDashboard,
          },
          {
            path: 'recommendations',
            Component: RecommendationsDashboard,
          },
          {
            path: 'opportunities',
            Component: OpportunitiesDashboard,
          },
          {
            path: 'profitability',
            Component: ProfitabilityDashboard,
          },
          {
            path: 'hr',
            Component: HRDashboard,
          },
          {
            path: 'inventory',
            Component: InventoryDashboard,
          },
          {
            path: 'settings',
            Component: SettingsPage,
          },
          {
            path: 'notifications',
            Component: NotificationsPage,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
