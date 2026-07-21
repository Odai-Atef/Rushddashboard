import {
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export interface FundingAreaInfo {
  id: string;
  name: string;
  nameAr?: string;
}

export type ProjectStatus =
  | 'created'
  | 'draft'
  | 'charity-review'
  | 'charity-decision'
  | 'incubator-modifications'
  | 'modifications-done-waiting-for-review'
  | 'charity-approval'
  | 'pm-approval'
  | 'financial-approval'
  | 'approved'
  | 'design-team'
  | 'design-team-approval'
  | 'design-review'
  | 'design-approved'
  | 'design-rejected'
  | 'design-decision'
  | 'offer-review'
  | 'offer-approved'
  | 'offer-rejected'
  | 'offer-generated'
  | 'ready-donor'
  | 'submitted-donor'
  | 'funded'
  | 'execution'
  | 'completed'
  | 'project-suspended'
  | 'closed';

export type ProjectHealth = 'excellent' | 'good' | 'at-risk' | 'critical';

export interface ProjectManager {
  id: string;
  name: string;
  email: string;
}

export interface ProjectActivity {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface ProjectBudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  currencyCode: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  progress: number;
}

export interface ProjectDocument {
  id: string;
  fileId: string;
  documentType: string;
  createdAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  category: string;
  status: ProjectStatus | string;
  budget: number | Record<string, unknown>;
  currencyCode: string;
  duration: string;
  startDate: string;
  endDate: string;
  progress: number;
  managerId: string | null;
  description: string;
  beneficiaries: string;
  beneficiariesCount?: number;
  geographicScope: string;
  health: ProjectHealth | string;
  version: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  manager?: ProjectManager | string | null;
  activities?: ProjectActivity[];
  budgets?: ProjectBudgetItem[];
  milestones?: ProjectMilestone[];
  documents?: ProjectDocument[];
  organization?: string;
  lastUpdated?: string;
  fundingAreaIds?: string[];
  fundingAreas?: FundingAreaInfo[];
  unreadMessageCount?: number;
  modificationsCount?: number;
}

export interface ProjectDetails extends Project {
  manager: ProjectManager | null;
  activities: ProjectActivity[];
  budgets: ProjectBudgetItem[];
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  llmResponse?: string;
  llmResponseText?: string;
  aiStudy?: string;
  generatedStudy?: string;
  presentationResponseText?: string;
  packageId?: string | null;
  packageName?: string | null;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  budget: number;
  currencyCode: string;
  startDate: string;
  endDate: string;
  beneficiaries: string;
  beneficiariesCount: number;
  geographicScope: string;
  managerId: string;
  organizationId: string;
  fundingAreaIds: string[];
}

export interface CreatedProjectResponse extends CreateProjectDto {
  id: string;
  status: ProjectStatus | string;
  createdAt: string;
  updatedAt: string;
  health?: ProjectHealth | string;
  progress?: number;
  version?: number;
  manager?: string | null;
  organization?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: ProjectStatus | string;
  llmResponseText?: string;
  presentationResponseText?: string;
}

export interface ProjectListResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: string;
  organizationId?: string;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectVersion {
  id: string;
  version: number;
  author: string;
  date: string;
  summary: string;
  changes: string[];
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  type: 'created' | 'updated' | 'status-change' | 'approval' | 'assignment' | 'upload';
}

export const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bg: string }
> = {
  created: { label: 'جديد', color: '#6b7280', bg: '#f3f4f6' },
  draft: { label: 'بانتظار إنشاء المسودة', color: '#6b7280', bg: '#f3f4f6' },
  'charity-review': { label: 'في انتظار مراجعة الجهة لمسودة المشروع', color: '#3b82f6', bg: '#dbeafe' },
  'charity-decision': { label: 'قرار الجهة', color: '#8b5cf6', bg: '#ede9fe' },
  'incubator-modifications': { label: 'تعديلات الجهة', color: '#f59e0b', bg: '#fef3c7' },
  'modifications-done-waiting-for-review': { label: 'تم التعديل وبانتظار اعتماد الجمعية', color: '#3b82f6', bg: '#dbeafe' },
  'charity-approval': { label: 'تمت الموافقة من الجهة على المسودة', color: '#8b5cf6', bg: '#ede9fe' },
  'pm-approval': { label: 'بانتظار موافقة مدير المشروع', color: '#ec4899', bg: '#fce7f3' },
  'financial-approval': { label: 'موافقة مالية', color: '#14b8a6', bg: '#ccfbf1' },
  approved: { label: 'معتمد', color: '#10b981', bg: '#d1fae5' },
  'design-team': { label: 'فريق التصميم', color: '#6366f1', bg: '#e0e7ff' },
  'design-team-approval': { label: 'في انتظار موافقة فريق التصميم', color: '#10b981', bg: '#d1fae5' },
  'design-review': { label: 'في انتظار اعتماد الجهة للتصميم', color: '#8b5cf6', bg: '#ede9fe' },
  'design-approved': { label: 'تمت الموافقة على التصميم', color: '#10b981', bg: '#d1fae5' },
  'design-rejected': { label: 'طلب تعديل التصميم', color: '#ef4444', bg: '#fee2e2' },
  'design-decision': { label: 'قرار التصميم', color: '#8b5cf6', bg: '#ede9fe' },
  'offer-review': { label: 'بانتظار اعتماد عرض السعر', color: '#3b82f6', bg: '#dbeafe' },
  'offer-approved': { label: 'تم اعتماد عرض السعر', color: '#10b981', bg: '#d1fae5' },
  'offer-rejected': { label: 'تم رفض عرض السعر', color: '#ef4444', bg: '#fee2e2' },
  'offer-generated': { label: 'تم إنشاء عرض السعر', color: '#3b82f6', bg: '#dbeafe' },
  'ready-donor': { label: 'يجري الرفع للمانحين', color: '#06b6d4', bg: '#cffafe' },
  'submitted-donor': { label: 'مقدم للمانحين', color: '#0891b2', bg: '#cffafe' },
  funded: { label: 'ممول', color: '#10b981', bg: '#d1fae5' },
  execution: { label: 'قيد التنفيذ', color: '#3b82f6', bg: '#dbeafe' },
  completed: { label: 'مكتمل', color: '#22c55e', bg: '#dcfce7' },
  'project-suspended': { label: 'تم تعليق المشروع', color: '#dc2626', bg: '#fee2e2' },
  closed: { label: 'مغلق', color: '#6b7280', bg: '#f3f4f6' },
};

export const healthConfig: Record<
  ProjectHealth,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  excellent: { label: 'ممتاز', color: '#10b981', icon: CheckCircle2 },
  good: { label: 'جيد', color: '#3b82f6', icon: CheckCircle2 },
  'at-risk': { label: 'معرض للخطر', color: '#f59e0b', icon: AlertCircle },
  critical: { label: 'حرج', color: '#ef4444', icon: XCircle },
};

export type ViewType =
  | 'dashboard'
  | 'list'
  | 'create'
  | 'details'
  | 'lifecycle'
  | 'versions'
  | 'activity'
  | 'reporting';

export type ListViewMode = 'table' | 'kanban' | 'timeline';
