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
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useEffect } from 'react';

interface MobileNavProps {
  isOpen: boolean;
  activeItem: string;
  onItemClick: (item: string) => void;
  onClose: () => void;
}

export function MobileNav({ isOpen, activeItem, onItemClick, onClose }: MobileNavProps) {
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

  const handleItemClick = (id: string) => {
    onItemClick(id);
    onClose();
  };

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
            <p className="text-muted-foreground text-sm mt-1">Rushd Platform</p>
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
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
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
      </div>
    </>
  );
}
