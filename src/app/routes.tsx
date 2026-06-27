import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
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
import { DonorMatchingModule } from './components/donor-matching/DonorMatchingModule';

const OnboardingLandingPage = lazy(() => import('./pages/onboarding/LandingPage').then(m => ({ default: m.LandingPage })));
const OnboardingRegistrationPage = lazy(() => import('./pages/onboarding/RegistrationPage').then(m => ({ default: m.RegistrationPage })));
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
        path: 'dashboard',
        Component: DashboardLayout,
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
                Component: CharityAssessmentStartPage,
              },
              {
                path: 'assessment/:organizationId',
                Component: CharityAssessmentWizardPage,
              },
              {
                path: 'assessment',
                element: <Navigate to="/dashboard/charity-assessment" replace />,
              },
              {
                path: 'results/:organizationId',
                Component: CharityAssessmentResultsPage,
              },
              {
                path: 'roadmap/:organizationId',
                Component: CharityAssessmentRoadmapPage,
              },
              {
                path: 'roadmap',
                Component: CharityAssessmentRoadmapPage,
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
                element: <OnboardingPageShell><OnboardingLandingPage /></OnboardingPageShell>,
              },
              {
                path: 'registration',
                element: <OnboardingPageShell><OnboardingRegistrationPage /></OnboardingPageShell>,
              },
              {
                path: 'profile',
                element: <OnboardingPageShell><OnboardingProfilePage /></OnboardingPageShell>,
              },
              {
                path: 'assessment',
                element: <OnboardingPageShell><OnboardingAssessmentPage /></OnboardingPageShell>,
              },
              {
                path: 'documents',
                element: <OnboardingPageShell><OnboardingDocumentsPage /></OnboardingPageShell>,
              },
              {
                path: 'thanks',
                element: <OnboardingPageShell><OnboardingThanksPage /></OnboardingPageShell>,
              },
              {
                path: 'preloader',
                element: <OnboardingPageShell><OnboardingPreloaderPage /></OnboardingPageShell>,
              },
              {
                path: 'processing',
                element: <OnboardingPageShell><OnboardingProcessingPage /></OnboardingPageShell>,
              },
              {
                path: 'results',
                element: <OnboardingPageShell><OnboardingResultsPage /></OnboardingPageShell>,
              },
              {
                path: 'analysis',
                element: <OnboardingPageShell><OnboardingAnalysisPage /></OnboardingPageShell>,
              },
              {
                path: 'roadmap',
                element: <OnboardingPageShell><OnboardingRoadmapPage /></OnboardingPageShell>,
              },
              {
                path: 'decision',
                element: <OnboardingPageShell><OnboardingDecisionPage /></OnboardingPageShell>,
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
                Component: ProjectDashboardPage,
              },
              {
                path: 'list',
                Component: ProjectListPage,
              },
              {
                path: 'create',
                Component: ProjectCreatePage,
              },
              {
                path: 'edit/:projectId',
                Component: ProjectEditPage,
              },
              {
                path: 'details/:projectId',
                Component: ProjectDetailsPage,
              },
              {
                path: 'lifecycle/:projectId',
                Component: ProjectLifecyclePage,
              },
              {
                path: 'versions/:projectId',
                Component: ProjectVersionsPage,
              },
              {
                path: 'activity/:projectId',
                Component: ProjectActivityPage,
              },
              {
                path: 'reporting',
                Component: ProjectReportingPage,
              },
              {
                path: '*',
                element: <Navigate to="/dashboard/project-management" replace />,
              },
            ],
          },
          {
            path: 'ai-innovation',
            Component: AIProjectInnovationModule,
          },
          {
            path: 'collaboration',
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
            Component: DonorsPage,
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
            path: 'donor-matching',
            Component: DonorMatchingModule,
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
