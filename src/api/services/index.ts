/**
 * Service Registry
 * 
 * Provides a centralized registry for all API services,
 * following the Service Locator pattern for dependency management.
 */

import { AuthService, authService } from './auth-service';
import { DashboardService, dashboardService } from './dashboard-service';

export interface Services {
  auth: AuthService;
  dashboard: DashboardService;
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
}

// Default service registry with singleton instances
const defaultServices: Services = {
  auth: authService,
  dashboard: dashboardService,
};

// Export singleton registry
export const serviceRegistry = new ServiceRegistry(defaultServices);
export default serviceRegistry;

// Re-export all services for direct access
export { AuthService, authService } from './auth-service';
export { DashboardService, dashboardService } from './dashboard-service';
export { AnalysisService, analysisService } from './analysis-service';
