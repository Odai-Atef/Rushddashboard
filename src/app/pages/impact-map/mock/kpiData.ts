import type { KPI } from '../types';

export const mockKPIs: KPI[] = [
  {
    id: 'total-projects',
    label: 'إجمالي المشاريع',
    value: 2847,
    change: '+12.5%',
    isPositive: true,
    icon: 'Briefcase',
    description: 'المشاريع النشطة والمكتملة',
  },
  {
    id: 'total-beneficiaries',
    label: 'إجمالي المستفيدين',
    value: 125430,
    change: '+8.3%',
    isPositive: true,
    icon: 'Users',
    description: 'الأفراد والمجتمعات المستفيدة',
  },
  {
    id: 'total-funding',
    label: 'إجمالي التمويل',
    value: '٢.٤ مليار ر.س.',
    change: '+15.2%',
    isPositive: true,
    icon: 'DollarSign',
    description: 'إجمالي التمويل المحصّل',
  },
  {
    id: 'avg-sroi',
    label: 'متوسط العائد الاجتماعي',
    value: '٤.٢x',
    change: '+0.3x',
    isPositive: true,
    icon: 'TrendingUp',
    description: 'العائد على كل ريال مستثمر',
  },
];
