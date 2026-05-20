import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { TopBar } from '../components/TopBar';

const mockLogout = vi.fn();
const mockNavigate = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TopBar User Identity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders avatar initials derived from user name when authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'bob@rushd.ai', firstName: 'Bob', lastName: 'Jones' },
      isLoading: false,
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <TopBar theme="light" onThemeToggle={() => {}} onMenuClick={() => {}} />
      </MemoryRouter>
    );

    // Avatar initials are visible in the trigger button
    expect(screen.getByText('B J')).toBeInTheDocument();
  });

  it('renders fallback initials when user is null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <TopBar theme="light" onThemeToggle={() => {}} onMenuClick={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders component for user with only email (no name)', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'only@email.com' },
      isLoading: false,
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <TopBar theme="light" onThemeToggle={() => {}} onMenuClick={() => {}} />
      </MemoryRouter>
    );

    // Email initial is rendered in avatar
    expect(screen.getByText('o')).toBeInTheDocument();
  });
});
