import { getProfile } from '@hausy/api';

export function useLoginProfile() {
  return getProfile('demo-user');
}
