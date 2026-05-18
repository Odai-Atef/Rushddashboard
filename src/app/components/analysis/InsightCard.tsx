import { AlertTriangle, Target, Sparkles, Info, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getPriorityColor, getInsightTypeLabel } from '../../utils/analysis';
import type { AnalysisOutput } from '../../types/analysis';

interface InsightCardProps {
  insight: AnalysisOutput;
  index?: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'recommendation':
        return <Target className="w-5 h-5" />;
      case 'summary':
        return <Sparkles className="w-5 h-5" />;
      case 'insight':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getIconColor = () => {
    switch (insight.type) {
      case 'alert':
        return 'text-orange-600';
      case 'recommendation':
        return 'text-green-600';
      case 'summary':
        return 'text-purple-600';
      case 'insight':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-r-4 transition-colors',
        getPriorityColor(insight.priority)
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={getIconColor()}>{getIcon()}</span>
          <h4 className="font-medium">{insight.titleAr || insight.title}</h4>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-background/50">
          {getInsightTypeLabel(insight.type)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {insight.descriptionAr || insight.description}
      </p>
      {(insight.impact || insight.confidenceScore) && (
        <div className="flex items-center gap-2 text-sm">
          {insight.impact && (
            <span className="text-green-600 font-medium">{insight.impact}</span>
          )}
          {insight.impact && insight.confidenceScore && (
            <span className="text-muted-foreground">•</span>
          )}
          {insight.confidenceScore && (
            <span className="text-muted-foreground">
              ثقة: {insight.confidenceScore}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
