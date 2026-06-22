import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  Upload,
} from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { useEvaluationComments } from '@/api/hooks/useEvaluationComments';
import { toast } from 'sonner';
import { resolveIcon as resolveApiIcon } from '@/app/utils/icon-map';
import { getStepOrder, OnboardingStep } from '@/app/utils/onboarding-guards';
import {
  AssessmentCategory,
  AssessmentQuestion,
  SaveAnswerPayload,
  SavedAnswer,
  SCORE_TO_TIER,
} from '@/api/services/onboarding-service';

interface AssessmentAnswer {
  categoryId: string;
  questionId: string;
  answer: number | string | string[] | File | null;
}



export function AssessmentPage() {
  const { goToStep } = useOnboardingNavigate();
  const { organization, activeOrganizationId, setOrganization, setAssessmentAnswersDirty } = useOnboardingContext();

  const [assessmentCategories, setAssessmentCategories] = useState<
    AssessmentCategory[]
  >([]);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [answersLoadError, setAnswersLoadError] = useState<string | null>(null);
  const [isSavingAnswers, setIsSavingAnswers] = useState(false);
  const [saveAnswersError, setSaveAnswersError] = useState<string | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState<
    Record<string, { answered: number; total: number; isComplete: boolean }>
  >({});
  const [overallProgress, setOverallProgress] = useState(0);
  const { data: commentsMap } = useEvaluationComments(activeOrganizationId ?? undefined);
  const [hoveredScale, setHoveredScale] = useState<{ questionId: string; score: number } | null>(null);
  const [currentAssessmentStep, setCurrentAssessmentStep] = useState(0);

  const [assessmentAnswers, setAssessmentAnswers] = useState<
    AssessmentAnswer[]
  >([]);
  const [touchedQuestionIds, setTouchedQuestionIds] = useState<Set<string>>(
    new Set()
  );

  const [isCheckingCooldown, setIsCheckingCooldown] = useState(true);
  const [cooldownBlocked, setCooldownBlocked] = useState(false);
  const [cooldownRedirected, setCooldownRedirected] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const locallyEditedQuestionIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const checkCooldown = async () => {
      if (!activeOrganizationId) {
        setIsCheckingCooldown(false);
        return;
      }
      try {
        const { onboardingService } = await import('@/api/services');
        const res = await onboardingService.getEvaluationCooldownStatus(
          activeOrganizationId,
          'assessment'
        );
        if (controller.signal.aborted) return;
        const status = (res.data as any)?.data ?? res.data;
        if (!status?.canEvaluate && !status?.firstTime) {
          const remainingMinutes = Math.max(
            1,
            Math.ceil((status?.remainingSeconds ?? 0) / 60)
          );
          toast.error(
            `يمكنك إجراء التقييم مرة أخرى بعد ${remainingMinutes} دقيقة`
          );
          setCooldownBlocked(true);
          setCooldownRedirected(true);
          goToStep('preloader');
          return;
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        console.error('[AssessmentPage] cooldown check failed', err);
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingCooldown(false);
        }
      }
    };

    checkCooldown();
    return () => {
      controller.abort();
    };
  }, [activeOrganizationId, goToStep]);

  useEffect(() => {
    if (cooldownRedirected || isCheckingCooldown) return;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoadingAssessment(true);
    setAssessmentError(null);
    setAnswersLoadError(null);

    const load = async () => {
      try {
        const { onboardingService } = await import('@/api/services');
        const res = await onboardingService.getAssessmentState(
          activeOrganizationId ?? undefined
        );
        if (controller.signal.aborted) return;
        const state = res.data;
        if (!state) return;

        setOverallProgress(state.overallProgress ?? 0);

        if (!state.categories || state.categories.length === 0) {
          setAssessmentCategories([]);
          setAssessmentProgress({});
          return;
        }

        const progress: Record<
          string,
          { answered: number; total: number; isComplete: boolean }
        > = {};
        const flattenedAnswers: SavedAnswer[] = [];

        state.categories.forEach((cat) => {
          progress[cat.categoryId] = {
            answered: cat.answeredQuestions ?? 0,
            total: cat.totalQuestions ?? 0,
            isComplete: cat.isComplete ?? false,
          };

          cat.answers?.forEach((ans) => {
            flattenedAnswers.push({
              id: ans.questionId,
              organizationId: state.organizationId,
              questionId: ans.questionId,
              questionType: ans.questionType,
              answerNumeric: ans.answerNumeric ?? null,
              answerValue: ans.answerValue ?? null,
              selectedOptions: ans.selectedOptions ?? null,
            });
          });
        });

        setAssessmentProgress(progress);
        mergeSavedAnswers(flattenedAnswers, false);

        const stateCategories: AssessmentCategory[] | undefined = state.categories
          .filter(
            (cat) => Array.isArray(cat.questions) && cat.questions.length > 0
          )
          .map((cat) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            nameEn: cat.categoryName,
            icon: '',
            color: '#3B82F6',
            sortOrder: 0,
            questions: cat.questions || [],
          }));

        if (stateCategories && stateCategories.length > 0) {
          setAssessmentCategories(stateCategories);
        } else {
          const catRes = await onboardingService.getAssessmentCategories();
          if (controller.signal.aborted) return;
          if (catRes.data) {
            setAssessmentCategories(catRes.data);
          }
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        const message = err?.message || 'حدث خطأ أثناء تحميل التقييم';
        if (err?.statusCode === 401) {
          setAssessmentError(message);
        } else if (err?.statusCode === 404) {
          setAssessmentCategories([]);
          setAssessmentProgress({});
          setOverallProgress(0);
        } else {
          setAnswersLoadError(message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingAssessment(false);
        }
      }
    };

    load();
    return () => {
      controller.abort();
    };
  }, [activeOrganizationId, cooldownRedirected, isCheckingCooldown]);

  const getAnswer = (questionId: string) =>
    assessmentAnswers.find((a) => a.questionId === questionId)?.answer;

  const setAnswer = (
    categoryId: string,
    questionId: string,
    answer: AssessmentAnswer['answer']
  ) => {
    locallyEditedQuestionIds.current.add(questionId);
    setSaveAnswersError(null);
    setAssessmentAnswersDirty(true);
    setAssessmentAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { categoryId, questionId, answer }];
    });
  };

  const mergeSavedAnswers = (
    savedAnswers: SavedAnswer[],
    overwriteLocal: boolean
  ) => {
    setAssessmentAnswers((prev) => {
      const next = [...prev];
      savedAnswers.forEach((saved) => {
        if (
          !overwriteLocal &&
          locallyEditedQuestionIds.current.has(saved.questionId)
        ) {
          return;
        }
        let answer: AssessmentAnswer['answer'] = null;
        switch (saved.questionType) {
          case 'SCALE':
            answer = saved.answerNumeric;
            break;
          case 'YES_NO':
          case 'FILE_UPLOAD':
            answer = saved.answerValue;
            break;
          case 'MULTIPLE_CHOICE':
            answer = saved.selectedOptions;
            break;
        }
        const idx = next.findIndex((a) => a.questionId === saved.questionId);
        const categoryId =
          assessmentCategories.find((cat) =>
            cat.questions.some((q) => q.id === saved.questionId)
          )?.id || '';
        if (idx >= 0) {
          next[idx] = { categoryId, questionId: saved.questionId, answer };
        } else {
          next.push({ categoryId, questionId: saved.questionId, answer });
        }
      });
      return next;
    });
  };

  const findUnansweredRequiredQuestions = (questions: AssessmentQuestion[]) => {
    return questions.filter((q) => {
      if (!q.isRequired) return false;
      const answer = getAnswer(q.id);
      if (answer == null) return true;
      if (typeof answer === 'string' && answer.trim() === '') return true;
      if (Array.isArray(answer) && answer.length === 0) return true;
      return false;
    });
  };

  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-red-500', 'rounded-lg');
      setTimeout(
        () => element.classList.remove('ring-2', 'ring-red-500', 'rounded-lg'),
        2000
      );
    }
  };

  const buildSaveAnswerPayloads = (
    questions: AssessmentQuestion[]
  ): SaveAnswerPayload[] => {
    return questions
      .map((q) => {
        const answer = getAnswer(q.id);
        const base: SaveAnswerPayload = {
          questionId: q.id,
          answerNumeric: null,
          answerValue: null,
          selectedOptions: null,
        };
        switch (q.questionType) {
          case 'SCALE':
            return typeof answer === 'number'
              ? { ...base, answerNumeric: answer }
              : null;
          case 'YES_NO':
          case 'FILE_UPLOAD':
            return typeof answer === 'string' && answer.trim() !== ''
              ? { ...base, answerValue: answer }
              : null;
          case 'MULTIPLE_CHOICE':
            return Array.isArray(answer) && answer.length > 0
              ? { ...base, selectedOptions: answer }
              : null;
          default:
            return null;
        }
      })
      .filter((payload): payload is SaveAnswerPayload => payload !== null);
  };

  const markRequiredAsTouched = (questions: AssessmentQuestion[]) => {
    const requiredIds = questions
      .filter((q) => q.isRequired)
      .map((q) => q.id);
    if (requiredIds.length === 0) return;
    setTouchedQuestionIds((prev) => new Set([...prev, ...requiredIds]));
  };

  const handleAssessmentNext = async () => {
    setSaveAnswersError(null);
    const currentCategory = assessmentCategories[currentAssessmentStep];
    if (!currentCategory) return;

    const scopeQuestions = currentCategory.questions;
    const unansweredRequired = findUnansweredRequiredQuestions(scopeQuestions);
    if (unansweredRequired.length > 0) {
      markRequiredAsTouched(scopeQuestions);
      toast.error(
        `يرجى الإجابة على ${unansweredRequired.length} سؤال مطلوب`
      );
      scrollToQuestion(unansweredRequired[0].id);
      return;
    }

    const payload = buildSaveAnswerPayloads(scopeQuestions);
    setIsSavingAnswers(true);
    try {
      const { onboardingService } = await import('@/api/services');
      const res = await onboardingService.saveAssessmentAnswers(
        payload,
        activeOrganizationId ?? undefined
      );
      if (res.data) {
        mergeSavedAnswers(
          Array.isArray(res.data) ? res.data : res.data.answers ?? [],
          true
        );
        locallyEditedQuestionIds.current.clear();
        setAssessmentAnswersDirty(false);
        if (currentAssessmentStep < assessmentCategories.length - 1) {
          setCurrentAssessmentStep((step) => step + 1);
        } else {
          // Optimistically advance currentStep to ASSESSMENT so the route
          // guard allows navigation to preloader when the backend lags.
          const currentStepOrder = getStepOrder(
            (organization?.currentStep?.toLowerCase() as OnboardingStep) ?? 'landing'
          );
          const assessmentStepOrder = getStepOrder('assessment');
          console.log('[AssessmentPage] final category saved, currentStep:', organization?.currentStep, 'currentStepOrder:', currentStepOrder);
          if (organization && currentStepOrder < assessmentStepOrder) {
            console.log('[AssessmentPage] patching currentStep to ASSESSMENT');
            setOrganization({ ...organization, currentStep: 'ASSESSMENT' });
          }
          goToStep('preloader');
        }
      }
    } catch (err: any) {
      const status = err?.statusCode;
      let message =
        err?.message ||
        'حدث خطأ أثناء حفظ الإجابات. يرجى المحاولة مرة أخرى.';
      if (status === 404) {
        message =
          'لم يتم العثور على الجمعية. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
      } else if (status === 400) {
        message =
          'بيانات الإجابات غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.';
      }
      setSaveAnswersError(message);
      toast.error(message);
    } finally {
      setIsSavingAnswers(false);
    }
  };

  if (isCheckingCooldown || isLoadingAssessment) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">
            {isCheckingCooldown ? 'جارٍ التحقق من إمكانية التقييم...' : 'جارٍ تحميل فئات التقييم...'}
          </p>
        </div>
      </div>
    );
  }

  if (cooldownBlocked) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">جارٍ إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  if (assessmentError) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">تعذر تحميل التقييم</h2>
          <p className="text-gray-600 mb-6">{assessmentError}</p>
          <button
            onClick={() => goToStep('profile')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            العودة إلى الملف التعريفي
          </button>
        </div>
      </div>
    );
  }

  if (assessmentCategories.length === 0) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">
            لا توجد فئات تقييم متاحة
          </h2>
          <p className="text-gray-600 mb-6">
            لم يتم العثور على فئات تقييم في الوقت الحالي. يرجى المحاولة لاحقاً.
          </p>
          <button
            onClick={() => goToStep('profile')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            العودة إلى الملف التعريفي
          </button>
        </div>
      </div>
    );
  }

  const currentCategory = assessmentCategories[currentAssessmentStep];
  const CategoryIcon = resolveApiIcon(currentCategory.icon);
  const currentProgress = assessmentProgress[currentCategory.id] ?? {
    answered: 0,
    total: currentCategory.questions.length,
    isComplete: false,
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Category Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {assessmentCategories.map((cat, idx) => {
              const Icon = resolveApiIcon(cat.icon);
              const catProgress = assessmentProgress[cat.id] ?? {
                answered: 0,
                total: cat.questions.length,
                isComplete: false,
              };
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentAssessmentStep(idx)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    idx === currentAssessmentStep
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : catProgress.isComplete
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        idx === currentAssessmentStep
                          ? 'bg-blue-100'
                          : catProgress.isComplete
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          idx === currentAssessmentStep
                            ? 'text-blue-600'
                            : catProgress.isComplete
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        idx === currentAssessmentStep
                          ? 'text-blue-900'
                          : catProgress.isComplete
                          ? 'text-green-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {cat.name}
                    </span>
                    {catProgress.isComplete && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {catProgress.answered} / {catProgress.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Category Header */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${currentCategory.color}20` }}
            >
              <CategoryIcon
                className="w-8 h-8"
                style={{ color: currentCategory.color }}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentCategory.name}</h2>
              <p className="text-gray-600">
                تم الإجابة على {currentProgress.answered} من{' '}
                {currentProgress.total} أسئلة
              </p>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width:
                      currentProgress.total > 0
                        ? `${
                            (currentProgress.answered /
                              currentProgress.total) *
                            100
                          }%`
                        : '0%',
                  }}
                ></div>
              </div>
            </div>
          </div>

          {(answersLoadError || saveAnswersError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                {saveAnswersError || answersLoadError}
              </p>
            </div>
          )}

          {/* Dynamic Questions */}
          <div className="space-y-8">
            {currentCategory.questions.length === 0 && (
              <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
                لا توجد أسئلة في هذا القسم
              </div>
            )}

            {currentCategory.questions.map((q, qIdx) => {
              const answer = getAnswer(q.id);
              const isAnswered =
                answer != null &&
                !(
                  typeof answer === 'string' && answer.trim() === ''
                ) &&
                !(Array.isArray(answer) && answer.length === 0);
              const showRequiredError =
                q.isRequired && !isAnswered && touchedQuestionIds.has(q.id);
              const questionWrapperClass = `p-6 bg-gray-50 rounded-lg transition-all ${
                showRequiredError
                  ? 'border-2 border-red-500 bg-red-50'
                  : q.isRequired && !isAnswered
                  ? 'border-2 border-transparent'
                  : ''
              }`;

              if (q.questionType === 'YES_NO') {
                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    className={questionWrapperClass}
                  >
                    <label className="block font-medium mb-4">
                      {qIdx + 1}. {q.questionText}
                      {q.isRequired && (
                        <span className="text-red-500 mr-1">*</span>
                      )}
                      {isAnswered && (
                        <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />
                      )}
                    </label>
                    {showRequiredError && (
                      <p className="mb-4 text-sm text-red-600">
                        هذا السؤال مطلوب
                      </p>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          setAnswer(currentCategory.id, q.id, 'yes')
                        }
                        className={`flex-1 px-6 py-3 border-2 rounded-lg transition-colors font-medium ${
                          answer === 'yes'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        onClick={() =>
                          setAnswer(currentCategory.id, q.id, 'no')
                        }
                        className={`flex-1 px-6 py-3 border-2 rounded-lg transition-colors font-medium ${
                          answer === 'no'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>
                );
              }

              if (q.questionType === 'SCALE') {
                const activeScore =
                  hoveredScale?.questionId === q.id
                    ? hoveredScale.score
                    : typeof answer === 'number'
                    ? answer
                    : null;
                const getScoreDescription = (
                  questionId: string,
                  score: number
                ): string | null => {
                  const questionComments = commentsMap[questionId];
                  if (!questionComments || questionComments.length === 0) {
                    return null;
                  }
                  const tier = SCORE_TO_TIER[score];
                  const comment = tier
                    ? questionComments.find((c) => c.tier === tier)
                    : undefined;
                  return comment?.commentAr || comment?.commentEn || null;
                };
                const scoreDescription =
                  activeScore != null ? getScoreDescription(q.id, activeScore) : null;

                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    className={questionWrapperClass}
                  >
                    <label className="block font-medium mb-4">
                      {qIdx + 1}. {q.questionText}
                      {q.isRequired && (
                        <span className="text-red-500 mr-1">*</span>
                      )}
                      {isAnswered && (
                        <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />
                      )}
                    </label>
                    {showRequiredError && (
                      <p className="mb-4 text-sm text-red-600">
                        هذا السؤال مطلوب
                      </p>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>ضعيف جداً</span>
                        <span>ممتاز</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() =>
                              setAnswer(currentCategory.id, q.id, num)
                            }
                            onMouseEnter={() =>
                              setHoveredScale({ questionId: q.id, score: num })
                            }
                            onMouseLeave={() => setHoveredScale(null)}
                            className={`flex-1 h-12 border-2 rounded-lg transition-colors font-medium ${
                              answer === num
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      {scoreDescription && (
                        <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          {scoreDescription}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              if (q.questionType === 'MULTIPLE_CHOICE') {
                const choices = q.options?.choices ?? [];
                const selected = Array.isArray(answer) ? (answer as string[]) : [];
                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    className={questionWrapperClass}
                  >
                    <label className="block font-medium mb-4">
                      {qIdx + 1}. {q.questionText}
                      {q.isRequired && (
                        <span className="text-red-500 mr-1">*</span>
                      )}
                      {isAnswered && (
                        <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />
                      )}
                    </label>
                    {showRequiredError && (
                      <p className="mb-4 text-sm text-red-600">
                        هذا السؤال مطلوب
                      </p>
                    )}
                    {choices.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        لا توجد خيارات متاحة
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {choices.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selected.includes(option)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAnswer(currentCategory.id, q.id, [
                                    ...selected,
                                    option,
                                  ]);
                                } else {
                                  setAnswer(
                                    currentCategory.id,
                                    q.id,
                                    selected.filter((s) => s !== option)
                                  );
                                }
                              }}
                              className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (q.questionType === 'FILE_UPLOAD') {
                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    className="p-6 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <label className="block font-medium mb-2">
                      {qIdx + 1}. {q.questionText}
                      {q.isRequired && (
                        <span className="text-red-500 mr-1">*</span>
                      )}
                      {isAnswered && (
                        <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />
                      )}
                    </label>
                    {showRequiredError && (
                      <p className="mb-3 text-sm text-red-600">
                        هذا السؤال مطلوب
                      </p>
                    )}
                    <div className="flex items-start gap-3 mb-3">
                      <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 mb-1">
                          وثائق داعمة
                        </p>
                        <p className="text-sm text-blue-700">
                          يمكنك رفع وثائق تثبت إجاباتك لتحسين دقة التقييم
                        </p>
                      </div>
                    </div>
                    <input
                      id={`file-${q.id}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setAnswer(currentCategory.id, q.id, file);
                      }}
                    />
                    <label
                      htmlFor={`file-${q.id}`}
                      className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-blue-700 font-medium flex items-center justify-center cursor-pointer"
                    >
                      {answer instanceof File
                        ? answer.name
                        : typeof answer === 'string'
                        ? answer
                        : 'اختر ملف أو اسحبه هنا'}
                    </label>
                  </div>
                );
              }

              return (
                <div
                  key={q.id}
                  id={`question-${q.id}`}
                  className={questionWrapperClass}
                >
                  <label className="block font-medium mb-2">
                    {qIdx + 1}. {q.questionText}
                    {q.isRequired && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </label>
                  <p className="text-sm text-gray-500">نوع السؤال غير مدعوم</p>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-end pt-8 mt-8 border-t">
            <button
              onClick={handleAssessmentNext}
              disabled={isSavingAnswers || isLoadingAssessment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingAnswers ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : currentAssessmentStep === assessmentCategories.length - 1 ? (
                'قيم الآن'
              ) : (
                'التالي'
              )}
              {!isSavingAnswers && <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
