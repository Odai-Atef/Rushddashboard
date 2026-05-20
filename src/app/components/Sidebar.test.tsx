import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Sidebar } from '../components/Sidebar';

const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Sidebar User Identity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user name and email when authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'alice@rushd.ai', firstName: 'Alice', lastName: 'Smith' },
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <Sidebar activeView="executive" />
      </MemoryRouter>
    );

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@rushd.ai')).toBeInTheDocument();
    expect(screen.getByText('A S')).toBeInTheDocument();
  });

  it('renders fallback when user data is missing', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <Sidebar activeView="executive" />
      </MemoryRouter>
    );

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders loading placeholders while auth state is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <Sidebar activeView="executive" />
      </MemoryRouter>
    );

    // Should show skeleton placeholders (animate-pulse divs), not actual text
    const nameText = screen.queryByText('User');
    expect(nameText).toBeNull();

    // The initials circle should be empty during loading
    const initialsContainer = screen.getByText((_, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element?.className?.includes('w-10') &&
        element?.textContent === ''
      );
    });
    expect(initialsContainer).toBeInTheDocument();
  });

  it('renders email when only firstName and lastName are missing', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <Sidebar activeView="executive" />
      </MemoryRouter>
    );

    // Email appears twice (as display name and as email field)
    const emailElements = screen.getAllByText('test@example.com');
    expect(emailElements.length).toBe(2);
    expect(screen.getByText('t')).toBeInTheDocument();
  });
});
