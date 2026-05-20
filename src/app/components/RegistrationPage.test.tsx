import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { RegistrationPage } from './RegistrationPage';
import * as authService from '../services/auth';
import { AuthProvider } from '../hooks/useAuth';

// Mock the auth service
vi.mock('../services/auth', () => ({
  register: vi.fn(),
  AuthError: class AuthError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public code: string,
      public fieldErrors?: Record<string, string[]>
    ) {
      super(message);
      this.name = 'AuthError';
    }
  },
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegistrationPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('RegistrationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('US1: Password field error rendering and highlighting', () => {
    it('renders password backend error under password input and applies red border', async () => {
      const mockedRegister = vi.mocked(authService.register);
      mockedRegister.mockRejectedValue(
        new authService.AuthError(
          'password must contain at least one uppercase letter',
          400,
          'VALIDATION_ERROR',
          { password: ['must contain at least one uppercase letter'] }
        )
      );

      renderPage();

      // Fill form minimally to pass client-side validation
      fireEvent.change(screen.getByPlaceholderText('أحمد'), { target: { value: 'أحمد' } });
      fireEvent.change(screen.getByPlaceholderText('محمد'), { target: { value: 'محمد' } });
      fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('الشركة'), { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
      fireEvent.change(screen.getByLabelText('الدور'), { target: { value: '550e8400-e29b-41d4-a716-446655440010' } });
      const pwInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(pwInputs[0], { target: { value: 'password123' } });
      fireEvent.change(pwInputs[1], { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('checkbox'));

      fireEvent.click(screen.getByText('إنشاء حساب'));

      await waitFor(() => {
        expect(screen.getByText('must contain at least one uppercase letter')).toBeInTheDocument();
      });

      const passwordInput = pwInputs[0];
      expect(passwordInput.className).toContain('border-red-500');
    });
  });

  describe('US2: Role field error rendering and highlighting', () => {
    it('renders role backend error under role select and applies red border', async () => {
      const mockedRegister = vi.mocked(authService.register);
      mockedRegister.mockRejectedValue(
        new authService.AuthError(
          'property roleId should not exist',
          400,
          'VALIDATION_ERROR',
          { roleId: ['should not exist'] }
        )
      );

      renderPage();

      fireEvent.change(screen.getByPlaceholderText('أحمد'), { target: { value: 'أحمد' } });
      fireEvent.change(screen.getByPlaceholderText('محمد'), { target: { value: 'محمد' } });
      fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('الشركة'), { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
      fireEvent.change(screen.getByLabelText('الدور'), { target: { value: '550e8400-e29b-41d4-a716-446655440010' } });
      const pwInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(pwInputs[0], { target: { value: 'Password123' } });
      fireEvent.change(pwInputs[1], { target: { value: 'Password123' } });
      fireEvent.click(screen.getByRole('checkbox'));

      fireEvent.click(screen.getByText('إنشاء حساب'));

      await waitFor(() => {
        expect(screen.getByText('should not exist')).toBeInTheDocument();
      });

      const roleSelect = screen.getByLabelText('الدور') as HTMLSelectElement;
      expect(roleSelect.className).toContain('border-red-500');
    });
  });

  describe('US3: Summary banner shows all messages', () => {
    it('renders top summary with all backend messages including mapped field errors', async () => {
      const mockedRegister = vi.mocked(authService.register);
      mockedRegister.mockRejectedValue(
        new authService.AuthError(
          'password must contain at least one uppercase letter; property roleId should not exist; unknownField is invalid',
          400,
          'VALIDATION_ERROR',
          {
            password: ['must contain at least one uppercase letter'],
            roleId: ['should not exist'],
          }
        )
      );

      renderPage();

      fireEvent.change(screen.getByPlaceholderText('أحمد'), { target: { value: 'أحمد' } });
      fireEvent.change(screen.getByPlaceholderText('محمد'), { target: { value: 'محمد' } });
      fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('الشركة'), { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
      fireEvent.change(screen.getByLabelText('الدور'), { target: { value: '550e8400-e29b-41d4-a716-446655440010' } });
      const pwInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(pwInputs[0], { target: { value: 'password123' } });
      fireEvent.change(pwInputs[1], { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('checkbox'));

      fireEvent.click(screen.getByText('إنشاء حساب'));

      const summary = await waitFor(() =>
        screen.getByText(/password must contain at least one uppercase letter/i)
      );
      expect(summary).toBeInTheDocument();

      // Summary should contain all three messages
      const banner = summary.closest('div');
      expect(banner?.textContent).toContain('should not exist');
      expect(banner?.textContent).toContain('unknownField is invalid');
    });
  });

  describe('US4: Granular field clearing', () => {
    it('clears password error when password is edited but keeps role error', async () => {
      const mockedRegister = vi.mocked(authService.register);
      mockedRegister.mockRejectedValueOnce(
        new authService.AuthError(
          'password must contain at least one uppercase letter; property roleId should not exist',
          400,
          'VALIDATION_ERROR',
          {
            password: ['must contain at least one uppercase letter'],
            roleId: ['should not exist'],
          }
        )
      );

      renderPage();

      fireEvent.change(screen.getByPlaceholderText('أحمد'), { target: { value: 'أحمد' } });
      fireEvent.change(screen.getByPlaceholderText('محمد'), { target: { value: 'محمد' } });
      fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('الشركة'), { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
      fireEvent.change(screen.getByLabelText('الدور'), { target: { value: '550e8400-e29b-41d4-a716-446655440010' } });
      const pwInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(pwInputs[0], { target: { value: 'password123' } });
      fireEvent.change(pwInputs[1], { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('checkbox'));

      fireEvent.click(screen.getByText('إنشاء حساب'));

      // Wait for errors to appear
      await waitFor(() => {
        expect(screen.getByText('must contain at least one uppercase letter')).toBeInTheDocument();
      });

      // Edit password field
      fireEvent.change(pwInputs[0], { target: { value: 'Password123' } });

      // Password error should disappear
      await waitFor(() => {
        expect(screen.queryByText('must contain at least one uppercase letter')).not.toBeInTheDocument();
      });

      // Role error should remain
      expect(screen.getByText('should not exist')).toBeInTheDocument();
    });
  });

  describe('US5: No generic "Fetch error" displayed', () => {
    it('surfaces actual backend messages instead of "Fetch error" for 400 responses', async () => {
      const mockedRegister = vi.mocked(authService.register);
      mockedRegister.mockRejectedValue(
        new authService.AuthError(
          'password must contain at least one uppercase letter',
          400,
          'VALIDATION_ERROR',
          { password: ['must contain at least one uppercase letter'] }
        )
      );

      renderPage();

      fireEvent.change(screen.getByPlaceholderText('أحمد'), { target: { value: 'أحمد' } });
      fireEvent.change(screen.getByPlaceholderText('محمد'), { target: { value: 'محمد' } });
      fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('الشركة'), { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
      fireEvent.change(screen.getByLabelText('الدور'), { target: { value: '550e8400-e29b-41d4-a716-446655440010' } });
      const pwInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(pwInputs[0], { target: { value: 'password123' } });
      fireEvent.change(pwInputs[1], { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('checkbox'));

      fireEvent.click(screen.getByText('إنشاء حساب'));

      await waitFor(() => {
        expect(screen.getByText('must contain at least one uppercase letter')).toBeInTheDocument();
      });

      expect(screen.queryByText(/Fetch error/i)).not.toBeInTheDocument();
    });

    it('shows actual server message for non-400 errors', async () => {
      const mockedRegister = vi.mocked(authService.register);
      mockedRegister.mockRejectedValue(
        new authService.AuthError(
          'Internal server error',
          500,
          'INTERNAL_ERROR'
        )
      );

      renderPage();

      // Fill enough to submit
      fireEvent.change(screen.getByPlaceholderText('أحمد'), { target: { value: 'أحمد' } });
      fireEvent.change(screen.getByPlaceholderText('محمد'), { target: { value: 'محمد' } });
      fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('الشركة'), { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
      fireEvent.change(screen.getByLabelText('الدور'), { target: { value: '550e8400-e29b-41d4-a716-446655440010' } });
      const pwInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(pwInputs[0], { target: { value: 'Password123' } });
      fireEvent.change(pwInputs[1], { target: { value: 'Password123' } });
      fireEvent.click(screen.getByRole('checkbox'));

      fireEvent.click(screen.getByText('إنشاء حساب'));

      await waitFor(() => {
        expect(screen.getByText('Internal server error')).toBeInTheDocument();
      });

      expect(screen.queryByText(/Fetch error/i)).not.toBeInTheDocument();
    });
  });
});
