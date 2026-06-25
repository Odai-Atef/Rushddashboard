/**
 * Onboarding guard utilities.
 *
 * Provides canonical step ordering, completion checks, and route guard
 * evaluation used by the onboarding layout.
 */

import { OnboardingStep } from '../context/OnboardingContext';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'landing',
  'registration',
  'assessment',
  'documents',
  'thanks',
  'preloader',
  'processing',
  'results',
  'analysis',
  'roadmap',
  'decision',
];

export function getStepOrder(step: OnboardingStep): number {
  const index = ONBOARDING_STEPS.indexOf(step);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function isValidStep(step: string): step is OnboardingStep {
  return ONBOARDING_STEPS.includes(step as OnboardingStep);
}

export function getStepPath(step: OnboardingStep): string {
  return `/dashboard/onboarding/${step}`;
}

export function getStepUrl(step: OnboardingStep, organizationId?: string | null): string {
  const path = getStepPath(step);
  return organizationId ? `${path}?organizationId=${encodeURIComponent(organizationId)}` : path;
}

export interface StepProgress {
  currentStep: OnboardingStep | null;
  registrationCompleted?: boolean;
  profileCompleted?: boolean;
  assessmentCompleted?: boolean;
  documentsCompleted?: boolean;
  processingCompleted?: boolean;
  resultsCompleted?: boolean;
}

export interface GuardResult {
  allowed: boolean;
  redirectTo?: OnboardingStep;
  reason?: string;
}

function stepName(step: OnboardingStep): string {
  switch (step) {
    case 'landing': return 'البدء';
    case 'registration': return 'التسجيل';
    case 'profile': return 'الملف التعريفي';
    case 'assessment': return 'التقييم';
    case 'documents': return 'المستندات';
    case 'thanks': return 'تأكيد المستندات';
    case 'preloader': return 'تحليل البيانات';
    case 'processing': return 'المعالجة';
    case 'results': return 'النتائج';
    case 'analysis': return 'التحليل';
    case 'roadmap': return 'خطة التطوير';
    case 'decision': return 'القرار';
  }
}

function isStepCompleted(step: OnboardingStep, progress: StepProgress): boolean {
  const currentOrder = getStepOrder(progress.currentStep ?? 'landing');
  const stepOrder = getStepOrder(step);
  if (stepOrder <= currentOrder) {
    return true;
  }

  switch (step) {
    case 'registration':
      return !!progress.registrationCompleted;
    case 'profile':
      return !!progress.profileCompleted;
    case 'assessment':
      return !!progress.assessmentCompleted;
    case 'documents':
    case 'thanks':
      return !!progress.documentsCompleted;
    case 'preloader':
    case 'processing':
      return !!progress.processingCompleted;
    case 'results':
    case 'analysis':
    case 'roadmap':
    case 'decision':
      return !!progress.resultsCompleted;
    default:
      return step === 'landing';
  }
}

function getFurthestCompletedStep(progress: StepProgress): OnboardingStep {
  const steps: OnboardingStep[] = [
    'registration',
    'assessment',
    'documents',
    'thanks',
    'preloader',
    'processing',
    'results',
  ];

  let furthest: OnboardingStep = 'landing';
  for (const step of steps) {
    if (isStepCompleted(step, progress)) {
      furthest = step;
    } else {
      break;
    }
  }
  return furthest;
}

function getAllowedNextSteps(furthestCompleted: OnboardingStep): OnboardingStep[] {
  const nextOrder = getStepOrder(furthestCompleted) + 1;
  if (nextOrder >= ONBOARDING_STEPS.length) return [];
  const next = ONBOARDING_STEPS[nextOrder];
  // Preloader and processing are transition screens between assessment and results,
  // so allow them whenever assessment is reachable.
  if (next === 'assessment') {
    return ['assessment', 'preloader', 'processing'];
  }
  return [next];
}

export function evaluateStepGuard(
  requestedStep: OnboardingStep,
  progress: StepProgress,
): GuardResult {
  // landing is always allowed
  if (requestedStep === 'landing') {
    return { allowed: true };
  }

  // registration is always allowed (it is the first actionable step)
  if (requestedStep === 'registration') {
    return { allowed: true };
  }

  // Registration must always remain accessible so users can edit/fill it.
  // Redirect legacy onboarding steps only when registration is incomplete,
  // but keep the ISIV assessment entry point (assessment/preloader/processing) open.
  const isAssessmentEntryPoint =
    requestedStep === 'assessment' || requestedStep === 'preloader' || requestedStep === 'processing';
  const isRegistrationIncomplete =
    progress.currentStep === 'registration' || progress.currentStep === 'landing' || !progress.currentStep;
  if (
    !isAssessmentEntryPoint &&
    isRegistrationIncomplete &&
    requestedStep !== 'registration'
  ) {
    return {
      allowed: false,
      redirectTo: 'registration',
      reason: 'لم يتم إكمال التسجيل بعد.',
    };
  }

  if (isStepCompleted(requestedStep, progress)) {
    return { allowed: true };
  }

  const furthestCompleted = getFurthestCompletedStep(progress);
  const allowedNextSteps = getAllowedNextSteps(furthestCompleted);

  if (allowedNextSteps.includes(requestedStep)) {
    return { allowed: true };
  }

  const redirectTo = allowedNextSteps[0] ?? furthestCompleted;
  return {
    allowed: false,
    redirectTo,
    reason: `${stepName(requestedStep)} غير متاح بعد. يرجى إكمال ${stepName(furthestCompleted)} أولاً.`,
  };
}
