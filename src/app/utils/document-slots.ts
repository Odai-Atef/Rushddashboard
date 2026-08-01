import {
 BACKEND_DOCUMENT_TYPE_TO_SLOT,
 DocumentSlotId,
} from '@/api/services/onboarding-service';

export interface DocumentSlot {
 id: DocumentSlotId;
 label: string;
 required: boolean;
 templateUrl?: string;
}

export const documentSlots: DocumentSlot[] = [
 { id: 'license', label: 'رخصة الجمعية الخيرية', required: true },
 { id: 'bank', label: 'شهادة الحساب البنكي', required: true },
 { id: 'address', label: 'العنوان الوطني', required: true },
 { id: 'profile', label: 'الملف التعريفي للجمعية', required: true },
 { id: 'board_approval', label: 'قرار تشكيل مجلس الإدارة', required: true },
 { id: 'basic_bylaws', label: 'اللائحة الأساسية', required: true },
 { id: 'representative_authorization', label: 'خطاب تفويض ممثل الجهة', required: true },
 { id: 'brand', label: 'الهوية البصرية', required: true },
 { id: 'projects', label: 'المشاريع السابقة', required: false },
 { id: 'financial', label: 'التقارير المالية', required: false },
 { id: 'annual', label: 'التقارير السنوية', required: false },
 {
 id: 'startup_associations_additional',
 label: 'المستندات الإضافية الخاصة بالجمعيات الناشئة (التي لم تكمل سنة من تاريخ التأسيس)',
 required: false,
 templateUrl: '/templates/startup-association-letter.pdf',
 },
];

export const requiredDocumentSlots = documentSlots.filter((s) => s.required);
export const optionalDocumentSlots = documentSlots.filter((s) => !s.required);

export function getDocumentSlotLabel(slotId: DocumentSlotId): string {
 return documentSlots.find((s) => s.id === slotId)?.label || slotId;
}

export function getSlotIdByDocumentType(documentType: string): DocumentSlotId | undefined {
 return BACKEND_DOCUMENT_TYPE_TO_SLOT[documentType];
}
