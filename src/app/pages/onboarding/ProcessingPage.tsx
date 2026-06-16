import { Brain, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { onboardingService } from '@/api/services';

export function ProcessingPage() {
  const { goToStep } = useOnboardingNavigate();
  const { activeOrganizationId, setAssessmentResult, setAssessmentStatus } =
    useOnboardingContext();
  const [processingProgress, setProcessingProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!activeOrganizationId || startedRef.current) return;
    startedRef.current = true;

    let progressInterval: ReturnType<typeof setInterval> | null = null;
    const startProgress = () => {
      setProcessingProgress(0);
      progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          const next = prev + 10;
          if (next >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return next;
        });
      }, 300);
    };
    const stopProgress = () => {
      if (progressInterval) clearInterval(progressInterval);
      setProcessingProgress(100);
    };

    const submit = async () => {
      startProgress();
      const startTime = Date.now();
      try {
        await onboardingService.submitAssessment(activeOrganizationId);
        const evalRes = await onboardingService.getIsivAssessmentResults(
          activeOrganizationId
        );
        const resultData = (evalRes.data as any)?.data ?? evalRes.data;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 3000 - elapsed);
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        stopProgress();
        setAssessmentResult(resultData);
        setAssessmentStatus({
          status: 'COMPLETED',
          overallScore: resultData?.overallScore ?? null,
          completedAt: resultData?.assessedAt ?? null,
        });
        goToStep('results');
      } catch (err: any) {
        stopProgress();
        const message =
          err?.message ||
          'فشل في تقييم المؤسسة. يرجى المحاولة مرة أخرى.';
        goToStep('documents');
      }
    };

    submit();
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [activeOrganizationId, goToStep, setAssessmentResult, setAssessmentStatus]);

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-3">جارٍ تحليل البيانات...</h1>
          <p className="text-gray-600 mb-8">
            يقوم الذكاء الاصطناعي بتحليل إجاباتك والمستندات المرفوعة لإعداد تقرير
            شامل
          </p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">التقدم</span>
              <span className="text-sm font-medium text-blue-600">
                {processingProgress}٪
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3 text-right">
            {[
              { threshold: 20, label: 'تحليل الإجابات' },
              { threshold: 50, label: 'مراجعة المستندات' },
              { threshold: 80, label: 'حساب النتيجة النهائية' },
            ].map((item) => {
              const done = processingProgress > item.threshold;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    done ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  <span className={done ? 'text-green-900' : 'text-gray-700'}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-sm text-gray-500 mt-8">
            الوقت المتوقع: ٣٠ - ٦٠ ثانية
          </p>
        </div>
      </div>
    </div>
  );
}
