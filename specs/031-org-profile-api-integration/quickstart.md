# Quickstart: Organization Profile API Integration

## Goal

Wire the profile screen (step 2) of `CharityOnboardingFlow` to persist data via the existing onboarding APIs instead of just navigating forward.

## Prerequisites

- Organization registration step (step 1) is functional and returns an `organization` object with an `id`.
- Backend APIs (`POST /profile`, `POST /funding-areas`, `GET /donors/funding-areas`) are deployed and reachable.
- User is authenticated (JWT token in `localStorage`).

## Files to Touch

1. `src/app/components/CharityOnboardingFlow.tsx` — primary changes
2. No new files needed (service and hook already exist)

## Implementation Steps

### Step 1: Import additional hook destructured values

In `CharityOnboardingFlow.tsx`, update the `useOnboardingRegistration()` destructuring to include:

```tsx
const {
  organization,
  fundingAreas,        // NEW
  isLoading,
  isSaving,            // NEW
  error,
  fieldErrors,
  loadOrganization,
  saveOrganization,
  createProfile,       // NEW
  saveFundingAreas,    // NEW
  loadFundingAreas,    // NEW
  clearError,
} = useOnboardingRegistration();
```

### Step 2: Load funding areas when profile view mounts

Add a `useEffect` that calls `loadFundingAreas()` when `currentView === 'profile'`:

```tsx
useEffect(() => {
  if (currentView === 'profile') {
    loadFundingAreas();
  }
}, [currentView, loadFundingAreas]);
```

### Step 3: Replace hardcoded areas with dynamic list

In `ProfileView`, replace the hardcoded Arabic area array with a map over `fundingAreas`:

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  {fundingAreas.map((area) => (
    <label key={area.id} className="...">
      <input
        type="checkbox"
        checked={profileData.areasOfWork.includes(area.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setProfileData({ ...profileData, areasOfWork: [...profileData.areasOfWork, area.id] });
          } else {
            setProfileData({ ...profileData, areasOfWork: profileData.areasOfWork.filter(a => a !== area.id) });
          }
        }}
      />
      <span className="text-sm">{area.name}</span>
    </label>
  ))}
</div>
```

### Step 4: Wire the Next button

Replace the inline `onClick={() => setCurrentView('assessment')}` with an async handler:

```tsx
const handleProfileNext = async () => {
  // Validation
  if (!profileData.overview.trim()) { toast.error('نبذة عن المؤسسة مطلوبة'); return; }
  if (!profileData.targetBeneficiaries.trim()) { toast.error('الفئات المستهدفة مطلوبة'); return; }
  if (!profileData.geographicCoverage) { toast.error('النطاق الجغرافي مطلوب'); return; }
  if (profileData.areasOfWork.length === 0) { toast.error('مجالات العمل مطلوبة'); return; }

  const payload = {
    overview: profileData.overview.trim(),
    targetBeneficiaries: profileData.targetBeneficiaries.trim(),
    geographicCoverage: profileData.geographicCoverage.toUpperCase(),
    employeeCount: profileData.employeeCount ? parseInt(profileData.employeeCount, 10) : undefined,
    volunteerCount: profileData.volunteerCount ? parseInt(profileData.volunteerCount, 10) : undefined,
    activeProjects: profileData.activeProjects ? parseInt(profileData.activeProjects, 10) : undefined,
    areasOfWork: profileData.areasOfWork,
  };

  try {
    await createProfile(payload);
    await saveFundingAreas(profileData.areasOfWork);
    setCurrentView('assessment');
  } catch {
    // Errors are already displayed via hook toast integration
  }
};
```

Update the Next button:
```tsx
<button
  type="button"
  onClick={handleProfileNext}
  disabled={isLoading || isSaving}
  className="..."
>
  التالي
</button>
```

### Step 5: Add loading overlay to profile view

Add a loading indicator when `isLoading || isSaving` is true inside `ProfileView`:

```tsx
{(isLoading || isSaving) && (
  <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
)}
```

## Testing Checklist

- [ ] Fill profile form, click Next → network tab shows `POST /profile` then `POST /funding-areas`
- [ ] Refresh page after reaching assessment → profile data is not lost (can verify by calling `GET /profile`)
- [ ] Leave required fields empty → clicking Next shows validation toast, no API calls
- [ ] Backend returns 404 → user sees Arabic error toast and stays on form
- [ ] Funding areas list loads from API and matches donor funding areas endpoint
- [ ] Duplicate submission is blocked while `isLoading` is true

## Rollback

If issues arise, revert `CharityOnboardingFlow.tsx` to restore the original `setCurrentView('assessment')` inline handler. No backend or hook changes are required for rollback.
