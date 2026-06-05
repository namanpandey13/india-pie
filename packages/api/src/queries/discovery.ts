import type { HausyApiClient } from '../client';

export type DiscoveryRow = {
  label: string;
};

export function selectActiveDiscoveryMarkets(client: HausyApiClient) {
  return client
    .from<DiscoveryRow[]>('discoveryMarkets')
    .select('label')
    .eq('active', true)
    .order('position', { ascending: true })
    .limit(1);
}

export function selectActiveDiscoveryTags(client: HausyApiClient) {
  return client
    .from<DiscoveryRow[]>('discoveryTags')
    .select('label')
    .eq('active', true)
    .order('position', { ascending: true });
}
