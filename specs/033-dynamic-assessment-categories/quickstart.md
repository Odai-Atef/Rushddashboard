# Quickstart: Dynamic Assessment Categories

## Goal

Replace hardcoded assessment categories and questions with API-driven dynamic rendering.

## Prerequisites

- `onboarding-service.ts` does not yet have the assessment categories endpoint — it must be added.
- `CharityOnboardingFlow.tsx` already has `assessmentCategories` hardcoded, static JSX questions, and `AssessmentAnswer` interface.

## Files to Touch

1. `src/api/services/onboarding-service.ts` — add endpoint + types
2. `src/app/components/CharityOnboardingFlow.tsx` — wire fetch, dynamic tabs, dynamic questions

## Implementation Steps

### Step 1: Add types and endpoint to onboarding-service

Add these interfaces to `onboarding-service.ts`:

```tsx
export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: 'SCALE' | 'YES_NO' | 'MULTIPLE_CHOICE' | 'FILE_UPLOAD' | string;
  options: { choices: string[] } | null;
  isRequired: boolean;
  sortOrder: number;
}

export interface AssessmentCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  sortOrder: number;
  questions: AssessmentQuestion[];
}
```

Add method to `OnboardingService` class:

```tsx
async getAssessmentCategories(): Promise<ApiResponse<AssessmentCategory[]>> {
  return apiClient.get('/api/v1/onboarding/assessment/categories');
}
```

### Step 2: Create icon name → Lucide component mapper

Inside `CharityOnboardingFlow.tsx` (or a helper file):

```tsx
import * as Icons from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Icons.Building2,
  shield: Icons.Shield,
  users: Icons.Users,
  heart: Icons.Heart,
  briefcase: Icons.Briefcase,
  zap: Icons.Zap,
  target: Icons.Target,
  bar_chart: Icons.BarChart3,
  trending_up: Icons.TrendingUp,
  // fallback for unknown
};

function getIcon(name: string) {
  return iconMap[name] || Icons.Circle;
}
```

### Step 3: Replace hardcoded array with fetched state

Replace:
```tsx
const assessmentCategories = [...];
```

With:
```tsx
const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
const [assessmentLoading, setAssessmentLoading] = useState(false);
const [assessmentError, setAssessmentError] = useState<string | null>(null);
```

Add fetch effect (triggered when entering assessment view):

```tsx
useEffect(() => {
  if (currentView !== 'assessment') return;
  const controller = new AbortController();

  const fetchCategories = async () => {
    setAssessmentLoading(true);
    setAssessmentError(null);
    try {
      const response = await onboardingService.getAssessmentCategories();
      setAssessmentCategories(response.data);
    } catch (err: any) {
      setAssessmentError(err?.message || 'فشل تحميل فئات التقييم');
    } finally {
      setAssessmentLoading(false);
    }
  };

  fetchCategories();
  return () => controller.abort();
}, [currentView]);
```

### Step 4: Update AssessmentView to use dynamic categories

In `AssessmentView`, replace hardcoded `currentCategory = assessmentCategories[currentAssessmentStep]` with dynamic mapping. Since `assessmentCategories` is now state, the same line works but sources from API data.

Update tab rendering:
- Map over `assessmentCategories` instead of hardcoded array.
- Resolve icon via `getIcon(cat.icon)`.
- Use `cat.color` for styling.

### Step 5: Render questions dynamically by type

Inside the form card, replace the three static question blocks with:

```tsx
{currentCategory.questions.map((q) => (
  <div key={q.id} className="p-6 bg-gray-50 rounded-lg">
    <label className="block font-medium mb-4">{q.questionText}</label>
    {q.questionType === 'SCALE' && (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setAnswer(q.id, num)}
            className={`flex-1 h-12 border-2 rounded-lg font-medium ${selected === num ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            {num}
          </button>
        ))}
      </div>
    )}
    {q.questionType === 'YES_NO' && (
      <div className="flex gap-3">
        {['نعم', 'لا'].map((label) => (
          <button
            key={label}
            onClick={() => setAnswer(q.id, label === 'نعم' ? 'yes' : 'no')}
            className={`flex-1 px-6 py-3 border-2 rounded-lg font-medium ${selected === (label === 'نعم' ? 'yes' : 'no') ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            {label}
          </button>
        ))}
      </div>
    )}
    {q.questionType === 'MULTIPLE_CHOICE' && (
      <div className="space-y-2">
        {(q.options?.choices || []).map((choice) => (
          <label key={choice} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={selectedAnswers.includes(choice)}
              onChange={(e) => toggleChoice(q.id, choice, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
    )}
    {q.questionType === 'FILE_UPLOAD' && (
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
        <input type="file" className="hidden" id={`file-${q.id}`} onChange={(e) => setFile(q.id, e.target.files?.[0] || null)} />
        <label htmlFor={`file-${q.id}`} className="cursor-pointer text-blue-700 font-medium">
          اختر ملف أو اسحبه هنا
        </label>
      </div>
    )}
    {/* Unrecognized type fallback */}
    {!['SCALE','YES_NO','MULTIPLE_CHOICE','FILE_UPLOAD'].includes(q.questionType) && (
      <p className="text-sm text-gray-500">نوع السؤال غير مدعوم</p>
    )}
  </div>
))}
```

### Step 6: Update answer helpers

Adapt `assessmentAnswers` state to store per-question answers keyed by question ID:

```tsx
const setAnswer = (questionId: string, value: any) => {
  setAssessmentAnswers((prev) => {
    const next = prev.filter((a) => a.questionId !== questionId);
    next.push({ categoryId: currentCategory.id, questionId, answer: value });
    return next;
  });
};
```

### Step 7: Loading and empty states

Add to `AssessmentView` before the form:

```tsx
{assessmentLoading && (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
)}

{!assessmentLoading && assessmentCategories.length === 0 && (
  <div className="text-center py-12 text-gray-500">
    لا توجد فئات تقييم متاحة حالياً.
  </div>
)}
```

## Testing Checklist

- [ ] API returns 2 categories → 2 tabs rendered dynamically
- [ ] SCALE question renders 5 clickable buttons (1-5)
- [ ] YES_NO question renders نعم / لا buttons
- [ ] MULTIPLE_CHOICE question renders checkboxes from `options.choices`
- [ ] FILE_UPLOAD question renders drag-and-drop zone
- [ ] Unknown questionType shows placeholder without crashing
- [ ] Empty `options.choices` shows empty-options message
- [ ] Answers stored by `questionId`
- [ ] Loading spinner shown while fetching
- [ ] 401 redirects to login
- [ ] No hardcoded categories remain in assessment screen
- [ ] Build passes with 0 errors
