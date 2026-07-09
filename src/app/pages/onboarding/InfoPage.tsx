import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Building2, FileText } from 'lucide-react';
import { EntityInfoForm } from './EntityInfoForm';
import { OrganizationDocumentsForm } from './OrganizationDocumentsForm';
import { cn } from '@/app/utils/cn';

type InfoTab = 'info' | 'documents';

const tabs: { id: InfoTab; label: string; icon: typeof Building2 }[] = [
  { id: 'info', label: 'معلومات الجهه', icon: Building2 },
  { id: 'documents', label: 'المستندات المطلوبة للجهه', icon: FileText },
];

export function InfoPage() {
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

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Tabs Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="flex w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'w-1/2 flex items-center justify-center gap-2 px-4 py-4 text-center font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-b-2 border-transparent'
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
