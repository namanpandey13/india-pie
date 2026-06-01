import { getCurrentUser } from '@hausy/api';
import { useQuery } from '@tanstack/react-query';

export function useLoginProfile() {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: getCurrentUser,
  });
}
