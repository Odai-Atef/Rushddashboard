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
  Sparkles,
  DollarSign,
  Warehouse,
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeView: string;
  className?: string;
}

export function Sidebar({ activeView, className }: SidebarProps) {
  const navItems = [
    { id: 'executive', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'ai-analysis', label: 'المحلل التنفيذي الذكي', icon: Sparkles, path: '/dashboard/ai-analysis' },
    { id: 'notifications', label: 'الإشعارات والتنبيهات', icon: Bell, path: '/dashboard/notifications' },
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

  return (
    <aside className={cn("bg-sidebar border-l border-sidebar-border flex flex-col", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-sidebar-foreground text-2xl">منصة رشد</h1>
        <p className="text-muted-foreground text-sm mt-1">Rushd Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
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
    </aside>
  );
}
