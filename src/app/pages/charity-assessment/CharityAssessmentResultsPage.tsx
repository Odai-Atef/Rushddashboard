import { useParams, useNavigate } from 'react-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
 Award,
 AlertTriangle,
 Target,
 Star,
 Sparkles,
 Lightbulb,
 ChevronRight,
 Download,
 Share2,
 RefreshCw,
 Activity,
 TrendingUp,
 Loader2,
} from 'lucide-react';
import {
 RadarChart,
 PolarGrid,
 PolarAngleAxis,
 PolarRadiusAxis,
 Radar,
 ResponsiveContainer,
 LineChart as RechartsLineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 BarChart,
 Bar,
 Cell,
} from 'recharts';
import { useIsivAssessmentResults } from '@/api/hooks/useIsivAssessmentResults';
import type { Weakness, ProgressDataItem } from '@/api/services/onboarding-service';

function getReadinessLevel(score: number) {
 if (score >= 85) return { label: 'متميز', color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]' };
 if (score >= 70) return { label: 'جاهز', color: 'text-[var(--secondary)]', bg: 'bg-[var(--primary)]' };
 if (score >= 55) return { label: 'متوسط', color: 'text-yellow-500', bg: 'bg-yellow-500' };
 return { label: 'يحتاج تحسين', color: 'text-red-500', bg: 'bg-[var(--destructive)]' };
}

function getSeverityClasses(severity: string) {
 switch (severity) {
 case 'critical':
 return {
 wrapper: 'bg-[var(--destructive)]/5 border-red-500/20',
 badge: 'text-red-500',
 label: 'حرج',
 };
 case 'high':
 return {
 wrapper: 'bg-orange-500/5 border-orange-500/20',
 badge: 'text-orange-500',
 label: 'عالي',
 };
 default:
 return {
 wrapper: 'bg-yellow-500/5 border-yellow-500/20',
 badge: 'text-yellow-500',
 label: 'متوسط',
 };
 }
}

function base64FromUrl(url: string): Promise<string> {
 return fetch(url)
 .then((res) => res.blob())
 .then(
 (blob) =>
 new Promise((resolve, reject) => {
 const reader = new FileReader();
 reader.onloadend = () => resolve((reader.result as string) || '');
 reader.onerror = reject;
 reader.readAsDataURL(blob);
 })
 );
}

