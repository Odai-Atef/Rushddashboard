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
  MessageSquare
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { filterMenuItemsByRole } from '@/config/menuAccess';
import { useEffect } from 'react';

interface MobileNavProps {
  isOpen: boolean;
  activeView: string;
  onClose: () => void;
}

export function MobileNav({ isOpen, activeView, onClose }: MobileNavProps) {
  const { user } = useAuth();
  const roleSlug = user?.roleSlug ?? null;

  const navItems = [
    { id: 'executive', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'ai-analysis', label: 'المحلل التنفيذي الذكي', icon: Sparkles, path: '/dashboard/ai-analysis' },
    { id: 'ai-innovation', label: 'استوديو المشاريع الذكي', icon: Brain, path: '/dashboard/ai-innovation' },
    { id: 'analysis-history', label: 'التحليلات السابقة', icon: History, path: '/dashboard/analysis-history' },
    { id: 'project-journey', label: 'رحلة المشروع', icon: Briefcase, path: '/dashboard/project-journey' },
    { id: 'project-management', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management' },
    { id: 'collaboration', label: 'التعاون والتواصل', icon: MessageSquare, path: '/dashboard/collaboration' },
    { id: 'donors', label: 'قاعدة الجهات المانحة', icon: Database, path: '/dashboard/donors' },
    { id: 'charity-assessment', label: 'تقييم الجاهزية', icon: ClipboardCheck, path: '/dashboard/charity-assessment' },
    { id: 'onboarding', label: 'معلوماتي', icon: UserPlus, path: '/dashboard/onboarding/registration' },
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

  const visibleItems = filterMenuItemsByRole(navItems, roleSlug);

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
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-sidebar border-l border-sidebar-border z-50 flex flex-col lg:hidden">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h1 className="text-sidebar-foreground text-xl">منصة رشد</h1>
            <p className="text-muted-foreground text-sm mt-1">منصة رشد</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-muted-foreground text-xs text-center">
            © 2026 منصة رشد
          </p>
        </div>
      </div>
    </>
  );
}
