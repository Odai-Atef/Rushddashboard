/**
 * Service Registry
 * 
 * Provides a centralized registry for all API services,
 * following the Service Locator pattern for dependency management.
 */

import { AuthService, authService } from './auth-service';
import { DashboardService, dashboardService } from './dashboard-service';
import { DonorService, donorService } from './donor-service';
import { NotificationService, notificationService } from './notification-service';
import { OnboardingService, onboardingService } from './onboarding-service';
import { ProjectService, projectService } from './project-service';
import { SubscriptionService, subscriptionService } from './subscription-service';
import { UserService, userService } from './user-service';

export interface Services {
  auth: AuthService;
  dashboard: DashboardService;
  donor: DonorService;
  notification: NotificationService;
  onboarding: OnboardingService;
  project: ProjectService;
  subscription: SubscriptionService;
  user: UserService;
}

class ServiceRegistry {
  private services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  getAuthService(): AuthService {
    return this.services.auth;
  }

  getDashboardService(): DashboardService {
    return this.services.dashboard;
  }

  getDonorService(): DonorService {
    return this.services.donor;
  }

  getOnboardingService(): OnboardingService {
    return this.services.onboarding;
  }

  getProjectService(): ProjectService {
    return this.services.project;
  }

  getNotificationService(): NotificationService {
    return this.services.notification;
  }

  getSubscriptionService(): SubscriptionService {
    return this.services.subscription;
  }

  getUserService(): UserService {
    return this.services.user;
  }
}
const defaultServices: Services = {
  auth: authService,
  dashboard: dashboardService,
  donor: donorService,
  notification: notificationService,
  onboarding: onboardingService,
  project: projectService,
  subscription: subscriptionService,
  user: userService,
};

// Export singleton registry
export const serviceRegistry = new ServiceRegistry(defaultServices);
export default serviceRegistry;

// Re-export all services for direct access
export { AuthService, authService } from './auth-service';
export { DashboardService, dashboardService } from './dashboard-service';
export { AnalysisService, analysisService } from './analysis-service';
export { DonorService, donorService } from './donor-service';
export { NotificationService, notificationService } from './notification-service';
export { OnboardingService, onboardingService } from './onboarding-service';
export { ProjectService, projectService } from './project-service';
export { SubscriptionService, subscriptionService } from './subscription-service';
export { UserService, userService } from './user-service';
