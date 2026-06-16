# Quickstart: Onboarding Pre-fill on Reload

## Goal

Ensure that when a user reloads the onboarding page, their previously saved registration and profile data is restored from the backend, funding area checkboxes are ticked, and the user lands on the correct step.

## Prerequisites

- `useOnboardingRegistration` hook already provides `organization`, `profile`, `loadOrganization`, `isLoading`
- Backend `GET /api/v1/onboarding/organizations/me` returns org with embedded `profile` and `fundingAreas`
- `CharityOnboardingFlow.tsx` has local states: `registrationData`, `profileData`, `currentView`

## Files to Touch

1. `src/app/components/CharityOnboardingFlow.tsx` — primary changes

## Implementation Steps

### Step 1: Load organization on component mount (not just on registration view)

Currently `loadOrganization()` is only called when `currentView === 'registration'`. Change to call on mount:

```tsx
useEffect(() => {
  loadOrganization();
}, [loadOrganization]);
```

Remove or keep the existing registration-view-only effect as a no-op (the mount effect covers it).

### Step 2: Pre-fill registration form when organization arrives

Add a `useEffect` that pre-fills `registrationData` from `organization`:

```tsx
useEffect(() => {
  if (organization) {
    setRegistrationData({
      orgName: organization.name || '',
      licenseNumber: organization.licenseNumber || '',
      registrationDate: organization.registrationDate
        ? organization.registrationDate.slice(0, 10)
        : '',
      orgType: organization.type ? organization.type.toLowerCase() : '',
      city: organization.city || '',
      website: organization.website || '',
      contactPerson: organization.contactPerson || '',
      email: organization.email || '',
      mobile: organization.mobile || '',
    });
  }
}, [organization]);
```

> Note: The existing pre-fill effect for registration already exists but only fires after `organization` changes. Verify it handles `type.toLowerCase()` correctly.

### Step 3: Pre-fill profile form when embedded profile exists

Add a `useEffect` that pre-fills `profileData` from `organization.profile`:

```tsx
useEffect(() => {
  if (organization?.profile) {
    const p = organization.profile;
    setProfileData({
      overview: p.overview || '',
      targetBeneficiaries: p.targetBeneficiaries || '',
      geographicCoverage: p.geographicCoverage ? p.geographicCoverage.toLowerCase() : '',
      employeeCount: p.employeeCount != null ? String(p.employeeCount) : '',
      volunteerCount: p.volunteerCount != null ? String(p.volunteerCount) : '',
      activeProjects: p.activeProjects != null ? String(p.activeProjects) : '',
      areasOfWork: (p.fundingAreas || []).map((fa) => fa.fundingAreaId).filter(Boolean),
    });
  }
}, [organization?.profile]);
```

### Step 4: Navigate to correct step based on `currentStep`

Add a `useEffect` that sets `currentView` from `organization.currentStep` after data loads:

```tsx
useEffect(() => {
  if (organization?.currentStep) {
    const step = organization.currentStep.toLowerCase();
    const validSteps: ViewType[] = [
      'landing', 'registration', 'profile', 'assessment',
      'documents', 'processing', 'results', 'analysis', 'roadmap', 'decision',
    ];
    if (validSteps.includes(step as ViewType)) {
      setCurrentView(step as ViewType);
    }
  }
}, [organization?.currentStep]);
```

> Ensure this effect does not override manual navigation after initial load. Consider a guard such as only running when `currentView === 'landing'` and `organization` is newly loaded.

### Step 5: Add global loading state on mount

Since `loadOrganization()` now runs on mount, the landing view may briefly flash before data arrives. Wrap the main render or show a loading overlay:

```tsx
if (isLoading && !organization) {
  return (
    <div className="min-h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );
}
```

Or add a loading overlay inside the main render area.

## Testing Checklist

- [ ] Reload page with existing org → registration form pre-filled
- [ ] Reload page with existing org + profile → profile form pre-filled
- [ ] Funding area checkboxes ticked matching `profile.fundingAreas[].fundingAreaId`
- [ ] `currentStep = PROFILE` → lands on profile step directly
- [ ] `currentStep = ASSESSMENT` → lands on assessment step directly
- [ ] New user (404) → empty forms, starts from landing, no errors
- [ ] Loading spinner shown while fetching
- [ ] No console errors
- [ ] `organization.type` correctly lowercased for select matching
- [ ] `geographicCoverage` correctly lowercased for select matching
- [ ] Numeric fields (`employeeCount`, etc.) correctly converted to strings
