import { getProfile } from '@hausy/api';

export function useProfile() {
  return getProfile('demo-user');
}
