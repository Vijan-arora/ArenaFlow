// State and side effects for the operations command center: loads the live
// snapshot on mount, refreshes it on an interval, and generates AI briefings
// on demand.
import { useCallback, useEffect, useState } from 'react';

import { ApiError, fetchSnapshot, requestBriefing } from '../../lib/api.js';
import type { OpsBriefing, OpsSnapshot } from '../../lib/api-types.js';
import { getOpsSnapshot, saveOpsSnapshot } from '../../lib/offline-store.js';

/** How often the dashboard re-fetches the live snapshot, in milliseconds. */
const SNAPSHOT_REFRESH_MS = 30_000;

interface UseOperationsResult {
  snapshot: OpsSnapshot | null;
  snapshotError: string | null;
  briefing: OpsBriefing | null;
  isBriefingLoading: boolean;
  briefingError: string | null;
  generateBriefing: () => Promise<void>;
  isOffline: boolean;
  lastKnownTime: string | null;
}

function toMessage(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

/** Manages live snapshot polling and briefing generation for the dashboard. */
export function useOperations(): UseOperationsResult {
  const [snapshot, setSnapshot] = useState<OpsSnapshot | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<OpsBriefing | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [lastKnownTime, setLastKnownTime] = useState<string | null>(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      if (isOffline) {
        const cached = getOpsSnapshot();
        if (cached && active) {
          setSnapshot(cached);
          setLastKnownTime(new Date(cached.generatedAt).toLocaleTimeString());
        }
        return;
      }
      try {
        const next = await fetchSnapshot();
        if (active) {
          setSnapshot(next);
          saveOpsSnapshot(next);
          setSnapshotError(null);
          setLastKnownTime(new Date(next.generatedAt).toLocaleTimeString());
        }
      } catch (caught) {
        if (active) {
          const cached = getOpsSnapshot();
          if (cached) {
            setSnapshot(cached);
            setLastKnownTime(new Date(cached.generatedAt).toLocaleTimeString());
            setIsOffline(true);
          } else {
            setSnapshotError(toMessage(caught, 'Unable to load live operations data.'));
          }
        }
      }
    };
    void load();
    const timer = setInterval(() => {
      if (!isOffline) {
        void load();
      }
    }, SNAPSHOT_REFRESH_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isOffline]);

  const generateBriefing = useCallback(async (): Promise<void> => {
    if (isBriefingLoading) {
      return;
    }
    if (isOffline) {
      setBriefingError('Unable to generate a briefing while offline.');
      return;
    }
    setBriefingError(null);
    setIsBriefingLoading(true);
    try {
      setBriefing(await requestBriefing());
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'NETWORK') {
        setIsOffline(true);
      }
      setBriefingError(toMessage(caught, 'Unable to generate a briefing right now.'));
    } finally {
      setIsBriefingLoading(false);
    }
  }, [isBriefingLoading, isOffline]);

  return {
    snapshot,
    snapshotError,
    briefing,
    isBriefingLoading,
    briefingError,
    generateBriefing,
    isOffline,
    lastKnownTime,
  };
}
