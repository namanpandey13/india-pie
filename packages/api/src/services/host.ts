import type { ApiResult, CreatorProfile, CreatorSubmission, HostDraft, HostProfile } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import {
  selectActiveCreatorTemplates,
  selectCreatorById,
  selectCreatorCredentialsByCreatorId,
  selectCreatorLinksByCreatorId,
} from '../queries/creators';
import { fail, ok } from '../result';
import {
  mapCreatorProfile,
  mapHostProfile,
} from './event-mappers';

export async function listCreatorTemplates() {
  const client = getApiClient();

  if (!client) {
    return fail<string[]>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectActiveCreatorTemplates(client);

    if (error) {
      return fail<string[]>('creatorTemplatesUnavailable', error.message ?? 'Could not load creator templates.', true);
    }

    return ok((data ?? []).map((template) => template.label));
  } catch {
    return fail<string[]>('creatorTemplatesUnavailable', 'Could not load creator templates.', true);
  }
}

export function createHostDraft(input: HostDraft): ApiResult<HostDraft & { id: string; status: 'draft' }> {
  try {
    return ok({
      id: `draft-${input.template.replace(/\s+/g, '-')}`,
      ...input,
      status: 'draft' as const,
    });
  } catch {
    return fail<HostDraft & { id: string; status: 'draft' }>('draftFailed', 'Could not create this creator draft.', true);
  }
}

export async function getHostProfile(hostId: string) {
  const client = getApiClient();

  if (!client) {
    return fail<HostProfile | null>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const [{ data: creator, error }, linksResult, credentialsResult] = await Promise.all([
      selectCreatorById(client, hostId),
      selectCreatorLinksByCreatorId(client, hostId),
      selectCreatorCredentialsByCreatorId(client, hostId),
    ]);

    if (error || linksResult.error || credentialsResult.error) {
      return fail<HostProfile | null>(
        'creatorUnavailable',
        error?.message ?? linksResult.error?.message ?? credentialsResult.error?.message ?? 'Could not load this creator.',
        true,
      );
    }

    return ok<HostProfile | null>(creator ? mapHostProfile(creator, linksResult.data ?? [], credentialsResult.data ?? []) : null);
  } catch {
    return fail<HostProfile | null>('creatorUnavailable', 'Could not load this creator.', true);
  }
}

export async function getCreatorProfile(creatorId: string): Promise<ApiResult<CreatorProfile | null>> {
  const client = getApiClient();

  if (!client) {
    return fail<CreatorProfile | null>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  const [{ data: creator, error }, linksResult, credentialsResult] = await Promise.all([
    selectCreatorById(client, creatorId),
    selectCreatorLinksByCreatorId(client, creatorId),
    selectCreatorCredentialsByCreatorId(client, creatorId),
  ]);

  if (error || linksResult.error || credentialsResult.error || !creator) {
    return fail<CreatorProfile | null>('creatorUnavailable', error?.message ?? 'Could not load this creator.', true);
  }

  return ok<CreatorProfile | null>(mapCreatorProfile(creator, linksResult.data ?? [], credentialsResult.data ?? []));
}

export async function createCreatorSubmission(input: Omit<CreatorSubmission, 'id' | 'status'>) {
  try {
    return ok<CreatorSubmission>({
      ...input,
      id: `creator-submission-${Date.now()}`,
      status: 'draft',
    });
  } catch {
    return fail<CreatorSubmission>('creatorSubmissionFailed', 'Could not create this creator submission.', true);
  }
}

export async function submitCreatorEvent(input: CreatorSubmission) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<CreatorSubmission>('authRequired', 'Sign in before submitting a creator plan.', false);
  }

  try {
    return ok<CreatorSubmission>({
      ...input,
      status: 'inReview',
    });
  } catch {
    return fail<CreatorSubmission>('creatorSubmitFailed', 'Could not submit this creator plan.', true);
  }
}
