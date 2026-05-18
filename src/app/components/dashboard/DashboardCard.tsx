import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { LayoutDashboard, ChevronLeft } from 'lucide-react';
import type { Dashboard } from '../../types/dashboard';

interface DashboardCardProps {
  dashboard: Dashboard;
}

export function DashboardCard({ dashboard }: DashboardCardProps) {
  const Icon = dashboard.icon ? getIconComponent(dashboard.icon) : LayoutDashboard;

  return (
    <Link to={`/dashboard/${dashboard.id}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{dashboard.nameAr || dashboard.name}</CardTitle>
                {dashboard.description && (
                  <CardDescription className="text-sm line-clamp-2">
                    {dashboard.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {dashboard.isDefault && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                افتراضي
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  // Dynamically import icons based on name
  // For now, return LayoutDashboard as fallback
  // This can be extended to support more Lucide icons
  return LayoutDashboard;
}
