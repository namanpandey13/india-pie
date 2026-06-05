import { getProfile, updateProfile } from '@hausy/api';
import type { LoginProfile } from '@hausy/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
  const updateMutation = useMutation({
    mutationFn: (input: Partial<LoginProfile>) => updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    ...profileQuery,
    saveProfile: (input: Partial<LoginProfile>) => updateMutation.mutate(input),
    saveResult: updateMutation.data,
    saving: updateMutation.isPending,
  };
}
