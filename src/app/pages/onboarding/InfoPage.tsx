import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Building2, FileText, AlertCircle } from 'lucide-react';
import { EntityInfoForm } from './EntityInfoForm';
import { OrganizationDocumentsForm } from './OrganizationDocumentsForm';
import { useAuth } from '@/app/layouts/RootLayout';
import { cn } from '@/app/utils/cn';

type InfoTab = 'info' | 'documents';

const tabs: { id: InfoTab; label: string; icon: typeof Building2 }[] = [
 { id: 'info', label: 'معلومات الجهه', icon: Building2 },
 { id: 'documents', label: 'المستندات المطلوبة للجهه', icon: FileText },
];

export function InfoPage() {
 const { user } = useAuth();
 const [searchParams, setSearchParams] = useSearchParams();
 const [activeTab, setActiveTab] = useState<InfoTab>(() => {
 const tab = searchParams.get('tab');
 return tab === 'documents' ? 'documents' : 'info';
 });

 useEffect(() => {
 const tab = searchParams.get('tab');
 if (tab === 'documents' || tab === 'info') {
 setActiveTab(tab);
 }
 }, [searchParams]);

 const handleTabChange = (tab: InfoTab) => {
 setActiveTab(tab);
 setSearchParams({ tab }, { replace: true });
 };

 const showActionRequiredAlert = user?.status?.toUpperCase() === 'NEED_ACTION_FROM_ORG' && !!user?.actionRequired;

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="max-w-3xl mx-auto">
 {/* Action required alert */}
 {showActionRequiredAlert && (
 <div className="mb-6 p-[var(--spacing-card-padding)] bg-[var(--destructive)]/[0.08] border border-[var(--destructive)]/[0.3] rounded-xl flex items-start gap-[var(--spacing-small-gap)]">
 <AlertCircle className="w-5 h-5 text-[var(--destructive)] mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-[var(--destructive)] text-sm font-semibold">
 تنبيه: هناك إجراء مطلوب منك لإتمام اعتماد ملفك الشخصي:
 </p>
 <p className="text-[var(--destructive)] text-sm mt-1">{user.actionRequired}</p>
 </div>
 </div>
 )}

 {/* Tabs Header */}
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border overflow-hidden mb-4 sm:mb-6">
 <div className="flex w-full overflow-x-auto">
 {tabs.map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => handleTabChange(tab.id)}
 className={cn(
 'w-1/2 flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-4 text-center font-medium transition-colors',
 isActive
 ? 'bg-primary/10 text-primary border-b-2 border-primary'
 : 'text-muted-foreground hover:bg-muted hover:text-foreground border-b-2 border-transparent'
 )}
 >
 <Icon className="w-5 h-5" />
 <span>{tab.label}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Tab Content */}
 {activeTab === 'info' && <EntityInfoForm />}
 {activeTab === 'documents' && <OrganizationDocumentsForm />}
 </div>
 </div>
 );
}
