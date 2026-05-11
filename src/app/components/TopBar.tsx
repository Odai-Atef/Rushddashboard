import { Search, Bell, Moon, Sun, Menu, Globe } from 'lucide-react';
import { cn } from '../utils/cn';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';

interface TopBarProps {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  onMenuClick: () => void;
  className?: string;
}

export function TopBar({
  theme,
  language,
  onThemeToggle,
  onLanguageToggle,
  onMenuClick,
  className
}: TopBarProps) {
  return (
    <header className={cn("bg-card border-b border-border flex items-center justify-between px-4 h-16", className)}>
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        aria-label="القائمة"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث..."
            className="w-full bg-input-background border border-border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={onLanguageToggle}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
        >
          <Globe className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="تبديل الوضع"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-popover border border-border rounded-lg shadow-lg p-2 w-80 z-50"
              sideOffset={5}
              align="end"
            >
              <div className="p-3 border-b border-border">
                <h3 className="font-medium">الإشعارات</h3>
              </div>
              <div className="py-2">
                <div className="px-3 py-2 hover:bg-accent rounded text-sm">
                  <p className="font-medium">توصية جديدة</p>
                  <p className="text-muted-foreground text-xs mt-1">تحسين الربحية بنسبة 12%</p>
                </div>
                <div className="px-3 py-2 hover:bg-accent rounded text-sm">
                  <p className="font-medium">تنبيه المخزون</p>
                  <p className="text-muted-foreground text-xs mt-1">مستوى المخزون منخفض</p>
                </div>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 p-1 hover:bg-accent rounded-lg transition-colors">
              <Avatar.Root className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Avatar.Fallback className="text-sm">أح</Avatar.Fallback>
              </Avatar.Root>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-popover border border-border rounded-lg shadow-lg p-2 w-56 z-50"
              sideOffset={5}
              align="end"
            >
              <div className="px-3 py-2 border-b border-border mb-2">
                <p className="font-medium">أحمد محمد</p>
                <p className="text-muted-foreground text-sm">ahmed@rushd.ai</p>
              </div>
              <DropdownMenu.Item className="px-3 py-2 hover:bg-accent rounded cursor-pointer outline-none">
                الملف الشخصي
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 hover:bg-accent rounded cursor-pointer outline-none">
                الإعدادات
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-2" />
              <DropdownMenu.Item className="px-3 py-2 hover:bg-accent rounded cursor-pointer outline-none text-destructive">
                تسجيل الخروج
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
