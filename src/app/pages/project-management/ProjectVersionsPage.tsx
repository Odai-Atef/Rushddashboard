import { useNavigate, useParams } from 'react-router';
import {
 ChevronRight,
 History,
 Loader2,
 RotateCcw,
 FileText,
 FileDown,
 Download,
 File,
} from 'lucide-react';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { useProjectDocuments } from '@/api/hooks/useProjectDocuments';
import { ProjectNotFound } from './ProjectNotFound';
import { collaborationService } from '@/api/services/collaboration-service';
import { toast } from 'sonner';
import { useState } from 'react';

function formatBytes(bytes: number): string {
 if (bytes === 0) return '0 بايت';
 const k = 1024;
 const sizes = ['بايت', 'كيلوبايت', 'ميغابايت', 'جيغابايت'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getDocumentIcon(mimeType: string) {
 if (mimeType.includes('pdf')) {
 return <FileText className="w-8 h-8 text-red-500" />;
 }
 if (mimeType.includes('word') || mimeType.includes('officedocument')) {
 return <FileText className="w-8 h-8 text-[var(--secondary)]" />;
 }
 return <File className="w-8 h-8 text-muted-foreground" />;
}

function getDocumentTypeLabel(documentType: string): string {
 const labels: Record<string, string> = {
 AI_PLAN_PDF: 'دراسة المشروع - PDF',
 AI_PLAN_DOCX: 'دراسة المشروع - Word',
 PRESENTATION_PDF: 'عرض تقديمي - PDF',
 };
 return labels[documentType] || documentType;
}

export function ProjectVersionsPage() {
 const navigate = useNavigate();
 const { projectId } = useParams<{ projectId: string }>();
 const { project, isLoading: projectLoading, error: projectError, refetch: refetchProject } = useProjectDetails(projectId);
 const { documents, isLoading: documentsLoading, error: documentsError, refetch: refetchDocuments } = useProjectDocuments(projectId);
 const [downloadingId, setDownloadingId] = useState<string | null>(null);

 const isLoading = projectLoading || documentsLoading;
 const error = projectError || documentsError;

 const handleDownload = async (fileId: string, fileName: string) => {
 setDownloadingId(fileId);
 try {
 const res = await collaborationService.downloadFileById(fileId);
 const blob = res.data;
 const url = window.URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = fileName;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 window.URL.revokeObjectURL(url);
 toast.success('تم تحميل الملف بنجاح');
 } catch (err: any) {
 toast.error(err?.message || 'فشل تحميل الملف');
 } finally {
 setDownloadingId(null);
 }
 };

 if (isLoading) {
 return (
 <div className="min-h-full bg-background p-3 sm:p-6 flex items-center justify-center">
 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-full bg-background p-3 sm:p-6 flex flex-col items-center justify-center gap-4">
 <div className="text-[var(--destructive)] text-center">{error}</div>
 <button
 onClick={() => {
 refetchProject();
 refetchDocuments();
 }}
 className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium flex items-center gap-2"
 >
 <RotateCcw className="w-4 h-4" />
 إعادة المحاولة
 </button>
 </div>
 );
 }

 if (!project) {
 return <ProjectNotFound />;
 }

 return (
 <div className="min-h-full bg-background p-3 sm:p-6">
 <div className="space-y-6">
 <button
 onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
 className="text-[var(--secondary)] hover:text-[var(--secondary)] font-medium flex items-center gap-2 mb-4"
 >
 <ChevronRight className="w-5 h-5" />
 رجوع إلى تفاصيل المشروع
 </button>
 <h1 className="text-3xl font-bold mb-4">سجل الإصدارات والمستندات</h1>
 <div className="bg-card rounded-xl p-8 border border-border">
 <div className="flex items-center gap-3 mb-8">
 <div className="w-12 h-12 bg-[var(--secondary)]/[0.1] rounded-lg flex items-center justify-center">
 <History className="w-6 h-6 text-[var(--secondary)]" />
 </div>
 <div>
 <p className="text-sm text-muted-foreground">المشروع</p>
 <p className="text-xl font-bold">{project.name}</p>
 </div>
 </div>

 {documents.length === 0 ? (
 <div className="text-center py-12 text-muted-foreground">لا توجد مستندات مسجلة لهذا المشروع</div>
 ) : (
 <div className="space-y-3">
 {documents.map((doc) => {
 const file = doc.file;
 if (!file) {
 return (
 <div
 key={doc.id}
 className="flex items-center gap-4 p-4 bg-secondary rounded-xl border border-border"
 >
 <div className="flex-shrink-0">
 <File className="w-8 h-8 text-muted-foreground" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-medium text-foreground truncate">{getDocumentTypeLabel(doc.documentType)}</p>
 <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
 <span>الملف غير متوفر</span>
 </div>
 </div>
 </div>
 );
 }
 return (
 <div
 key={doc.id}
 className="flex items-center gap-4 p-4 bg-secondary rounded-xl border border-border hover:border-blue-300 transition-colors"
 >
 <div className="flex-shrink-0">
 {getDocumentIcon(file.mimeType)}
 </div>

 <div className="flex-1 min-w-0">
 <p className="font-medium text-foreground truncate">{file.originalName}</p>
 <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
 <span>{getDocumentTypeLabel(doc.documentType)}</span>
 <span>•</span>
 <span>{formatBytes(file.size)}</span>
 <span>•</span>
 <span>{new Date(doc.createdAt).toLocaleString('ar-SA')}</span>
 <span>•</span>
 <span className="truncate">{doc.uploader?.email || doc.uploadedBy}</span>
 </div>
 </div>

 <button
 onClick={() => handleDownload(doc.fileId, file.originalName)}
 disabled={downloadingId === doc.fileId}
 className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {downloadingId === doc.fileId ? (
 <Loader2 className="w-4 h-4 animate-spin" />
 ) : (
 <FileDown className="w-4 h-4" />
 )}
 تحميل
 </button>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
