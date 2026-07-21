import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useRouteError } from 'react-router';
// Router configuration - Updated 2026-06-07
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { ForgetPasswordPage } from './components/ForgetPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ActivateAccountPage } from './components/ActivateAccountPage';
import { OrgRegistrationPage } from './pages/auth/OrgRegistrationPage';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { AIAnalysisStartPage, AIAnalysisChatPage, AIAnalysisHistoryPage } from './components/ai-analysis';
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
import { DataSourcesPage } from './components/DataSourcesPage';
import { ComplianceRiskPage } from './components/ComplianceRiskPage';
import { AnalysisHistoryPage } from './components/AnalysisHistoryPage';
import { ProjectJourneyPage } from './components/ProjectJourneyPage';
import { OnboardingLayout } from './pages/onboarding/OnboardingLayout';
import { CharityAssessmentStartPage } from './pages/charity-assessment/CharityAssessmentStartPage';
import { CharityAssessmentWizardPage } from './pages/charity-assessment/CharityAssessmentWizardPage';
import { CharityAssessmentResultsPage } from './pages/charity-assessment/CharityAssessmentResultsPage';
import { CharityAssessmentRoadmapPage } from './pages/charity-assessment/CharityAssessmentRoadmapPage';
import { ProjectDashboardPage } from './pages/project-management/ProjectDashboardPage';
import { ProjectListPage } from './pages/project-management/ProjectListPage';
import { ProjectCreatePage } from './pages/project-management/ProjectCreatePage';
import { ProjectEditPage } from './pages/project-management/ProjectEditPage';
import { ProjectDetailsPage } from './pages/project-management/ProjectDetailsPage';
import { ProjectLifecyclePage } from './pages/project-management/ProjectLifecyclePage';
import { ProjectVersionsPage } from './pages/project-management/ProjectVersionsPage';
import { ProjectActivityPage } from './pages/project-management/ProjectActivityPage';
import { ProjectReportingPage } from './pages/project-management/ProjectReportingPage';
import { AIProjectInnovationModule } from './components/AIProjectInnovationModule';
import { ProjectCollaborationModule } from './components/ProjectCollaborationModule';
import { DonorsPage } from './components/donors/DonorsPage';
import { IncubatorOverviewDashboard } from './components/IncubatorOverviewDashboard';
import { CharityAnalyticsDashboard } from './components/CharityAnalyticsDashboard';
import { ProjectAnalyticsDashboard } from './components/ProjectAnalyticsDashboard';
import { FundingDonorAnalytics } from './components/FundingDonorAnalytics';
import { OperationsPerformanceDashboard } from './components/OperationsPerformanceDashboard';
import { DonorMatchingLayout } from './pages/donor-matching/DonorMatchingLayout';
import { DonorMatchingDashboardPage } from './pages/donor-matching/DonorMatchingDashboardPage';
import { AIRecommendedDonorsPage } from './pages/donor-matching/AIRecommendedDonorsPage';
import { MatchAnalysisPage } from './pages/donor-matching/MatchAnalysisPage';
import { FundingReadinessAssessmentPage } from './pages/donor-matching/FundingReadinessAssessmentPage';
import { SubmissionPreparationPage } from './pages/donor-matching/SubmissionPreparationPage';
import { MatchingAnalyticsPage } from './pages/donor-matching/MatchingAnalyticsPage';
import { OrganizationDonorsPage } from './pages/organization-donors/OrganizationDonorsPage';
import { RoleRouteGuard, MenuItemDefinition } from './components/RoleRouteGuard';
import { MENU_ITEMS_FOR_GUARD } from './components/RoleRouteGuard/menuItems';
import { AssessmentAllowedGuard } from './components/AssessmentAllowedGuard';
import { UserActivationPage } from './pages/admin/UserActivationPage';
import { PaymentCallbackPage } from './pages/payment/PaymentCallbackPage';
import { PricingPage } from './pages/pricing/PricingPage';
import { PackagesPage } from './pages/public/PackagesPage';
import { SLAPage } from './pages/public/SLAPage';

