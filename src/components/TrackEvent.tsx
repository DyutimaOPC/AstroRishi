'use client';

import { useEffect } from 'react';
import { track } from './Analytics';

/**
 * Fires one standard Meta event on mount. `eventId` must match what the server
 * sends to the Conversions API so the pair is deduplicated, not double-counted.
 */
export function TrackEvent({ name, params, eventId }: {
  name: string; params?: Record<string, unknown>; eventId?: string;
}) {
  useEffect(() => { track(name, params, eventId); },
    [name, eventId, params]);
  return null;
}
