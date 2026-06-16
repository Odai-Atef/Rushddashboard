/**
 * useOnboardingContext hook
 *
 * Thin wrapper around the onboarding context for convenient consumption
 * inside route pages.
 */

import { useContext } from 'react';
import { OnboardingContext, OnboardingContextValue } from '../context/OnboardingContext';

export function useOnboardingContext(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error(
      'useOnboardingContext must be used inside an OnboardingProvider'
    );
  }
  return ctx;
}
