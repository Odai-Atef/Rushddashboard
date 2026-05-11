import { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Bell,
  Sparkles,
  AlertCircle,
  Info,
  X,
  ExternalLink,
  Calendar,
  Users,
  Package,
  Activity
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Alert {
  id: string;
  category: 'revenue' | 'risk' | 'opportunity' | 'ai-recommendation' | 'operational';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  aiGenerated: boolean;
  timestamp: string;
  status: 'unread' | 'read' | 'resolved';
  impact?: string;
  recommendation?: string;
  affectedArea?: string;
  metrics?: { label: string; value: string }[];
}

export function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const alerts: Alert[] = [
    {
      id: '1',
      category: 'risk',
      priority: 'critical',
      title: 'انخفاض حاد في الإيرادات - فرع الرياض',
      description: 'انخفضت الإيرادات بنسبة 23% في آخر 48 ساعة مقارنة بالمتوسط الأسبوعي. يتطلب تدخلاً فورياً.',
      aiGenerated: true,
      timestamp: 'منذ 15 دقيقة',
      status: 'unread',
      impact: 'عالي - خسارة محتملة 450,000 ر.س شهرياً',
      recommendation: 'مراجعة فورية لاستراتيجية التسعير وحملات التسويق في فرع الرياض',
      affectedArea: 'فرع الرياض - قسم المبيعات',
      metrics: [
        { label: 'الإيرادات الحالية', value: '1.2M ر.س' },
        { label: 'الإيرادات المتوقعة', value: '1.56M ر.س' },
        { label: 'نسبة الانخفاض', value: '23%' }
      ]
    },
    {
      id: '2',
      category: 'operational',
      priority: 'critical',
      title: 'نفاد مخزون منتج رئيسي',
      description: 'المنتج "أ" سينفد خلال 2-3 أيام. هناك طلبات معلقة بقيمة 280,000 ر.س.',
      aiGenerated: false,
      timestamp: 'منذ 30 دقيقة',
      status: 'unread',
      impact: 'متوسط - تأخير في تلبية الطلبات',
      affectedArea: 'سلسلة الإمداد - المستودع الرئيسي',
      metrics: [
        { label: 'المخزون المتبقي', value: '45 وحدة' },
        { label: 'الطلبات المعلقة', value: '230 طلب' },
        { label: 'الوقت المتبقي', value: '2-3 أيام' }
      ]
    },
    {
      id: '3',
      category: 'opportunity',
      priority: 'high',
      title: 'فرصة نمو في قطاع الخدمات المالية',
      description: 'المحلل الذكي اكتشف زيادة 45% في الطلب على الخدمات الاستشارية المتقدمة. فرصة للتوسع.',
      aiGenerated: true,
      timestamp: 'منذ ساعة',
      status: 'unread',
      impact: 'مرتفع - إيرادات إضافية محتملة 1.8M ر.س',
      recommendation: 'زيادة فريق الاستشارات بـ 3 أعضاء وتكثيف الحملات التسويقية',
      affectedArea: 'قسم الخدمات الاستشارية',
      metrics: [
        { label: 'نمو الطلب', value: '+45%' },
        { label: 'الإيرادات المحتملة', value: '1.8M ر.س' },
        { label: 'معدل التحويل', value: '68%' }
      ]
    },
    {
      id: '4',
      category: 'ai-recommendation',
      priority: 'high',
      title: 'تحسين استراتيجية التسعير',
      description: 'بناءً على تحليل 6 أشهر، يمكن زيادة الأسعار بنسبة 8% دون التأثير على معدل التحويل.',
      aiGenerated: true,
      timestamp: 'منذ ساعتين',
      status: 'read',
      impact: 'مرتفع - زيادة محتملة في الأرباح 12%',
      recommendation: 'تطبيق تدريجي للزيادة على مدى 3 أشهر بدءاً من الخدمات الأكثر طلباً',
      affectedArea: 'جميع الأقسام',
      metrics: [
        { label: 'الزيادة المقترحة', value: '8%' },
        { label: 'زيادة الأرباح', value: '+12%' },
        { label: 'التأثير على التحويل', value: 'لا يوجد' }
      ]
    },
    {
      id: '5',
      category: 'revenue',
      priority: 'high',
      title: 'تجاوز الهدف الشهري للإيرادات',
      description: 'تم تحقيق 118% من هدف الإيرادات الشهري مع بقاء 8 أيام على نهاية الشهر.',
      aiGenerated: false,
      timestamp: 'منذ 3 ساعات',
      status: 'read',
      impact: 'إيجابي - أداء استثنائي',
      affectedArea: 'جميع الفروع',
      metrics: [
        { label: 'الهدف الشهري', value: '8.5M ر.س' },
        { label: 'المحقق حتى الآن', value: '10.03M ر.س' },
        { label: 'نسبة الإنجاز', value: '118%' }
      ]
    },
    {
      id: '6',
      category: 'risk',
      priority: 'medium',
      title: 'ارتفاع معدل شكاوى العملاء',
      description: 'ارتفع معدل الشكاوى بنسبة 15% في الأسبوع الماضي، معظمها يتعلق بأوقات التسليم.',
      aiGenerated: true,
      timestamp: 'منذ 4 ساعات',
      status: 'read',
      impact: 'متوسط - خطر على رضا العملاء',
      recommendation: 'مراجعة عملية التوصيل والتنسيق مع شركات الشحن',
      affectedArea: 'خدمة العملاء - قسم التوصيل',
      metrics: [
        { label: 'عدد الشكاوى', value: '89 شكوى' },
        { label: 'معدل الارتفاع', value: '+15%' },
        { label: 'معدل الحل', value: '72%' }
      ]
    },
    {
      id: '7',
      category: 'operational',
      priority: 'medium',
      title: 'تحديث نظام إدارة المخزون',
      description: 'يوصى بتحديث نظام إدارة المخزون لتحسين دقة التتبع والتنبؤات.',
      aiGenerated: false,
      timestamp: 'منذ 5 ساعات',
      status: 'resolved',
      impact: 'متوسط - تحسين الكفاءة',
      affectedArea: 'قسم تقنية المعلومات'
    },
    {
      id: '8',
      category: 'ai-recommendation',
      priority: 'medium',
      title: 'توسيع فريق خدمة العملاء',
      description: 'بناءً على تحليل أوقات الاستجابة، يوصى بإضافة 2 موظفين لخدمة العملاء.',
      aiGenerated: true,
      timestamp: 'منذ 6 ساعات',
      status: 'read',
      impact: 'متوسط - تحسين تجربة العملاء',
      recommendation: 'توظيف موظفين إضافيين خلال الشهر القادم',
      affectedArea: 'قسم خدمة العملاء',
      metrics: [
        { label: 'متوسط وقت الاستجابة', value: '8.5 دقيقة' },
        { label: 'الوقت المستهدف', value: '5 دقائق' },
        { label: 'معدل الرضا', value: '78%' }
      ]
    },
    {
      id: '9',
      category: 'opportunity',
      priority: 'low',
      title: 'موسم الذروة القادم',
      description: 'التحليل التنبؤي يتوقع زيادة 30% في الطلب خلال الشهرين القادمين.',
      aiGenerated: true,
      timestamp: 'منذ 8 ساعات',
      status: 'read',
      impact: 'متوسط - فرصة للنمو',
      recommendation: 'التحضير مبكراً بزيادة المخزون وتعزيز فريق الدعم',
      affectedArea: 'جميع الأقسام'
    },
    {
      id: '10',
      category: 'revenue',
      priority: 'low',
      title: 'استقرار في معدلات التحويل',
      description: 'معدلات التحويل مستقرة عند 12.5% لمدة 3 أشهر متتالية.',
      aiGenerated: false,
      timestamp: 'منذ 12 ساعة',
      status: 'read',
      impact: 'منخفض - أداء مستقر',
      affectedArea: 'قسم المبيعات'
    }
  ];

  const categories = [
    { id: 'all', label: 'الكل', icon: Bell, count: alerts.filter(a => a.status !== 'resolved').length },
    { id: 'revenue', label: 'الإيرادات', icon: DollarSign, count: alerts.filter(a => a.category === 'revenue' && a.status !== 'resolved').length },
    { id: 'risk', label: 'المخاطر', icon: AlertTriangle, count: alerts.filter(a => a.category === 'risk' && a.status !== 'resolved').length },
    { id: 'opportunity', label: 'الفرص', icon: Target, count: alerts.filter(a => a.category === 'opportunity' && a.status !== 'resolved').length },
    { id: 'ai-recommendation', label: 'توصيات AI', icon: Sparkles, count: alerts.filter(a => a.category === 'ai-recommendation' && a.status !== 'resolved').length },
    { id: 'operational', label: 'عمليات', icon: Activity, count: alerts.filter(a => a.category === 'operational' && a.status !== 'resolved').length }
  ];

  const filteredAlerts = alerts.filter(alert => {
    const categoryMatch = selectedCategory === 'all' || alert.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || alert.priority === selectedPriority;
    const statusMatch =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && alert.status !== 'resolved') ||
      (selectedStatus === 'unread' && alert.status === 'unread') ||
      (selectedStatus === 'resolved' && alert.status === 'resolved');

    return categoryMatch && priorityMatch && statusMatch;
  });

  const criticalAlerts = alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved');
  const unreadCount = alerts.filter(a => a.status === 'unread').length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'risk': return AlertTriangle;
      case 'opportunity': return Target;
      case 'ai-recommendation': return Sparkles;
      case 'operational': return Activity;
      default: return Bell;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'risk': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'opportunity': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'ai-recommendation': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'operational': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          label: 'حرج',
          bg: 'bg-red-500/10',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-500/20',
          icon: AlertCircle
        };
      case 'high':
        return {
          label: 'عالي',
          bg: 'bg-orange-500/10',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-500/20',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          label: 'متوسط',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-500/20',
          icon: Info
        };
      case 'low':
        return {
          label: 'منخفض',
          bg: 'bg-blue-500/10',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-500/20',
          icon: Info
        };
      default:
        return {
          label: 'عادي',
          bg: 'bg-gray-500/10',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-500/20',
          icon: Info
        };
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    // Mock action
    console.log('Mark as read:', alertId);
  };

  const handleMarkAsResolved = (alertId: string) => {
    // Mock action
    console.log('Mark as resolved:', alertId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإشعارات والتنبيهات</h1>
          <p className="text-muted-foreground">التنبيهات والتوصيات الذكية من المحلل التنفيذي</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <span className="text-sm font-medium text-primary">
                {unreadCount} إشعار جديد
              </span>
            </div>
          )}
          <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>وضع علامة مقروء للكل</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Panel */}
      {criticalAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border-2 border-red-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
                  تنبيهات حرجة تتطلب انتباهاً فورياً
                </h2>
                <span className="px-3 py-1 bg-red-500/20 text-red-600 rounded-full text-xs font-medium">
                  {criticalAlerts.length} تنبيه
                </span>
              </div>
              <div className="space-y-3">
                {criticalAlerts.map((alert) => {
                  const CategoryIcon = getCategoryIcon(alert.category);
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-card border border-red-500/20 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-red-500/10 rounded">
                          <CategoryIcon className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp}
                            </span>
                            {alert.aiGenerated && (
                              <span className="flex items-center gap-1 text-purple-600">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsResolved(alert.id);
                        }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs transition-colors"
                      >
                        معالجة
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium">تصفية الإشعارات</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">التصنيف</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'px-3 py-2 rounded-lg border-2 transition-colors text-sm flex items-center justify-between',
                      selectedCategory === category.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                    {category.count > 0 && (
                      <span className="px-2 py-0.5 bg-primary/20 rounded-full text-xs">
                        {category.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">الأولوية</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">جميع المستويات</option>
              <option value="critical">حرج</option>
              <option value="high">عالي</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">الحالة</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">الكل</option>
              <option value="active">نشط</option>
              <option value="unread">غير مقروء</option>
              <option value="resolved">محلول</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            جميع التنبيهات ({filteredAlerts.length})
          </h2>
          <div className="text-sm text-muted-foreground">
            مرتبة حسب الأحدث
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">لا توجد إشعارات</p>
            <p className="text-sm text-muted-foreground">
              لا توجد إشعارات تطابق الفلاتر المحددة
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const CategoryIcon = getCategoryIcon(alert.category);
              const priorityConfig = getPriorityConfig(alert.priority);
              const PriorityIcon = priorityConfig.icon;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'bg-card border rounded-lg p-5 transition-all cursor-pointer hover:shadow-md',
                    alert.status === 'unread' && 'border-l-4 border-l-primary',
                    alert.priority === 'critical' && 'border-2 border-red-500/30 bg-red-500/5',
                    alert.priority === 'high' && 'border-orange-500/20',
                    alert.status === 'resolved' && 'opacity-60'
                  )}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn('p-3 rounded-lg flex-shrink-0', getCategoryColor(alert.category))}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">{alert.title}</h3>
                            {alert.status === 'unread' && (
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {alert.description}
                          </p>
                        </div>

                        {/* Priority Badge */}
                        <div className={cn('px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium border', priorityConfig.bg, priorityConfig.text, priorityConfig.border)}>
                          <PriorityIcon className="w-3 h-3" />
                          <span>{priorityConfig.label}</span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                        {alert.aiGenerated && (
                          <span className="flex items-center gap-1 text-purple-600">
                            <Sparkles className="w-3 h-3" />
                            مُنشأ بواسطة AI
                          </span>
                        )}
                        {alert.affectedArea && (
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {alert.affectedArea}
                          </span>
                        )}
                      </div>

                      {/* Impact */}
                      {alert.impact && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded text-xs mb-3">
                          <Zap className="w-3 h-3 text-yellow-600" />
                          <span className="font-medium">التأثير:</span>
                          <span>{alert.impact}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlert(alert);
                          }}
                          className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>عرض التفاصيل</span>
                        </button>

                        {alert.status === 'unread' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(alert.id);
                            }}
                            className="px-3 py-1.5 border border-border hover:bg-accent rounded text-xs transition-colors"
                          >
                            وضع علامة مقروء
                          </button>
                        )}

                        {alert.status !== 'resolved' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsResolved(alert.id);
                            }}
                            className="px-3 py-1.5 border border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded text-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>تم الحل</span>
                          </button>
                        )}

                        {alert.status === 'resolved' && (
                          <span className="px-3 py-1.5 bg-green-500/10 text-green-600 rounded text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>محلول</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAlert(null)}>
          <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={cn('p-3 rounded-lg', getCategoryColor(selectedAlert.category))}>
                  {(() => {
                    const Icon = getCategoryIcon(selectedAlert.category);
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{selectedAlert.title}</h2>
                    {(() => {
                      const config = getPriorityConfig(selectedAlert.priority);
                      return (
                        <span className={cn('px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1', config.bg, config.text, config.border)}>
                          <config.icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedAlert.timestamp}
                    </span>
                    {selectedAlert.aiGenerated && (
                      <span className="flex items-center gap-1 text-purple-600">
                        <Sparkles className="w-4 h-4" />
                        مُنشأ بواسطة AI
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  الوصف
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedAlert.description}
                </p>
              </div>

              {/* Impact */}
              {selectedAlert.impact && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    التأثير المتوقع
                  </h3>
                  <p className="text-sm">{selectedAlert.impact}</p>
                </div>
              )}

              {/* Affected Area */}
              {selectedAlert.affectedArea && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    المنطقة المتأثرة
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedAlert.affectedArea}</p>
                </div>
              )}

              {/* Metrics */}
              {selectedAlert.metrics && selectedAlert.metrics.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    المؤشرات الرئيسية
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedAlert.metrics.map((metric, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                        <p className="text-lg font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendation */}
              {selectedAlert.recommendation && (
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    التوصية من المحلل الذكي
                  </h3>
                  <p className="text-sm leading-relaxed">{selectedAlert.recommendation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {selectedAlert.status !== 'resolved' ? (
                  <>
                    <button
                      onClick={() => {
                        handleMarkAsResolved(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>وضع علامة محلول</span>
                    </button>
                    {selectedAlert.status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(selectedAlert.id)}
                        className="px-6 py-2.5 border border-border hover:bg-accent rounded-lg transition-colors"
                      >
                        وضع علامة مقروء
                      </button>
                    )}
                  </>
                ) : (
                  <span className="px-6 py-2.5 bg-green-500/10 text-green-600 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>تم حل هذا التنبيه</span>
                  </span>
                )}
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-6 py-2.5 border border-border hover:bg-accent rounded-lg transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
