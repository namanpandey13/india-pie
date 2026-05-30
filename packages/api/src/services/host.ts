import type { ApiResult, CreatorSubmission, HostDraft, HostProfile } from '@hausy/types';
import { fail, ok } from '../result';

export const hostTemplates = ['game night', 'photo walk', 'builders dinner', 'listening party'];

export function createHostDraft(input: HostDraft): ApiResult<HostDraft & { id: string; status: 'draft' }> {
  try {
    return ok({
      id: `draft-${input.template.replace(/\s+/g, '-')}`,
      ...input,
      status: 'draft' as const,
    });
  } catch {
    return fail<HostDraft & { id: string; status: 'draft' }>('draft_failed', 'Could not create this creator draft.', true);
  }
}

export function getHostProfile(hostId: string) {
  try {
    void hostId;
    return ok<HostProfile | null>(null);
  } catch {
    return fail<HostProfile | null>('creator_unavailable', 'Could not load this creator.', true);
  }
}

export function createCreatorSubmission(input: Omit<CreatorSubmission, 'id' | 'status'>) {
  try {
    return ok<CreatorSubmission>({
      ...input,
      id: `creator-submission-${Date.now()}`,
      status: 'draft',
    });
  } catch {
    return fail<CreatorSubmission>('creator_submission_failed', 'Could not create this creator submission.', true);
  }
}

export function submitCreatorEvent(input: CreatorSubmission) {
  try {
    return ok<CreatorSubmission>({
      ...input,
      status: 'in_review',
    });
  } catch {
    return fail<CreatorSubmission>('creator_submit_failed', 'Could not submit this creator plan.', true);
  }
}
