import type { HausyApiClient } from '../client';

export type DiscoveryRow = {
  label: string;
};

export function selectActiveDiscoveryMarkets(client: HausyApiClient) {
  return client
    .from<DiscoveryRow[]>('discovery_markets')
    .select('label')
    .eq('active', true)
    .order('position', { ascending: true })
    .limit(1);
}

export function selectActiveDiscoveryTags(client: HausyApiClient) {
  return client
    .from<DiscoveryRow[]>('discovery_tags')
    .select('label')
    .eq('active', true)
    .order('position', { ascending: true });
}
