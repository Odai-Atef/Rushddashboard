/**
 * Icon Map Utility
 *
 * Maps string icon names returned by the backend to `lucide-react` components.
 * Used by the Analysis Library Modal to resolve dynamic `icon` fields.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Briefcase,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Database,
  DollarSign,
  FileCheck,
  FileDown,
  FileText,
  Filter,
  Flame,
  Heart,
  Lightbulb,
  Loader2,
  MapPin,
  MessageSquare,
  MoreVertical,
  Package,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  StopCircle,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Users,
  Warehouse,
  X,
  Zap,
  UserCog,
} from 'lucide-react';

/**
 * Record mapping API icon name strings to their `lucide-react` component.
 */
export const iconMap: Record<string, LucideIcon> = {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Briefcase,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Database,
  DollarSign,
  FileCheck,
  FileDown,
  FileText,
  Filter,
  Flame,
  Heart,
  Lightbulb,
  Loader2,
  MapPin,
  MessageSquare,
  MoreVertical,
  Package,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  StopCircle,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Users,
  Warehouse,
  X,
  Zap,
  UserCog,
};

/**
 * Resolve an API icon name to a `LucideIcon` component.
 *
 * @param name - The icon name returned by the backend (e.g. `"Users"`).
 * @returns The matching `LucideIcon` component, or `BarChart3` as a fallback.
 */
export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return BarChart3;
  const icon = iconMap[name];
  return icon ?? BarChart3;
}
