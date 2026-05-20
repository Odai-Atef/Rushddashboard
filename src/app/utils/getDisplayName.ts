import type { UserProfile } from '../types/auth';

export interface DisplayNameResult {
  name: string;
  initials: string;
}

export function getDisplayName(user: UserProfile | null): DisplayNameResult {
  if (!user) {
    return { name: 'User', initials: 'U' };
  }

  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();
  const email = user.email?.trim();

  if (firstName && lastName) {
    return {
      name: `${firstName} ${lastName}`,
      initials: `${firstName.charAt(0)} ${lastName.charAt(0)}`,
    };
  }

  if (firstName) {
    return {
      name: firstName,
      initials: firstName.charAt(0),
    };
  }

  if (lastName) {
    return {
      name: lastName,
      initials: lastName.charAt(0),
    };
  }

  if (email) {
    return {
      name: email,
      initials: email.charAt(0),
    };
  }

  return { name: 'User', initials: 'U' };
}