const OnboardingLandingPage = lazy(() => import('./pages/onboarding/LandingPage').then(m => ({ default: m.LandingPage })));
const OnboardingRegistrationPage = lazy(() => import('./pages/onboarding/RegistrationPage').then(m => ({ default: m.RegistrationPage })));
const OnboardingInfoPage = lazy(() => import('./pages/onboarding/InfoPage').then(m => ({ default: m.InfoPage })));
const OnboardingProfilePage = lazy(() => import('./pages/onboarding/ProfilePage').then(m => ({ default: m.ProfilePage })));
const OnboardingAssessmentPage = lazy(() => import('./pages/onboarding/AssessmentPage').then(m => ({ default: m.AssessmentPage })));
const OnboardingDocumentsPage = lazy(() => import('./pages/onboarding/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const OnboardingPreloaderPage = lazy(() => import('./pages/onboarding/PreloaderPage').then(m => ({ default: m.PreloaderPage })));
const OnboardingProcessingPage = lazy(() => import('./pages/onboarding/ProcessingPage').then(m => ({ default: m.ProcessingPage })));
const OnboardingResultsPage = lazy(() => import('./pages/onboarding/ResultsPage').then(m => ({ default: m.ResultsPage })));
const OnboardingAnalysisPage = lazy(() => import('./pages/onboarding/AnalysisPage').then(m => ({ default: m.AnalysisPage })));
const OnboardingRoadmapPage = lazy(() => import('./pages/onboarding/RoadmapPage').then(m => ({ default: m.RoadmapPage })));
const OnboardingDecisionPage = lazy(() => import('./pages/onboarding/DecisionPage').then(m => ({ default: m.DecisionPage })));
const OnboardingThanksPage = lazy(() => import('./pages/onboarding/ThanksPage').then(m => ({ default: m.ThanksPage })));

const OnboardingPageShell = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
    {children}
  </Suspense>
);

function RouterErrorBoundary() {
  const error = useRouteError() as Error;
  console.error('Router error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ</h1>
        <p className="text-gray-600 mb-6">{error?.message || 'حدث خطأ غير متوقع أثناء تحميل الصفحة'}</p>
        <button
          onClick={() => window.location.href = '/dashboard/charity-assessment'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/charity-assessment" replace />,
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
            path: 'register/org',
            Component: OrgRegistrationPage,
          },
          {
            path: 'forgot-password',
            Component: ForgetPasswordPage,
          },
          {
            path: 'reset-password',
            Component: ResetPasswordPage,
          },
          {
            path: 'activate',
            Component: ActivateAccountPage,
          },
        ],
      },
      {
        path: 'packages',
        element: <PackagesPage />,
      },
      {
        path: 'sla/:packageId',
        element: <SLAPage />,
      },
      {
        path: 'reset-password',
        Component: ResetPasswordPage,
      },
      {
        path: 'payment/callback',
        element: (
          <PaymentCallbackPage />
        ),
      },
      {
        path: 'dashboard',
        Component: DashboardLayout,
        errorElement: <RouterErrorBoundary />,
        children: [
          {
            index: true,
            Component: ExecutiveDashboard,
          },
          {
            path: 'ai-analysis',
            children: [
              {
                index: true,
                Component: AIAnalysisStartPage,
              },
              {
                path: 'start',
                Component: AIAnalysisStartPage,
              },
              {
                path: 'chat',
                children: [
                  {
                    index: true,
                    Component: AIAnalysisChatPage,
                  },
                  {
                    path: ':chatId',
                    Component: AIAnalysisChatPage,
                  },
                ],
              },
              {
                path: 'history',
                Component: AIAnalysisHistoryPage,
              },
              {
                path: '*',
                element: <Navigate to="/dashboard/ai-analysis" replace />,
              },
            ],
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
          {
            path: 'data-sources',
            Component: DataSourcesPage,
          },
          {
            path: 'compliance-risk',
            Component: ComplianceRiskPage,
          },
          {
            path: 'analysis-history',
            Component: AnalysisHistoryPage,
          },
          {
            path: 'project-journey',
            Component: ProjectJourneyPage,
          },
          {
            path: 'charity-assessment',
            children: [
              {
                index: true,
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <CharityAssessmentStartPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'assessment/:organizationId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <CharityAssessmentWizardPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'assessment',
                element: <Navigate to="/dashboard/charity-assessment" replace />,
              },
              {
                path: 'results/:organizationId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <CharityAssessmentResultsPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'roadmap/:organizationId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <CharityAssessmentRoadmapPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'roadmap',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <CharityAssessmentRoadmapPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: '*',
                element: <Navigate to="/dashboard/charity-assessment" replace />,
              },
            ],
          },
          {
            path: 'onboarding',
            element: <OnboardingLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/onboarding/landing" replace />,
              },
              {
                path: 'landing',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingLandingPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'registration',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingRegistrationPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'info',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingInfoPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'profile',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingProfilePage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'assessment',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell>
                      <AssessmentAllowedGuard>
                        <OnboardingAssessmentPage />
                      </AssessmentAllowedGuard>
                    </OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'documents',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingDocumentsPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'thanks',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingThanksPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'preloader',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingPreloaderPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'processing',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingProcessingPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'results',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingResultsPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'analysis',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingAnalysisPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'roadmap',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingRoadmapPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'decision',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <OnboardingPageShell><OnboardingDecisionPage /></OnboardingPageShell>
                  </RoleRouteGuard>
                ),
              },
              {
                path: '*',
                element: <Navigate to="/dashboard/onboarding/landing" replace />,
              },
            ],
          },
          {
            path: 'project-management',
            children: [
              {
                index: true,
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectDashboardPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'list',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectListPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'create',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectCreatePage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'edit/:projectId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectEditPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'details/:projectId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectDetailsPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'lifecycle/:projectId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectLifecyclePage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'versions/:projectId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectVersionsPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'activity/:projectId',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectActivityPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: 'reporting',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <ProjectReportingPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: '*',
                element: <Navigate to="/dashboard/project-management" replace />,
              },
            ],
          },
          {
            path: 'pricing',
            element: (
              <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                <PricingPage />
              </RoleRouteGuard>
            ),
          },
          {
            path: 'ai-innovation',
            Component: AIProjectInnovationModule,
          },
          {
            path: 'collaboration',
            element: (
              <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                <Outlet />
              </RoleRouteGuard>
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/project-management/list" replace />,
              },
              {
                path: ':projectId',
                children: [
                  {
                    index: true,
                    element: <Navigate to="hub" replace />,
                  },
                  {
                    path: ':view',
                    Component: ProjectCollaborationModule,
                  },
                ],
              },
            ],
          },
          {
            path: 'donors',
            element: (
              <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                <DonorsPage />
              </RoleRouteGuard>
            ),
          },
          {
            path: 'incubator-overview',
            Component: IncubatorOverviewDashboard,
          },
          {
            path: 'charity-analytics',
            Component: CharityAnalyticsDashboard,
          },
          {
            path: 'project-analytics',
            Component: ProjectAnalyticsDashboard,
          },
          {
            path: 'funding-analytics',
            Component: FundingDonorAnalytics,
          },
          {
            path: 'operations-analytics',
            Component: OperationsPerformanceDashboard,
          },
          {
            path: 'organization-donors',
            element: (
              <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                <OrganizationDonorsPage />
              </RoleRouteGuard>
            ),
          },
          {
            path: 'donor-matching',
            element: (
              <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                <DonorMatchingLayout />
              </RoleRouteGuard>
            ),
            children: [
              { index: true, element: <DonorMatchingDashboardPage /> },
               { path: 'recommended/:projectId', element: <AIRecommendedDonorsPage /> },
              { path: 'analysis/:donorId', element: <MatchAnalysisPage /> },
              { path: 'readiness', element: <FundingReadinessAssessmentPage /> },
              { path: 'submission/:donorId', element: <SubmissionPreparationPage /> },
              { path: 'analytics', element: <MatchingAnalyticsPage /> },
            ],
          },
          {
            path: 'manage',
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/manage/org" replace />,
              },
              {
                path: 'org',
                element: (
                  <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
                    <UserActivationPage />
                  </RoleRouteGuard>
                ),
              },
              {
                path: '*',
                element: <Navigate to="/dashboard/manage/org" replace />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/dashboard/charity-assessment" replace />,
      },
    ],
  },
]);
