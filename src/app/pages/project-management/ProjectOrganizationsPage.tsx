import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { Building2, Loader2, RotateCcw, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  onboardingService,
  OrganizationSummaryItem,
  PaginatedOrganizationSummaryList,
} from '@/api/services/onboarding-service';
import { AUTH_CONFIG } from '@/api/config';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push('...');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push('...');
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export function ProjectOrganizationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [organizations, setOrganizations] = useState<OrganizationSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(Number(searchParams.get('page') || String(DEFAULT_PAGE)));
  const [perPage] = useState(DEFAULT_PER_PAGE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await onboardingService.getOrganizations(page, perPage);
      const data = response.data as PaginatedOrganizationSummaryList | undefined;
      if (response.success && data) {
        setOrganizations(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        if (data.pagination?.page && data.pagination.page !== page) {
          setPage(data.pagination.page);
        }
      } else {
        setError(response.message || 'تعذر تحميل المنظمات');
      }
    } catch (err: any) {
      const message = err?.message || 'حدث خطأ أثناء تحميل المنظمات';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) {
      params.page = String(page);
    }
    setSearchParams(params, { replace: true });
  }, [page, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleViewPdf = async (url: string) => {
    if (!url || viewingPdfUrl) return;
    setViewingPdfUrl(url);
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) : null;
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error('Failed to fetch PDF');

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const objectUrl = window.URL.createObjectURL(pdfBlob);
      const newWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        toast.error('تم حظر نافذة التبويب الجديدة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.');
      }
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
    } catch {
      toast.error('فشل فتح ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setViewingPdfUrl(null);
    }
  };

  const startItem = total > 0 ? (page - 1) * perPage + 1 : 0;
  const endItem = Math.min(page * perPage, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[var(--spacing-small-gap)] mb-6">
          <div className="flex items-center gap-[var(--spacing-small-gap)]">
            <Building2 className="w-7 h-7 text-[var(--secondary)]" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">البيانات المختصرة</h1>
          </div>
          <span className="text-sm text-muted-foreground">إجمالي المنظمات: {total}</span>
        </div>

        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
          {loading && organizations.length === 0 ? (
            <div className="p-12 flex items-center justify-center gap-[var(--spacing-small-gap)] text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري تحميل المنظمات...
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center gap-[var(--spacing-small-gap)] text-center">
              <p className="text-[var(--destructive)]">{error}</p>
              <Button variant="outline" onClick={fetchOrganizations} className="gap-[var(--spacing-small-gap)]">
                <RotateCcw className="w-4 h-4" />
                إعادة المحاولة
              </Button>
            </div>
          ) : organizations.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد منظمات</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-[60px]">#</TableHead>
                      <TableHead className="text-right">اسم المنظمة</TableHead>
                      <TableHead className="text-right min-w-[200px] w-[220px] whitespace-normal">مجالات التمويل</TableHead>
                      <TableHead className="text-right">باقة الاشتراك</TableHead>
                      <TableHead className="text-right">تاريخ التسجيل</TableHead>
                      <TableHead className="text-right">عدد المشاريع</TableHead>
                      <TableHead className="text-right">رقم الجوال</TableHead>
                      <TableHead className="text-right">ملف التعريف</TableHead>
                      <TableHead className="text-right">المشاريع السابقة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{(page - 1) * perPage + index + 1}</TableCell>
                        <TableCell className="font-medium">{org.organizationName}</TableCell>
                        <TableCell className="whitespace-normal break-words min-w-[200px] w-[220px]">{org.fundingAreas}</TableCell>
                        <TableCell>{org.subscriptionPlan}</TableCell>
                        <TableCell>{formatDate(org.registrationDate)}</TableCell>
                        <TableCell>{org.numberOfProjects}</TableCell>
                        <TableCell dir="ltr" className="text-right">{org.mobileNumber}</TableCell>
                        <TableCell>
                          {org.profilePdfUrl ? (
                            <button
                              type="button"
                              onClick={() => handleViewPdf(org.profilePdfUrl)}
                              disabled={viewingPdfUrl === org.profilePdfUrl}
                              className="inline-flex items-center gap-[var(--spacing-small-gap)] text-[var(--primary)] hover:text-[var(--primary)]/80 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {viewingPdfUrl === org.profilePdfUrl ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              {viewingPdfUrl === org.profilePdfUrl ? 'جاري الفتح...' : 'عرض PDF'}
                              {viewingPdfUrl !== org.profilePdfUrl && <ExternalLink className="w-3 h-3" />}
                            </button>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {org.previousProjectsPdfUrl ? (
                            <button
                              type="button"
                              onClick={() => handleViewPdf(org.previousProjectsPdfUrl)}
                              disabled={viewingPdfUrl === org.previousProjectsPdfUrl}
                              className="inline-flex items-center gap-[var(--spacing-small-gap)] text-[var(--primary)] hover:text-[var(--primary)]/80 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {viewingPdfUrl === org.previousProjectsPdfUrl ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              {viewingPdfUrl === org.previousProjectsPdfUrl ? 'جاري الفتح...' : 'عرض PDF'}
                              {viewingPdfUrl !== org.previousProjectsPdfUrl && <ExternalLink className="w-3 h-3" />}
                            </button>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-[var(--spacing-card-padding)] border-t border-[var(--border)]">
                  <div className="text-sm text-muted-foreground">
                    عرض {startItem}–{endItem} من {total} منظمة
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1 || loading}
                      className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted text-foreground"
                      aria-label="الصفحة السابقة"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="rotate-180"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>

                    {pageNumbers.map((pageNum, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                        disabled={typeof pageNum !== 'number' || loading}
                        className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors ${
                          typeof pageNum !== 'number'
                            ? 'cursor-default text-muted-foreground'
                            : pageNum === page
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages || loading}
                      className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted text-foreground"
                      aria-label="الصفحة التالية"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
