import { getProfile } from '@hausy/api';
import { useQuery } from '@tanstack/react-query';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}
