import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SettingsPage } from './SettingsPage';
import { AuthProvider } from '../hooks/useAuth';

// Mock auth utilities so we control localStorage state
const localStorageMock = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

function renderPage(userData?: Record<string, unknown>) {
  localStorageMock.clear();
  if (userData) {
    localStorageMock.setItem('rushd_user', JSON.stringify(userData));
    localStorageMock.setItem('rushd_access_token', 'mock-token');
  }
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('US1: View own profile on settings page', () => {
    it('displays authenticated user firstName, lastName, and email', async () => {
      renderPage({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Acme Corp',
      });

      // Wait for auth restoration to finish (loading dots removed)
      await waitFor(() => {
        expect(screen.queryByText('...')).not.toBeInTheDocument();
      });

      // Email input should be visible
      const emailInput = screen.getByDisplayValue('test@example.com') as HTMLInputElement;
      expect(emailInput).toBeInTheDocument();

      // firstName and lastName should be visible
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });

    it('displays companyName after switching to company section', async () => {
      renderPage({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Acme Corp',
      });

      // Wait for auth restoration to finish
      await waitFor(() => {
        expect(screen.queryByText('...')).not.toBeInTheDocument();
      });

      // Switch to company section
      const companyNavButton = screen.getByText('إعدادات الشركة');
      fireEvent.click(companyNavButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
      });
    });

    it('does not show hardcoded placeholder/demo text in profile fields', async () => {
      renderPage({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Acme Corp',
      });

      await waitFor(() => {
        expect(screen.queryByText('...')).not.toBeInTheDocument();
      });

      // No Arabic demo text
      expect(screen.queryByDisplayValue('أحمد')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('محمد')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('ahmed@rushd.ai')).not.toBeInTheDocument();
      // company section not active, but still shouldn't exist
      expect(screen.queryByDisplayValue('شركة الرشد للاستثمار')).not.toBeInTheDocument();
    });
  });

  describe('US2: Handle partial or missing data gracefully', () => {
    it('renders without errors when only id and email are present', async () => {
      renderPage({
        id: 'user-1',
        email: 'test@example.com',
      });

      await waitFor(() => {
        expect(screen.queryByText('...')).not.toBeInTheDocument();
      });

      // Should still render settings sections (company section is navigable via button)
      expect(screen.getByRole('heading', { name: 'الملف الشخصي' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'إعدادات الشركة' })).toBeInTheDocument();
      // Email should be shown
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('shows empty inputs for optional missing fields', async () => {
      renderPage({
        id: 'user-1',
        email: 'test@example.com',
      });

      await waitFor(() => {
        expect(screen.queryByText('...')).not.toBeInTheDocument();
      });

      // Optional fields should be empty (defaultValue empty string)
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      // At least firstName, lastName, and phone should be empty
      const emptyInputs = inputs.filter((i) => !i.value);
      expect(emptyInputs.length).toBeGreaterThanOrEqual(2);
    });
  });
});
