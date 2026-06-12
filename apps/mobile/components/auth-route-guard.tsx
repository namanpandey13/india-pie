import { router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthSession } from '@/lib/auth-session';

const PUBLIC_SEGMENTS = new Set(['login']);

export function AuthRouteGuard() {
  const segments = useSegments();
  const { isLoading, isSignedIn } = useAuthSession();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const rootSegment = segments[0];
    const isPublicRoute = rootSegment ? PUBLIC_SEGMENTS.has(rootSegment) : false;

    if (!isSignedIn && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (isSignedIn && isPublicRoute) {
      router.replace('/explore');
    }
  }, [isLoading, isSignedIn, segments]);

  return null;
}
