import { listPlanInboxThreads } from '@hausy/api';
import { useQuery } from '@tanstack/react-query';

export function useChatOverview() {
  const threadsQuery = useQuery({
    queryKey: ['plan-inbox-threads'],
    queryFn: listPlanInboxThreads,
  });

  return {
    error: threadsQuery.data?.error ?? null,
    isLoading: threadsQuery.isLoading,
    threads: threadsQuery.data?.data ?? [],
  };
}
