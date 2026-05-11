import { useState } from 'react';
import {
  Database,
  FileSpreadsheet,
  ShoppingCart,
  Users,
  Briefcase,
  Network,
  Plus,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Settings,
  Trash2,
  Download,
  Eye,
  Activity
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'excel' | 'erp' | 'crm' | 'pos' | 'hr' | 'api';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  health: 'excellent' | 'good' | 'fair' | 'poor';
  lastSync: string;
  syncFrequency: string;
  recordCount: number;
  dataSize: string;
}

export function DataSourcesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'excel' | 'erp' | 'crm' | 'pos' | 'hr' | 'api'>('all');

  const dataSources: DataSource[] = [
    {
      id: '1',
      name: 'Sales Data - Q1 2026',
      type: 'excel',
      status: 'connected',
      health: 'excellent',
      lastSync: '2026-05-11 10:30',
      syncFrequency: 'Manual',
      recordCount: 15420,
      dataSize: '2.4 MB'
    },
    {
      id: '2',
      name: 'SAP ERP System',
      type: 'erp',
      status: 'connected',
      health: 'good',
      lastSync: '2026-05-11 11:00',
      syncFrequency: 'Every 1 hour',
      recordCount: 254890,
      dataSize: '145 MB'
    },
    {
      id: '3',
      name: 'Salesforce CRM',
      type: 'crm',
      status: 'syncing',
      health: 'excellent',
      lastSync: '2026-05-11 11:15',
      syncFrequency: 'Every 30 min',
      recordCount: 48320,
      dataSize: '18.7 MB'
    },
    {
      id: '4',
      name: 'POS - Main Store',
      type: 'pos',
      status: 'connected',
      health: 'excellent',
      lastSync: '2026-05-11 11:20',
      syncFrequency: 'Real-time',
      recordCount: 892340,
      dataSize: '234 MB'
    },
    {
      id: '5',
      name: 'Workday HR',
      type: 'hr',
      status: 'error',
      health: 'poor',
      lastSync: '2026-05-10 15:45',
      syncFrequency: 'Every 12 hours',
      recordCount: 1250,
      dataSize: '890 KB'
    },
    {
      id: '6',
      name: 'Payment Gateway API',
      type: 'api',
      status: 'connected',
      health: 'good',
      lastSync: '2026-05-11 11:18',
      syncFrequency: 'Every 15 min',
      recordCount: 67890,
      dataSize: '12.3 MB'
    }
  ];

  const getSourceIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'excel':
        return FileSpreadsheet;
      case 'erp':
        return Database;
      case 'crm':
        return Users;
      case 'pos':
        return ShoppingCart;
      case 'hr':
        return Briefcase;
      case 'api':
        return Network;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-gray-400';
      case 'error':
        return 'text-red-500';
      case 'syncing':
        return 'text-blue-500';
    }
  };

  const getHealthColor = (health: DataSource['health']) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
    }
  };

  const getHealthLabel = (health: DataSource['health']) => {
    switch (health) {
      case 'excellent':
        return 'ممتاز';
      case 'good':
        return 'جيد';
      case 'fair':
        return 'متوسط';
      case 'poor':
        return 'ضعيف';
    }
  };

  const getStatusLabel = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'متصل';
      case 'disconnected':
        return 'غير متصل';
      case 'error':
        return 'خطأ';
      case 'syncing':
        return 'جاري المزامنة';
    }
  };

  const getTypeLabel = (type: DataSource['type']) => {
    switch (type) {
      case 'excel':
        return 'Excel';
      case 'erp':
        return 'ERP';
      case 'crm':
        return 'CRM';
      case 'pos':
        return 'نقاط البيع';
      case 'hr':
        return 'الموارد البشرية';
      case 'api':
        return 'API';
    }
  };

  const filteredSources = activeTab === 'all'
    ? dataSources
    : dataSources.filter(source => source.type === activeTab);

  const stats = {
    total: dataSources.length,
    connected: dataSources.filter(s => s.status === 'connected').length,
    syncing: dataSources.filter(s => s.status === 'syncing').length,
    errors: dataSources.filter(s => s.status === 'error').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">مصادر البيانات</h1>
          <p className="text-muted-foreground mt-1">إدارة ومراقبة جميع مصادر البيانات المتصلة</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة مصدر جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">إجمالي المصادر</p>
              <p className="text-2xl mt-1">{stats.total}</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">متصل</p>
              <p className="text-2xl mt-1 text-green-500">{stats.connected}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">جاري المزامنة</p>
              <p className="text-2xl mt-1 text-blue-500">{stats.syncing}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">أخطاء</p>
              <p className="text-2xl mt-1 text-red-500">{stats.errors}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: 'all', label: 'الكل', icon: Database },
          { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
          { id: 'erp', label: 'ERP', icon: Database },
          { id: 'crm', label: 'CRM', icon: Users },
          { id: 'pos', label: 'نقاط البيع', icon: ShoppingCart },
          { id: 'hr', label: 'الموارد البشرية', icon: Briefcase },
          { id: 'api', label: 'APIs', icon: Network }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSources.map((source) => {
          const Icon = getSourceIcon(source.type);
          const StatusIcon = source.status === 'connected' ? CheckCircle2 :
                            source.status === 'error' ? XCircle :
                            source.status === 'syncing' ? RefreshCw : Clock;

          return (
            <div
              key={source.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedSource(source)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{getTypeLabel(source.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Status and Health */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusIcon className={`w-4 h-4 ${getStatusColor(source.status)} ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                    <span className="text-sm text-muted-foreground">الحالة</span>
                  </div>
                  <p className="text-sm font-medium">{getStatusLabel(source.status)}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getHealthColor(source.health)}`} />
                    <span className="text-sm text-muted-foreground">الصحة</span>
                  </div>
                  <p className="text-sm font-medium">{getHealthLabel(source.health)}</p>
                </div>
              </div>

              {/* Sync Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">آخر مزامنة</span>
                  <span className="font-medium">{source.lastSync}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تكرار المزامنة</span>
                  <span className="font-medium">{source.syncFrequency}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">عدد السجلات</p>
                  <p className="text-sm font-medium">{source.recordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">حجم البيانات</p>
                  <p className="text-sm font-medium">{source.dataSize}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  مزامنة الآن
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Source Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl">إضافة مصدر بيانات جديد</h2>
                <p className="text-muted-foreground mt-1">اختر نوع المصدر وقم بإعداد الاتصال</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Source Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">نوع المصدر</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { type: 'excel', label: 'Excel', icon: FileSpreadsheet },
                      { type: 'erp', label: 'نظام ERP', icon: Database },
                      { type: 'crm', label: 'نظام CRM', icon: Users },
                      { type: 'pos', label: 'نقاط البيع', icon: ShoppingCart },
                      { type: 'hr', label: 'الموارد البشرية', icon: Briefcase },
                      { type: 'api', label: 'External API', icon: Network }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.type}
                          className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                        >
                          <Icon className="w-8 h-8 text-blue-500" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Excel Upload Section */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">رفع ملف Excel</p>
                  <p className="text-sm text-muted-foreground mb-3">اسحب وأفلت الملف هنا أو انقر للاختيار</p>
                  <p className="text-xs text-muted-foreground">الصيغ المدعومة: .xlsx, .xls, .csv (حتى 50 MB)</p>
                </div>

                {/* API Connection Form */}
                <div className="space-y-4">
                  <h3 className="font-medium">إعدادات الاتصال بـ API</h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المصدر</label>
                    <input
                      type="text"
                      placeholder="مثال: نظام المبيعات الرئيسي"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">API Endpoint</label>
                    <input
                      type="url"
                      placeholder="https://api.example.com/v1"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">تكرار المزامنة</label>
                      <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Real-time</option>
                        <option>كل 15 دقيقة</option>
                        <option>كل 30 دقيقة</option>
                        <option>كل ساعة</option>
                        <option>كل 6 ساعات</option>
                        <option>كل 12 ساعة</option>
                        <option>يومياً</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">نوع المصادقة</label>
                      <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>API Key</option>
                        <option>OAuth 2.0</option>
                        <option>Basic Auth</option>
                        <option>Bearer Token</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm text-blue-600 dark:text-blue-400">سيتم اختبار الاتصال تلقائياً بعد الحفظ</p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-border flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  حفظ واختبار الاتصال
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Source Details Modal */}
      {selectedSource && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedSource(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = getSourceIcon(selectedSource.type);
                    return <Icon className="w-8 h-8 text-blue-500" />;
                  })()}
                  <div>
                    <h2 className="text-2xl">{selectedSource.name}</h2>
                    <p className="text-muted-foreground">{getTypeLabel(selectedSource.type)}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                    <p className="font-medium">{getStatusLabel(selectedSource.status)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">الصحة</p>
                    <p className="font-medium">{getHealthLabel(selectedSource.health)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">السجلات</p>
                    <p className="font-medium">{selectedSource.recordCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">الحجم</p>
                    <p className="font-medium">{selectedSource.dataSize}</p>
                  </div>
                </div>

                {/* Sync History */}
                <div>
                  <h3 className="font-medium mb-3">سجل المزامنة</h3>
                  <div className="space-y-2">
                    {[
                      { time: '2026-05-11 11:20', status: 'success', records: 1250, duration: '2.3s' },
                      { time: '2026-05-11 10:20', status: 'success', records: 1245, duration: '2.1s' },
                      { time: '2026-05-11 09:20', status: 'success', records: 1238, duration: '2.4s' },
                      { time: '2026-05-11 08:20', status: 'warning', records: 1230, duration: '3.8s' }
                    ].map((sync, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {sync.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="text-sm">{sync.time}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{sync.records} سجل</span>
                          <span>{sync.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connection Details */}
                <div>
                  <h3 className="font-medium mb-3">تفاصيل الاتصال</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">تكرار المزامنة</span>
                      <span className="font-medium">{selectedSource.syncFrequency}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">آخر مزامنة</span>
                      <span className="font-medium">{selectedSource.lastSync}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">المزامنة التالية</span>
                      <span className="font-medium">2026-05-11 12:20</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-border flex gap-3 justify-end">
                <button
                  onClick={() => setSelectedSource(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  إغلاق
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  تعديل الإعدادات
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