export function CharityAssessmentResultsPage() {
 const navigate = useNavigate();
 const { organizationId } = useParams<{ organizationId: string }>();
 const { data, isLoading, error, refetch } = useIsivAssessmentResults(organizationId);
 const [documentsMissing, setDocumentsMissing] = useState<boolean | null>(null);
 const [isExporting, setIsExporting] = useState(false);
 const [roadmapReady, setRoadmapReady] = useState(false);
 const reportRef = useRef<HTMLDivElement>(null);
 const roadmapIframeRef = useRef<HTMLIFrameElement>(null);

 useEffect(() => {
 if (!organizationId) return;
 let cancelled = false;
 const check = async () => {
 try {
 const { onboardingService } = await import('@/api/services');
 const res = await onboardingService.checkRequiredDocuments(organizationId);
 if (cancelled) return;
 const payload = res.data as any;
 const complete = !!(payload?.data?.complete ?? payload?.complete);
 setDocumentsMissing(!complete);
 } catch {
 if (!cancelled) setDocumentsMissing(false);
 }
 };
 check();
 return () => { cancelled = true; };
 }, [organizationId]);

 useEffect(() => {
 const onMessage = (event: MessageEvent) => {
 if (event.data?.type === 'ROADMAP_CAPTURE_READY') {
 setRoadmapReady(true);
 }
 };
 window.addEventListener('message', onMessage);
 return () => window.removeEventListener('message', onMessage);
 }, []);

 const waitForRoadmapReady = useCallback(async (timeoutMs = 10000) => {
 const start = Date.now();
 while (Date.now() - start < timeoutMs) {
 if (roadmapReady) return true;
 await new Promise((r) => setTimeout(r, 200));
 }
 return false;
 }, [roadmapReady]);

 const captureRoadmapElement = useCallback(async () => {
 const isReady = await waitForRoadmapReady();
 if (!isReady) {
 console.warn('Roadmap iframe did not signal ready; skipping roadmap capture');
 return null;
 }

 const iframe = roadmapIframeRef.current;
 if (!iframe?.contentWindow?.document) {
 console.warn('Roadmap iframe not accessible');
 return null;
 }
 const root = iframe.contentWindow.document.querySelector('[data-capture-root]') as HTMLElement | null;
 if (!root) {
 console.warn('Roadmap capture root not found inside iframe');
 return null;
 }

 const { toCanvas } = await import('html-to-image');
 const originalWidth = root.offsetWidth;
 return toCanvas(root, {
 pixelRatio: 2,
 backgroundColor: 'var(--card)',
 cacheBust: true,
 style: {
 width: `${originalWidth || 1120}px`,
 maxWidth: 'none',
 margin: '0',
 },
 });
 }, [waitForRoadmapReady]);

 const addImageToPdf = (
 pdf: any,
 imgData: string,
 canvasWidth: number,
 canvasHeight: number,
 logoBase64: string,
 logoSize: number,
 logoX: number,
 logoY: number,
 margin: number,
 pageWidth: number,
 pageHeight: number,
 addLogoToFirstPage: boolean
 ) => {
 const imgWidth = pageWidth - margin * 2;
 const imgHeight = (canvasHeight * imgWidth) / canvasWidth;
 let position = logoY + logoSize + 8;
 let heightLeft = imgHeight - (pageHeight - position);

 const addLogo = () => {
 if (!logoBase64) return;
 try {
 pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
 } catch (e) {
 console.warn('Failed to add logo image to PDF', e);
 }
 };

 if (addLogoToFirstPage) addLogo();
 pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);

 while (heightLeft > 0) {
 pdf.addPage();
 if (addLogoToFirstPage) addLogo();
 position = heightLeft - imgHeight + logoY + logoSize + 8;
 pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
 heightLeft -= pageHeight - logoY - logoSize - 8;
 }
 };

 if (isLoading || documentsMissing === null) {
 return (
 <div className="min-h-full bg-background flex items-center justify-center">
 <div className="flex flex-col items-center gap-[var(--spacing-grid-gap)]">
 <Loader2 className="w-10 h-10 animate-spin text-[var(--secondary)]" />
 <p className="text-muted-foreground">جاري تحميل نتائج التقييم...</p>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-full bg-background flex items-center justify-center p-8">
 <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] sm:p-8 text-center max-w-md">
 <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h2 className="text-xl font-semibold mb-2">تعذر تحميل النتائج</h2>
 <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{error}</p>
 <button
 onClick={() => refetch()}
 className="inline-flex items-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
 >
 <RefreshCw className="w-4 h-4" />
 إعادة المحاولة
 </button>
 </div>
 </div>
 );
 }

 if (!data) {
 return (
 <div className="min-h-full bg-background flex items-center justify-center p-8">
 <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] sm:p-8 text-center max-w-md">
 <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
 <h2 className="text-xl font-semibold mb-2">لا توجد نتائج</h2>
 <p className="text-muted-foreground">لم يتم العثور على نتائج تقييم لهذه المنظمة.</p>
 </div>
 </div>
 );
 }

 const handleExportPDF = async () => {
 if (!reportRef.current) return;
 setIsExporting(true);
 try {
 const [{ toCanvas }, { jsPDF }] = await Promise.all([
 import('html-to-image'),
 import('jspdf'),
 ]);

 let logoBase64 = '';
 try {
 logoBase64 = await base64FromUrl('/logo.png');
 } catch (logoErr) {
 console.warn('Failed to load logo for PDF export', logoErr);
 }

 const element = reportRef.current;
 const sections = Array.from(element.querySelectorAll('[data-report-section]')) as HTMLElement[];
 if (sections.length === 0) {
 toast.error('لا توجد أقسام للتصدير');
 setIsExporting(false);
 return;
 }

 const pdf = new jsPDF({
 orientation: 'p',
 unit: 'mm',
 format: 'a4',
 putOnlyUsedFonts: true,
 floatPrecision: 16,
 });

 const pageWidth = pdf.internal.pageSize.getWidth();
 const pageHeight = pdf.internal.pageSize.getHeight();
 const margin = 14;

 // Logo centered at top (square aspect ratio)
 const logoSize = 20;
 const logoX = (pageWidth - logoSize) / 2;
 const logoY = 10;

 const filterExcluded = (node: Node) => {
 if (node instanceof HTMLElement && node.dataset.reportExclude === 'true') {
 return false;
 }
 return true;
 };

 for (let i = 0; i < sections.length; i++) {
 const section = sections[i];
 if (i > 0) pdf.addPage();

 const canvas = await toCanvas(section, {
 pixelRatio: 2,
 backgroundColor: 'var(--card)',
 cacheBust: true,
 filter: filterExcluded,
 style: {
 width: `${section.offsetWidth || 1120}px`,
 maxWidth: 'none',
 margin: '0',
 },
 });

 const imgData = canvas.toDataURL('image/png');
 addImageToPdf(
 pdf,
 imgData,
 canvas.width,
 canvas.height,
 logoBase64,
 logoSize,
 logoX,
 logoY,
 margin,
 pageWidth,
 pageHeight,
 i === 0
 );
 }

 // Append roadmap page(s) if the hidden iframe has loaded
 try {
 const roadmapCanvas = await captureRoadmapElement();
 if (roadmapCanvas) {
 const roadmapImgData = roadmapCanvas.toDataURL('image/png');
 pdf.addPage();
 addImageToPdf(
 pdf,
 roadmapImgData,
 roadmapCanvas.width,
 roadmapCanvas.height,
 logoBase64,
 logoSize,
 logoX,
 logoY,
 margin,
 pageWidth,
 pageHeight,
 false
 );
 }
 } catch (roadmapErr) {
 console.warn('Failed to capture roadmap for PDF export', roadmapErr);
 }

 pdf.save('rushd-readiness-report.pdf');
 toast.success('تم تصدير التقرير بنجاح');
 } catch (err) {
 console.error('PDF export failed', err);
 toast.error('فشل تصدير التقرير');
 } finally {
 setIsExporting(false);
 }
 };

 const overallScore = data.overallScore ?? 0;
 const readinessLevel = getReadinessLevel(overallScore);
 const radarData =
 data.radarData && data.radarData.length > 0
 ? data.radarData
 : (data.dimensions ?? []).map((d) => ({
 category: d.nameAr || d.dimensionLabelAr || d.dimension || d.nameEn || d.symbol || 'dimension',
 score: d.percent ?? d.percentage ?? d.score ?? 0,
 fullMark: 100,
 }));

 // Keep the radar chart on a fixed 0-100 scale so lower dimensions (e.g.
 // "القيمة والاستدامة") are not visually compressed near the center.
 const radarLowerBound = 0;
 const radarUpperBound = 100;
 // The backend sometimes returns the LLM output as a malformed JSON string
 // in llmResponse.raw. Parse it client-side and, if that fails, extract the
 // rich fields we care about with targeted regex/string parsing.
 const rawLlm = (data as any).llmResponse?.raw;
 let parsedLlm: any = null;
 if (rawLlm && typeof rawLlm === 'string') {
 try {
 parsedLlm = JSON.parse(rawLlm);
 } catch {
 parsedLlm = {};

 const extractStringField = (key: string): string | undefined => {
 const pattern = new RegExp(`"${key}"\\s*:\\s*"(.*?)"(?=,\\s*"|\\s*[,}\\]])`, 's');
 const match = rawLlm.match(pattern);
 return match ? match[1] : undefined;
 };

 const strengthsAnalysis = extractStringField('strengthsAnalysis');
 const gapAnalysis = extractStringField('gapAnalysis');
 if (strengthsAnalysis) parsedLlm.strengthsAnalysis = strengthsAnalysis;
 if (gapAnalysis) parsedLlm.gapAnalysis = gapAnalysis;

 // Extract the recommendations object if present.
 const recMatch = rawLlm.match(/"recommendations"\s*:\s*(\{.*?\})/s);
 if (recMatch) {
 try {
 parsedLlm.recommendations = JSON.parse(recMatch[1]);
 } catch {
 // ignore malformed recommendations block
 }
 }

 if (Object.keys(parsedLlm).length === 0) parsedLlm = null;
 }
 }
 const llm = parsedLlm || (data as any).llmResponse;
 const llmStrengthsAnalysis = llm?.strengthsAnalysis;
 const llmGapAnalysis = llm?.gapAnalysis;

 // Use LLM-derived recommendations when the backend returns an empty list.
 const recommendations =
 data.recommendations && data.recommendations.length > 0
 ? data.recommendations
 : llm?.recommendations
 ? [
 ...(llm.recommendations.highPriority
 ? llm.recommendations.highPriority.split(/\n/).filter(Boolean).map((r: string) => ({ text: r.trim(), priority: 'high' as const }))
 : []),
 ...(llm.recommendations.mediumPriority
 ? llm.recommendations.mediumPriority.split(/\n/).filter(Boolean).map((r: string) => ({ text: r.trim(), priority: 'medium' as const }))
 : []),
 ...(llm.recommendations.longTermDevelopment
 ? llm.recommendations.longTermDevelopment.split(/\n/).filter(Boolean).map((r: string) => ({ text: r.trim(), priority: 'long' as const }))
 : []),
 ]
 : [];

 // Prefer the rich LLM narrative for strengths; fall back to the plain backend list.
 const strengths =
 llmStrengthsAnalysis && typeof llmStrengthsAnalysis === 'string'
 ? llmStrengthsAnalysis.split(/،|\. /).map((s) => s.trim()).filter(Boolean)
 : (data.strengths ?? []);

 // Prefer the rich LLM narrative for gaps; fall back to the plain backend list.
 const weaknesses =
 llmGapAnalysis && typeof llmGapAnalysis === 'string'
 ? [{ area: 'تحليل الفجوات', issue: llmGapAnalysis, severity: 'medium' as const }]
 : ((data.weaknesses ?? []) as Weakness[]);
 const benchmarks = data.benchmarks;
 const benchmarkData = benchmarks
 ? [
 { name: 'منظمتك', value: benchmarks.yourScore, color: '#3b82f6' },
 { name: 'متوسط القطاع', value: benchmarks.sectorAverage, color: '#94a3b8' },
 { name: 'أفضل ممارسة', value: benchmarks.topPerformer, color: '#10b981' },
 ]
 : [
 { name: 'منظمتك', value: overallScore, color: '#3b82f6' },
 { name: 'متوسط القطاع', value: 68, color: '#94a3b8' },
 { name: 'أفضل ممارسة', value: 85, color: '#10b981' },
 ];
 const progressData = data.progressData as ProgressDataItem[] | undefined;
 const assessedAt = data.assessedAt ? new Date(data.assessedAt) : null;

 return (
 <div className="min-h-full bg-background">
 {/* Header - intentionally outside the exported report */}
 <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-[var(--primary-foreground)]">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
 <div className="flex items-start justify-between mb-6">
 <div>
 <h1 className="text-2xl sm:text-3xl font-bold mb-2">نتائج تقييم الجاهزية</h1>
 <p className="text-foreground">
 {assessedAt
 ? `تم إكمال التقييم بنجاح • تم التحديث في ${assessedAt.toLocaleDateString('ar-SA', {
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 })}`
 : 'تم إكمال التقييم بنجاح'}
 </p>
 </div>
 <div className="flex gap-2 flex-wrap items-center justify-end">
 <button
 onClick={handleExportPDF}
 disabled={isExporting}
 className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--card)]/10 hover:bg-[var(--card)]/20 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
 >
 {isExporting ? (
 <Loader2 className="w-4 h-4 animate-spin" />
 ) : (
 <Download className="w-4 h-4" />
 )}
 تصدير PDF
 </button>
 <button
 onClick={() => navigate('/dashboard/charity-assessment/assessment')}
 className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--card)]/10 hover:bg-[var(--card)]/20 rounded-lg transition-colors text-sm sm:text-base"
 >
 <RefreshCw className="w-4 h-4" />
 إعادة التقييم
 </button>
 {documentsMissing && data.qualificationStatus?.toUpperCase() !== 'NOT_QUALIFIED' && (
 <button
 onClick={() =>
 navigate(`/dashboard/onboarding/info?tab=documents&organizationId=${encodeURIComponent(organizationId || '')}&from=results`)
 }
 className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[var(--primary-foreground)] rounded-lg transition-colors animate-pulse text-sm sm:text-base"
 >
 أكمل ملف جهتك
 </button>
 )}
 </div>
 </div>

 {/* Overall Score */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-[var(--spacing-grid-gap)]">
 <div className="bg-[var(--card)]/10 backdrop-blur rounded-xl p-4 sm:p-[var(--spacing-card-padding)]">
 <p className="text-foreground mb-2">درجة الجاهزية الإجمالية</p>
 <div className="flex items-end gap-[var(--spacing-small-gap)]">
 <span className="text-4xl sm:text-5xl font-bold">{overallScore}%</span>
 <span
 className={`px-3 py-1 ${readinessLevel.bg}/20 border border-[var(--primary-foreground)]/[0.2] rounded-full text-sm mb-2`}
 >
 {readinessLevel.label}
 </span>
 </div>
 </div>

 <div className="bg-[var(--card)]/10 backdrop-blur rounded-xl p-4 sm:p-[var(--spacing-card-padding)] md:col-span-2">
 <p className="text-foreground mb-2">التقييم العام</p>
 <p className="text-lg sm:text-2xl font-semibold leading-relaxed">
 {data.comments?.overall?.ar || data.qualificationMessage || 'تم إكمال التقييم بنجاح'}
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Main Content / Exportable Report */}
 <div ref={reportRef} data-report-root className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
 <div data-report-section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-[var(--spacing-grid-gap)] mb-6 sm:mb-8">
 {/* Radar Chart */}
 <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)]">
 <h2 className="text-xl font-semibold mb-6">نظرة شاملة على الأداء</h2>
 {radarData.length > 0 ? (
 <ResponsiveContainer width="100%" height={250} minHeight={250}>
 <RadarChart data={radarData}>
 <PolarGrid />
 <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#4b5563' }} />
 <PolarRadiusAxis
 angle={90}
 domain={[radarLowerBound, radarUpperBound]}
 tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
 tickCount={5}
 />
 <Radar
 name="درجتك"
 dataKey="score"
 stroke="#3b82f6"
 fill="#3b82f6"
 fillOpacity={0.6}
 />
 <Tooltip
 formatter={(value: number) => [`${value}%`, 'درجتك']}
 contentStyle={{ direction: 'rtl', textAlign: 'right' }}
 />
 </RadarChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-[300px] flex items-center justify-center text-muted-foreground">
 لا توجد بيانات رادار متاحة
 </div>
 )}
 </div>

 {/* Quick Stats */}
 <div className="space-y-4 sm:space-y-[var(--spacing-section-gap)]">
 <button
 onClick={() => {
 document.getElementById('strengths-section')?.scrollIntoView({ behavior: 'smooth' });
 }}
 className="bg-[var(--card)] border border-border/80/50 rounded-2xl p-4 sm:p-[var(--spacing-card-padding)] text-right w-full shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
 >
 <div className="flex items-center justify-between mb-3 sm:mb-5">
 <div className="p-[var(--spacing-small-gap)].5 rounded-xl bg-[var(--warning)]/[0.1]">
 <Star className="w-6 h-6 text-[var(--warning)]" />
 </div>
 <Award className="w-6 h-6 text-[var(--secondary)]" />
 </div>
 <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">{strengths.length}</p>
 <p className="text-xs sm:text-sm text-muted-foreground">نقاط قوة رئيسية</p>
 </button>

 <button
 onClick={() => {
 document.getElementById('gaps-section')?.scrollIntoView({ behavior: 'smooth' });
 }}
 className="bg-[var(--card)] border border-border/80/50 rounded-2xl p-4 sm:p-[var(--spacing-card-padding)] text-right w-full shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
 >
 <div className="flex items-center justify-between mb-3 sm:mb-5">
 <div className="p-[var(--spacing-small-gap)].5 rounded-xl bg-[var(--warning)]/[0.1]">
 <AlertTriangle className="w-6 h-6 text-[var(--warning)]" />
 </div>
 <Target className="w-6 h-6 text-red-500" />
 </div>
 <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">{weaknesses.length}</p>
 <p className="text-xs sm:text-sm text-muted-foreground">تحليل الفجوات</p>
 </button>

 <button
 onClick={() => {
 if (organizationId) {
 navigate(`/dashboard/charity-assessment/roadmap/${organizationId}`);
 }
 }}
 className="bg-[var(--card)] border border-border/80/50 rounded-2xl p-4 sm:p-[var(--spacing-card-padding)] text-right w-full shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
 >
 <div className="flex items-center justify-between mb-3 sm:mb-5">
 <div className="p-[var(--spacing-small-gap)].5 rounded-xl bg-muted/[0.08]">
 <Lightbulb className="w-6 h-6 text-purple-600" />
 </div>
 <Sparkles className="w-6 h-6 text-[var(--secondary)]" />
 </div>
 <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">{recommendations.length}</p>
 <p className="text-xs sm:text-sm text-muted-foreground">توصيات مخصصة</p>
 </button>
 </div>
 </div>

 {/* Benchmark Comparison */}
 <div data-report-section className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] mb-6 sm:mb-8">
 <h2 className="text-xl font-semibold mb-6">المقارنة المعيارية</h2>
 <ResponsiveContainer width="100%" height={250} minHeight={200}>
 <BarChart data={benchmarkData}>
 <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
 <XAxis dataKey="name" />
 <YAxis domain={[0, 100]} />
 <Tooltip />
 <Bar dataKey="value" radius={[8, 8, 0, 0]}>
 {benchmarkData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Strengths */}
 <div id="strengths-section" data-report-section className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] mb-6 sm:mb-8">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-6">
 <Star className="w-6 h-6 text-yellow-500" />
 <h2 className="text-xl font-semibold">نقاط القوة الرئيسية</h2>
 </div>
 {llmStrengthsAnalysis && (
 <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{llmStrengthsAnalysis}</p>
 )}
 <div className="space-y-4 sm:space-y-[var(--spacing-section-gap)]">
 {strengths.length > 0 ? (
 strengths.map((strength, index) => {
 const title = typeof strength === 'string' ? strength : strength.area;
 const score = typeof strength === 'string' ? undefined : strength.score;
 const insight = typeof strength === 'string' ? undefined : strength.insight;
 return (
 <div key={index} className="bg-[var(--primary)]/5 border border-[var(--primary)]/[0.2] rounded-lg p-[var(--spacing-card-padding)]">
 <div className="flex items-start justify-between mb-3">
 <div>
 <h3 className="font-medium text-sm sm:text-base mb-1">{title}</h3>
 {insight && <p className="text-xs sm:text-sm text-muted-foreground">{insight}</p>}
 </div>
 {score !== undefined && (
 <div className="text-left">
 <p className="text-xl sm:text-2xl font-bold text-[var(--primary)]">{score}%</p>
 </div>
 )}
 </div>
 {score !== undefined && (
 <div className="w-full bg-muted rounded-full h-2">
 <div
 className="bg-[var(--primary)] h-2 rounded-full"
 style={{ width: `${score}%` }}
 />
 </div>
 )}
 </div>
 );
 })
 ) : (
 <p className="text-muted-foreground">لا توجد نقاط قوة مسجلة</p>
 )}
 </div>
 </div>

 {/* Gaps */}
 <div id="gaps-section" data-report-section className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] mb-6 sm:mb-8">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-6">
 <AlertTriangle className="w-6 h-6 text-orange-500" />
 <h2 className="text-xl font-semibold">تحليل الفجوات</h2>
 </div>
 {llmGapAnalysis ? (
 <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{llmGapAnalysis}</p>
 ) : (
 <div className="space-y-4 sm:space-y-[var(--spacing-section-gap)]">
 {weaknesses.length > 0 ? (
 weaknesses.map((gap, index) => {
 const severityClasses = getSeverityClasses(gap.severity);
 return (
 <div key={index} className={`border rounded-lg p-4 sm:p-[var(--spacing-card-padding)] ${severityClasses.wrapper}`}>
 <div className="flex items-start justify-between mb-3">
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <h3 className="font-medium text-sm sm:text-base">{gap.area}</h3>
 <span className={`px-2 py-0.5 rounded-lg text-xs ${severityClasses.badge}`}>
 {severityClasses.label}
 </span>
 </div>
 {gap.issue && (
 <p className="text-xs sm:text-sm text-muted-foreground mb-3">{gap.issue}</p>
 )}
 {gap.recommendation && (
 <div className="flex items-start gap-2 bg-card/50 rounded-lg p-3 sm:p-[var(--spacing-card-padding)]">
 <Lightbulb className="w-4 h-4 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
 <p className="text-xs sm:text-sm">{gap.recommendation}</p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 })
 ) : (
 <p className="text-muted-foreground">لا توجد فجوات مسجلة</p>
 )}
 </div>
 )}
 </div>

 {/* Progress Tracking */}
 {progressData && progressData.length > 0 && (
 <div data-report-section className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] mb-6 sm:mb-8">
 <h2 className="text-xl font-semibold mb-6">تتبع التقدم</h2>
 <ResponsiveContainer width="100%" height={250} minHeight={200}>
 <RechartsLineChart data={progressData}>
 <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
 <XAxis dataKey="month" />
 <YAxis domain={[0, 100]} />
 <Tooltip />
 <Legend />
 <Line
 type="monotone"
 dataKey="score"
 stroke="#3b82f6"
 strokeWidth={3}
 name="درجة الجاهزية"
 />
 </RechartsLineChart>
 </ResponsiveContainer>
 </div>
 )}

 {/* CTA */}
 <div data-report-exclude className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-[var(--secondary)]/[0.2] rounded-xl p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] sm:p-8 text-center">
 <h3 className="text-xl sm:text-2xl font-semibold mb-3">جاهز للخطوة التالية؟</h3>
 <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
 استعرض خارطة الطريق المخصصة لتحسين جاهزية منظمتك
 </p>
 <button
 onClick={() => navigate(`/dashboard/charity-assessment/roadmap/${organizationId}`)}
 className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-[var(--primary-foreground)] rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
 >
 عرض خارطة الطريق
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Hidden iframe used to render the roadmap page for PDF export */}
 {organizationId && (
 <iframe
 ref={roadmapIframeRef}
 src={`/dashboard/charity-assessment/roadmap/${organizationId}?pdf-capture=1`}
 title="roadmap-capture"
 className="pointer-events-none fixed -left-[9999px] top-0 w-[1200px] h-[800px] border-0 opacity-0"
 sandbox="allow-same-origin allow-scripts"
 />
 )}
 </div>
 );
}
