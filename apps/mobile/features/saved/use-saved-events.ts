import { listSavedEvents, toggleSavedEvent } from '@hausy/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSavedEvents() {
  const queryClient = useQueryClient();
  const savedQuery = useQuery({
    queryKey: ['saved-events'],
    queryFn: listSavedEvents,
  });
  const toggleSaved = useMutation({
    mutationFn: (eventId: string) => toggleSavedEvent(eventId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    error: savedQuery.data?.error ?? null,
    isLoading: savedQuery.isLoading,
    savedEvents: savedQuery.data?.data ?? [],
    toggleSaved: (eventId: string) => toggleSaved.mutate(eventId),
  };
}
