import { describe, it, expect } from 'vitest';
import { getDisplayName } from './getDisplayName';
import type { UserProfile } from '../types/auth';

describe('getDisplayName', () => {
  it('returns fallback when user is null', () => {
    const result = getDisplayName(null);
    expect(result).toEqual({ name: 'User', initials: 'U' });
  });

  it('returns fallback when user has no name and no email', () => {
    const user: UserProfile = { id: '1', email: '' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'User', initials: 'U' });
  });

  it('composes full name and initials when firstName and lastName are present', () => {
    const user: UserProfile = { id: '1', email: 'test@test.com', firstName: 'John', lastName: 'Doe' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'John Doe', initials: 'J D' });
  });

  it('returns firstName and its initial when only firstName is present', () => {
    const user: UserProfile = { id: '1', email: 'test@test.com', firstName: 'Jane' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'Jane', initials: 'J' });
  });

  it('returns lastName and its initial when only lastName is present', () => {
    const user: UserProfile = { id: '1', email: 'test@test.com', lastName: 'Smith' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'Smith', initials: 'S' });
  });

  it('returns email when firstName and lastName are empty strings', () => {
    const user: UserProfile = { id: '1', email: 'alice@rushd.ai', firstName: '', lastName: '' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'alice@rushd.ai', initials: 'a' });
  });

  it('returns email when only email is present', () => {
    const user: UserProfile = { id: '1', email: 'bob@rushd.ai' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'bob@rushd.ai', initials: 'b' });
  });

  it('returns fallback when email is empty and names are missing', () => {
    const user: UserProfile = { id: '1', email: '', firstName: '', lastName: '' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'User', initials: 'U' });
  });

  it('trims whitespace from name fields before composing', () => {
    const user: UserProfile = { id: '1', email: 'test@test.com', firstName: '  John  ', lastName: '  Doe  ' };
    const result = getDisplayName(user);
    expect(result).toEqual({ name: 'John Doe', initials: 'J D' });
  });
});
