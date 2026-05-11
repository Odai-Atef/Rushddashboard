import { useState } from 'react';
import {
  User,
  Building,
  Globe,
  Palette,
  Brain,
  Cpu,
  Bell,
  Shield,
  Users,
  Key,
  Link,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '../utils/cn';

type SettingsSection =
  | 'profile'
  | 'company'
  | 'language'
  | 'theme'
  | 'ai'
  | 'llm'
  | 'notifications'
  | 'security'
  | 'permissions'
  | 'api'
  | 'services';

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const sections = [
    { id: 'profile' as SettingsSection, label: 'الملف الشخصي', icon: User },
    { id: 'company' as SettingsSection, label: 'إعدادات الشركة', icon: Building },
    { id: 'language' as SettingsSection, label: 'اللغة', icon: Globe },
    { id: 'theme' as SettingsSection, label: 'المظهر', icon: Palette },
    { id: 'ai' as SettingsSection, label: 'الذكاء الاصطناعي', icon: Brain },
    { id: 'llm' as SettingsSection, label: 'نماذج اللغة', icon: Cpu },
    { id: 'notifications' as SettingsSection, label: 'الإشعارات', icon: Bell },
    { id: 'security' as SettingsSection, label: 'الأمان', icon: Shield },
    { id: 'permissions' as SettingsSection, label: 'الصلاحيات', icon: Users },
    { id: 'api' as SettingsSection, label: 'مفاتيح API', icon: Key },
    { id: 'services' as SettingsSection, label: 'الخدمات المتصلة', icon: Link },
  ];

  const handleCopyApiKey = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-card border border-border rounded-lg p-4 flex-shrink-0 h-fit sticky top-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">الإعدادات</h2>
        </div>

        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-right text-sm',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 space-y-6">
        {/* Profile Settings */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">الملف الشخصي</h1>
              <p className="text-muted-foreground">إدارة معلومات حسابك الشخصي</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  أح
                </div>
                <div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    تغيير الصورة
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">JPG، PNG بحد أقصى 5MB</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الأول</label>
                    <input
                      type="text"
                      defaultValue="أحمد"
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الأخير</label>
                    <input
                      type="text"
                      defaultValue="محمد"
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    defaultValue="ahmed@rushd.ai"
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    defaultValue="+966 50 123 4567"
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">المسمى الوظيفي</label>
                  <input
                    type="text"
                    defaultValue="مدير تنفيذي"
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Settings */}
        {activeSection === 'company' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات الشركة</h1>
              <p className="text-muted-foreground">إدارة معلومات الشركة والتفاصيل التنظيمية</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الشركة</label>
                <input
                  type="text"
                  defaultValue="شركة الرشد للاستثمار"
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نوع النشاط</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>خدمات مالية</option>
                  <option>تجارة إلكترونية</option>
                  <option>صناعة</option>
                  <option>تقنية</option>
                  <option>استشارات</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">حجم الشركة</label>
                  <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>1-10 موظفين</option>
                    <option>11-50 موظف</option>
                    <option>51-200 موظف</option>
                    <option>201-1000 موظف</option>
                    <option>أكثر من 1000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المقر الرئيسي</label>
                  <input
                    type="text"
                    defaultValue="الرياض، المملكة العربية السعودية"
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">العملة الافتراضية</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>ريال سعودي (SAR)</option>
                  <option>دولار أمريكي (USD)</option>
                  <option>يورو (EUR)</option>
                  <option>جنيه إسترليني (GBP)</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Language Settings */}
        {activeSection === 'language' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات اللغة</h1>
              <p className="text-muted-foreground">اختر اللغة المفضلة لواجهة المستخدم</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">لغة الواجهة</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 border-2 border-primary bg-primary/5 rounded-lg text-right">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">العربية</p>
                          <p className="text-sm text-muted-foreground">Arabic</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                        </div>
                      </div>
                    </button>
                    <button className="p-4 border-2 border-border rounded-lg text-right hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">English</p>
                          <p className="text-sm text-muted-foreground">الإنجليزية</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-border"></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium mb-3">لغة التقارير</label>
                  <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>العربية</option>
                    <option>English</option>
                    <option>ثنائي اللغة</option>
                  </select>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium mb-3">تنسيق التاريخ</label>
                  <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>يوم/شهر/سنة</option>
                    <option>شهر/يوم/سنة</option>
                    <option>سنة-شهر-يوم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">المنطقة الزمنية</label>
                  <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>الرياض (GMT+3)</option>
                    <option>دبي (GMT+4)</option>
                    <option>القاهرة (GMT+2)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        {activeSection === 'theme' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات المظهر</h1>
              <p className="text-muted-foreground">تخصيص شكل ومظهر المنصة</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">وضع العرض</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                    <div className="w-full h-20 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded mb-3 border border-border"></div>
                    <p className="font-medium text-sm">فاتح</p>
                  </button>
                  <button className="p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-black rounded mb-3"></div>
                    <p className="font-medium text-sm">داكن</p>
                  </button>
                  <button className="p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="w-full h-20 rounded mb-3 overflow-hidden">
                      <div className="h-1/2 bg-gradient-to-br from-white to-gray-100"></div>
                      <div className="h-1/2 bg-gradient-to-br from-gray-900 to-black"></div>
                    </div>
                    <p className="font-medium text-sm">تلقائي</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">اللون الرئيسي</label>
                <div className="grid grid-cols-8 gap-2">
                  {[
                    'bg-blue-600',
                    'bg-purple-600',
                    'bg-pink-600',
                    'bg-red-600',
                    'bg-orange-600',
                    'bg-green-600',
                    'bg-teal-600',
                    'bg-cyan-600',
                  ].map((color, i) => (
                    <button
                      key={i}
                      className={cn(
                        'w-12 h-12 rounded-lg',
                        color,
                        i === 1 && 'ring-2 ring-offset-2 ring-primary'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">حواف مستديرة</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">تفعيل الرسوم المتحركة</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Configuration */}
        {activeSection === 'ai' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات الذكاء الاصطناعي</h1>
              <p className="text-muted-foreground">تخصيص سلوك المحلل التنفيذي الذكي</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">مستوى التفصيل في التحليل</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>مختصر (نقاط رئيسية فقط)</option>
                  <option selected>متوسط (متوازن)</option>
                  <option>مفصل (تحليل شامل)</option>
                  <option>مخصص</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نبرة الردود</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>احترافية رسمية</option>
                  <option selected>احترافية ودية</option>
                  <option>تقنية متخصصة</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">التوصيات التلقائية</p>
                    <p className="text-xs text-muted-foreground">إنشاء توصيات يومية بناءً على البيانات</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">التنبؤات الذكية</p>
                    <p className="text-xs text-muted-foreground">عرض توقعات الأداء المستقبلي</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">كشف الحالات الشاذة</p>
                    <p className="text-xs text-muted-foreground">تنبيه عند اكتشاف أنماط غير عادية</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">تكرار التحديثات</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>كل ساعة</option>
                  <option>كل 4 ساعات</option>
                  <option selected>يومياً</option>
                  <option>أسبوعياً</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LLM Settings */}
        {activeSection === 'llm' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات نماذج اللغة</h1>
              <p className="text-muted-foreground">تخصيص نماذج الذكاء الاصطناعي المستخدمة</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">النموذج الأساسي</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option selected>GPT-4 Turbo (الموصى به)</option>
                  <option>GPT-4</option>
                  <option>Claude 3 Opus</option>
                  <option>Claude 3 Sonnet</option>
                  <option>Gemini Pro 1.5</option>
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  يستخدم للتحليلات المعقدة والتوصيات الاستراتيجية
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نموذج الاستعلامات السريعة</label>
                <select className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>GPT-3.5 Turbo</option>
                  <option selected>Claude 3 Haiku</option>
                  <option>Gemini Pro</option>
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  يستخدم للأسئلة البسيطة والاستعلامات السريعة
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">درجة الحرارة (Temperature)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>دقيق (0)</span>
                  <span>متوازن (0.7)</span>
                  <span>إبداعي (1)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الحد الأقصى للرموز</label>
                <input
                  type="number"
                  defaultValue="4000"
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  أقصى طول للاستجابات (1000-8000 رمز)
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      تأثير على التكلفة
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      النماذج الأكثر تقدماً والإعدادات الأعلى قد تزيد من تكلفة الاستخدام
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات الإشعارات</h1>
              <p className="text-muted-foreground">إدارة تفضيلات الإشعارات والتنبيهات</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-4">إشعارات المنصة</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">توصيات جديدة</p>
                      <p className="text-xs text-muted-foreground">عند إنشاء توصية جديدة من المحلل الذكي</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">تنبيهات المخاطر</p>
                      <p className="text-xs text-muted-foreground">عند اكتشاف مخاطر أو حالات شاذة</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">تحديثات المؤشرات</p>
                      <p className="text-xs text-muted-foreground">عند تغير كبير في المؤشرات الرئيسية</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">تقارير دورية</p>
                      <p className="text-xs text-muted-foreground">ملخصات يومية وأسبوعية</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-4">إشعارات البريد الإلكتروني</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">ملخص يومي</p>
                      <p className="text-xs text-muted-foreground">تقرير يومي بأهم المستجدات</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">تقرير أسبوعي</p>
                      <p className="text-xs text-muted-foreground">ملخص أسبوعي شامل</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">تنبيهات الأمان</p>
                      <p className="text-xs text-muted-foreground">إشعارات تسجيل الدخول والنشاطات المهمة</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-4">إشعارات الجوال</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">تنبيهات فورية</p>
                      <p className="text-xs text-muted-foreground">للمسائل العاجلة والمهمة فقط</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">إعدادات الأمان</h1>
              <p className="text-muted-foreground">إدارة أمان حسابك وصلاحيات الوصول</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-4">تغيير كلمة المرور</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    تحديث كلمة المرور
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-4">المصادقة الثنائية</h3>
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">المصادقة الثنائية مفعلة</p>
                      <p className="text-xs text-muted-foreground">آخر استخدام: منذ ساعتين</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg text-sm transition-colors">
                    إلغاء التفعيل
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-4">الجلسات النشطة</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Chrome على Windows</p>
                      <p className="text-xs text-muted-foreground">الرياض، السعودية • نشط الآن</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">الجلسة الحالية</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Safari على iPhone</p>
                      <p className="text-xs text-muted-foreground">الرياض، السعودية • منذ 3 ساعات</p>
                    </div>
                    <button className="text-xs text-destructive hover:underline">إنهاء</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm">
                  إنهاء جميع الجلسات الأخرى
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Settings */}
        {activeSection === 'permissions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">الصلاحيات والأدوار</h1>
              <p className="text-muted-foreground">إدارة أدوار المستخدمين وصلاحياتهم</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">الأدوار المخصصة</h3>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  إضافة دور جديد
                </button>
              </div>

              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">مدير تنفيذي</p>
                      <p className="text-sm text-muted-foreground">وصول كامل لجميع الميزات</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      5 مستخدمين
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      عرض جميع التقارير
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      تعديل الإعدادات
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      إدارة المستخدمين
                    </span>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">محلل</p>
                      <p className="text-sm text-muted-foreground">وصول للتحليلات والتقارير</p>
                    </div>
                    <span className="text-xs bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">
                      12 مستخدم
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      عرض التقارير
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      إنشاء تحليلات
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      تعديل محدود
                    </span>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">مشاهد</p>
                      <p className="text-sm text-muted-foreground">عرض التقارير فقط</p>
                    </div>
                    <span className="text-xs bg-gray-500/10 text-gray-600 px-3 py-1 rounded-full">
                      8 مستخدمين
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      عرض اللوحات
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      بدون تعديل
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      بدون تصدير
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeSection === 'api' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">مفاتيح API</h1>
              <p className="text-muted-foreground">إدارة مفاتيح الوصول البرمجي للمنصة</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">المفاتيح النشطة</h3>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  إنشاء مفتاح جديد
                </button>
              </div>

              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">تم الإنشاء في 15 يناير 2026</p>
                    </div>
                    <button className="text-xs text-destructive hover:underline">حذف</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
                      {showApiKey ? 'rushd_sk_live_1a2b3c4d5e6f7g8h9i0j' : '••••••••••••••••••••••••'}
                    </div>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleCopyApiKey}
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>آخر استخدام: منذ ساعتين</span>
                    <span>•</span>
                    <span>2,450 طلب هذا الشهر</span>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground">تم الإنشاء في 3 فبراير 2026</p>
                    </div>
                    <button className="text-xs text-destructive hover:underline">حذف</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
                      ••••••••••••••••••••••••
                    </div>
                    <button className="p-2 hover:bg-accent rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>آخر استخدام: منذ يومين</span>
                    <span>•</span>
                    <span>156 طلب هذا الشهر</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      تحذير أمني
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      لا تشارك مفاتيح API الخاصة بك مع أي شخص. احتفظ بها في مكان آمن.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connected Services */}
        {activeSection === 'services' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">الخدمات المتصلة</h1>
              <p className="text-muted-foreground">إدارة التكاملات مع الخدمات الخارجية</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                      SB
                    </div>
                    <div>
                      <p className="font-medium">Supabase</p>
                      <p className="text-sm text-muted-foreground">قاعدة البيانات والمصادقة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-500/10 text-green-600 px-3 py-1 rounded-full">
                      متصل
                    </span>
                    <button className="text-sm text-primary hover:underline">إعدادات</button>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold">
                      ST
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">معالجة المدفوعات</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-500/10 text-green-600 px-3 py-1 rounded-full">
                      متصل
                    </span>
                    <button className="text-sm text-primary hover:underline">إعدادات</button>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
                      SL
                    </div>
                    <div>
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-muted-foreground">إشعارات الفريق</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-500/10 text-gray-600 px-3 py-1 rounded-full">
                      غير متصل
                    </span>
                    <button className="text-sm text-primary hover:underline">ربط</button>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                      GS
                    </div>
                    <div>
                      <p className="font-medium">Google Sheets</p>
                      <p className="text-sm text-muted-foreground">تصدير البيانات</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-500/10 text-gray-600 px-3 py-1 rounded-full">
                      غير متصل
                    </span>
                    <button className="text-sm text-primary hover:underline">ربط</button>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
                      ZP
                    </div>
                    <div>
                      <p className="font-medium">Zapier</p>
                      <p className="text-sm text-muted-foreground">أتمتة سير العمل</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-500/10 text-gray-600 px-3 py-1 rounded-full">
                      غير متصل
                    </span>
                    <button className="text-sm text-primary hover:underline">ربط</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
