import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Cog,
  UserCog,
  Package,
  FileCheck,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  className?: string;
}

export function Sidebar({ activeItem, onItemClick, className }: SidebarProps) {
  const navItems = [
    { id: 'executive', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard },
    { id: 'ai-analysis', label: 'المحلل التنفيذي الذكي', icon: Sparkles },
    { id: 'sales', label: 'لوحة المبيعات', icon: TrendingUp },
    { id: 'customers', label: 'لوحة العملاء', icon: Users },
    { id: 'operations', label: 'لوحة التشغيل', icon: Cog },
    { id: 'marketing', label: 'لوحة التسويق', icon: TrendingUp },
    { id: 'recommendations', label: 'لوحة التوصيات', icon: Lightbulb },
    { id: 'opportunities', label: 'لوحة الفرص', icon: FileCheck },
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
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
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
