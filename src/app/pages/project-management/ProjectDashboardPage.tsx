import { useNavigate } from 'react-router';
import {
  Briefcase,
  Plus,
  List,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  Download,
  User,
  Calendar,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { projects } from './project-data';

export function ProjectDashboardPage() {
  const navigate = useNavigate();

  const stats = {
    total: projects.length,
    active: projects.filter((p) => ['execution', 'funded'].includes(p.status)).length,
    draft: projects.filter((p) => p.status === 'draft').length,
    awaitingApproval: projects.filter((p) => p.status.includes('approval')).length,
    approved: projects.filter((p) => p.status === 'approved').length,
    funded: projects.filter((p) => p.status === 'funded').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  };

  const statusDistribution = [
    { name: 'مسودة', value: projects.filter((p) => p.status === 'draft').length, color: '#6b7280' },
    { name: 'قيد المراجعة', value: projects.filter((p) => p.status.includes('review') || p.status.includes('approval')).length, color: '#3b82f6' },
    { name: 'معتمد', value: projects.filter((p) => p.status === 'approved').length, color: '#10b981' },
    { name: 'ممول', value: projects.filter((p) => p.status === 'funded').length, color: '#22c55e' },
    { name: 'قيد التنفيذ', value: projects.filter((p) => p.status === 'execution').length, color: '#06b6d4' },
    { name: 'مكتمل', value: projects.filter((p) => p.status === 'completed').length, color: '#8b5cf6' },
  ];

  const budgetTrend = [
    { month: 'يناير', budget: 450000 },
    { month: 'فبراير', budget: 680000 },
    { month: 'مارس', budget: 820000 },
    { month: 'أبريل', budget: 950000 },
    { month: 'مايو', budget: 1150000 },
    { month: 'يونيو', budget: 1400000 },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة المشاريع</h1>
            <p className="text-gray-600">نظرة شاملة على جميع المشاريع والأنشطة</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/project-management/create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            مشروع جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">إجمالي المشاريع</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
            <Activity className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-sm text-gray-600 mt-1">المشاريع النشطة</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
            <p className="text-sm text-gray-600 mt-1">مسودات</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-yellow-200 shadow-sm">
            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-3xl font-bold text-yellow-600">{stats.awaitingApproval}</p>
            <p className="text-sm text-gray-600 mt-1">بانتظار الموافقة</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-600 mt-1">معتمد</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-emerald-200 shadow-sm">
            <DollarSign className="w-8 h-8 text-emerald-600 mb-2" />
            <p className="text-3xl font-bold text-emerald-600">{stats.funded}</p>
            <p className="text-sm text-gray-600 mt-1">ممول</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm">
            <Target className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
            <p className="text-sm text-gray-600 mt-1">مكتمل</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">توزيع حالات المشاريع</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">تطور الميزانيات</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">النشاط الأخير</h3>
              <button
                onClick={() => navigate('/dashboard/project-management/activity/1')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                عرض الكل
              </button>
            </div>
            <div className="space-y-4">
              {[
                { user: 'أحمد محمد', action: 'حدّث حالة المشروع', project: 'برنامج الأسر المنتجة', time: 'منذ ساعتين' },
                { user: 'فاطمة أحمد', action: 'أضاف وثيقة', project: 'مشروع كفالة الأيتام', time: 'منذ 4 ساعات' },
                { user: 'خالد سعيد', action: 'طلب موافقة', project: 'برنامج التدريب المهني', time: 'منذ 6 ساعات' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium text-blue-600">{activity.project}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">المواعيد القادمة</h3>
            </div>
            <div className="space-y-4">
              {[
                { project: 'برنامج الأسر المنتجة', deadline: '2026-06-15', priority: 'high', daysLeft: 8 },
                { project: 'مشروع كفالة الأيتام', deadline: '2026-06-20', priority: 'medium', daysLeft: 13 },
                { project: 'برنامج التدريب المهني', deadline: '2026-06-25', priority: 'low', daysLeft: 18 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{item.project}</p>
                      <p className="text-xs text-gray-500">{item.deadline}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : item.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.daysLeft} يوم
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/dashboard/project-management/list')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <List className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">عرض جميع المشاريع</p>
            </button>
            <button
              onClick={() => navigate('/dashboard/project-management/create')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">إنشاء مشروع جديد</p>
            </button>
            <button
              onClick={() => navigate('/dashboard/project-management/reporting')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">التقارير الإدارية</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
              <Download className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">تصدير البيانات</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
