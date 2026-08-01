import { NavLink } from 'react-router';
import {
 LayoutDashboard,
 Users,
 TrendingUp,
 Cog,
 UserCog,
 Package,
 FileCheck,
 Lightbulb,
 X,
 Sparkles,
 DollarSign,
 Warehouse,
 Settings,
 Bell,
 Database,
 ShieldAlert,
 History,
 Briefcase,
 ClipboardCheck,
 UserPlus,
 Brain,
 MessageSquare,
 Building2,
 BarChart3,
 FolderKanban,
 Activity,
 Ticket,
 CreditCard,
 HeartHandshake,
 MapPin,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { ENV } from '@/lib/env';
import { filterMenuItemsByRole } from '@/config/menuAccess';
import { useEffect } from 'react';

interface MobileNavProps {
 isOpen: boolean;
 activeView: string;
 onClose: () => void;
}

export function MobileNav({ isOpen, activeView, onClose }: MobileNavProps) {
 const { user } = useAuth();
 const allowedUserIds = ENV.RESTRICTED_MENU_USER_IDS;
 const currentUserId = user?.id;
 const canSeeRestricted = Boolean(currentUserId && allowedUserIds.includes(currentUserId));
 const roleSlug = user?.roleSlug ?? null;

 const commonNavItems: { id: string; label: string; icon: typeof UserPlus; path: string; linkTo?: string }[] = [
 { id: 'charity-assessment', label: 'تقييم الجاهزية', icon: ClipboardCheck, path: '/dashboard/charity-assessment' },
 { id: 'charity-assessment-results', label: 'نتائج تقييم الجاهزية', icon: BarChart3, path: '/dashboard/charity-assessment/results' },
 { id: 'project-management', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management/list' },
 { id: 'donors', label: 'قاعدة الجهات المانحة', icon: HeartHandshake, path: '/dashboard/donors' },
 { id: 'organization-donors', label: 'الجهات المانحة', icon: Building2, path: '/dashboard/organization-donors' },
 { id: 'manage-org', label: 'إدارة تفعيل الجهات', icon: Users, path: '/dashboard/manage/org' },
 { id: 'manage-subscriptions', label: 'إدارة الاشتراكات', icon: CreditCard, path: '/dashboard/manage/subscriptions' },
 { id: 'manage-coupons', label: 'إدارة الكوبونات', icon: Ticket, path: '/dashboard/manage/coupons' },
 { id: 'pricing', label: 'الباقات والأسعار', icon: Package, path: '/dashboard/pricing' },
 { id: 'incubator-overview', label: 'نظرة شاملة للحاضنة', icon: BarChart3, path: '/dashboard/incubator-overview' },
 { id: 'charity-analytics', label: 'تحليلات الجمعيات', icon: Building2, path: '/dashboard/charity-analytics' },
 { id: 'project-analytics', label: 'تحليلات المشاريع', icon: FolderKanban, path: '/dashboard/project-analytics' },
 { id: 'funding-analytics', label: 'تحليلات التمويل والمانحين', icon: DollarSign, path: '/dashboard/funding-analytics' },
 { id: 'operations-analytics', label: 'تحليلات التشغيل والأداء', icon: Activity, path: '/dashboard/operations-analytics' },
 { id: 'executive', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard, path: '/dashboard' },
 { id: 'ai-analysis', label: 'المحلل التنفيذي الذكي', icon: Sparkles, path: '/dashboard/ai-analysis' },
 { id: 'ai-innovation', label: 'استوديو المشاريع الذكي', icon: Brain, path: '/dashboard/ai-innovation' },
 { id: 'analysis-history', label: 'التحليلات السابقة', icon: History, path: '/dashboard/analysis-history' },
 { id: 'project-journey', label: 'رحلة المشروع', icon: Briefcase, path: '/dashboard/project-journey' },
 { id: 'notifications', label: 'الإشعارات والتنبيهات', icon: Bell, path: '/dashboard/notifications' },
 { id: 'data-sources', label: 'مصادر البيانات', icon: Database, path: '/dashboard/data-sources' },
 { id: 'compliance-risk', label: 'الامتثال والمخاطر', icon: ShieldAlert, path: '/dashboard/compliance-risk' },
 { id: 'sales', label: 'لوحة المبيعات', icon: TrendingUp, path: '/dashboard/sales' },
 { id: 'customers', label: 'لوحة العملاء', icon: Users, path: '/dashboard/customers' },
 { id: 'profitability', label: 'لوحة الربحية', icon: DollarSign, path: '/dashboard/profitability' },
 { id: 'inventory', label: 'لوحة المخزون', icon: Warehouse, path: '/dashboard/inventory' },
 { id: 'operations', label: 'لوحة التشغيل', icon: Cog, path: '/dashboard/operations' },
 { id: 'hr', label: 'لوحة الموارد البشرية', icon: UserCog, path: '/dashboard/hr' },
 { id: 'marketing', label: 'لوحة التسويق', icon: TrendingUp, path: '/dashboard/marketing' },
 { id: 'recommendations', label: 'لوحة التوصيات', icon: Lightbulb, path: '/dashboard/recommendations' },
 { id: 'opportunities', label: 'لوحة الفرص', icon: FileCheck, path: '/dashboard/opportunities' },
 { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/dashboard/settings' },
 ];

 const navItems: { id: string; label: string; icon: typeof UserPlus; path: string; linkTo?: string }[] = roleSlug === 'project-managers'
 ? [
 { id: 'project-management-dashboard', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management' },
 { id: 'impact-map', label: 'خارطة الأثر', icon: MapPin, path: '/dashboard/impact-map' },
 { id: 'collaboration', label: 'التعاون والتواصل', icon: MessageSquare, path: '/dashboard/collaboration' },
 ...commonNavItems.filter((item) => item.id !== 'project-management'),
 ]
 : [
 { id: 'onboarding', label: 'معلوماتي', icon: UserPlus, path: '/dashboard/onboarding/info', linkTo: '/dashboard/onboarding/info?tab=info' },
 { id: 'collaboration', label: 'التعاون والتواصل', icon: MessageSquare, path: '/dashboard/collaboration' },
 ...commonNavItems,
 ];

 const roleAllowedItems = filterMenuItemsByRole(navItems, roleSlug);
 const visibleItems = roleAllowedItems.filter((item) => !item.restricted || canSeeRestricted);

 // Close on Escape key
 useEffect(() => {
 const handleEscape = (e: KeyboardEvent) => {
 if (e.key === 'Escape' && isOpen) {
 onClose();
 }
 };
 document.addEventListener('keydown', handleEscape);
 return () => document.removeEventListener('keydown', handleEscape);
 }, [isOpen, onClose]);

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isOpen]);

 if (!isOpen) return null;

 return (
 <>
 {/* Overlay */}
 <div
 className="fixed inset-0 bg-[var(--text-primary)]/[0.5] z-40 lg:hidden"
 onClick={onClose}
 aria-hidden="true"
 />

 {/* Drawer */}
 <div
 className="fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-[var(--card)] border-l border-[var(--border)] z-50 flex flex-col lg:hidden shadow-2xl"
 role="dialog"
 aria-modal="true"
 aria-label="التنقل"
 >
 {/* Header */}
 <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <img src="/logo.png" alt="منصة رشد" className="w-10 h-10 object-contain" />
 <div>
 <h1 className="text-[var(--foreground)] text-base font-bold">منصة رشد</h1>
 <p className="text-[var(--text-muted)] text-xs mt-0.5">Rushd Virtual Incubator</p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="p-[var(--spacing-small-gap)].5 rounded-[var(--radius-button)] hover:bg-[var(--hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--foreground)]"
 aria-label="إغلاق"
 >
 <X className="w-6 h-6" />
 </button>
 </div>

 {/* Navigation */}
 <nav className="flex-1 p-[var(--spacing-card-padding)] overflow-y-auto">
 <ul className="space-y-[var(--spacing-small-gap)]">
 {visibleItems.map((item) => {
 const Icon = item.icon;
 const isActive = activeView === item.id;

 return (
 <li key={item.id}>
 <NavLink
 to={item.linkTo ?? item.path}
 onClick={onClose}
 className={cn(
 "w-full flex items-center gap-[var(--spacing-small-gap)] px-4 py-3.5 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)] text-right",
 isActive
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-[var(--shadow-md)]"
 : "text-[var(--foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
 )}
 >
 <span className="flex items-center justify-center w-6 h-6 flex-shrink-0">
 <Icon className="w-5 h-5" />
 </span>
 <span className="font-medium">{item.label}</span>
 </NavLink>
 </li>
 );
 })}
 </ul>
 </nav>

 {/* Footer */}
 <div className="p-4 border-t border-[var(--border)]">
 <p className="text-[var(--text-muted)] text-xs text-center">
 © 2026 منصة رشد
 </p>
 </div>
 </div>
 </>
 );
}
