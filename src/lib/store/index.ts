import { configured } from '@/lib/env';
import { devStore } from './dev';
import { supabaseStore } from './supabase';
import type { Store } from './types';

export * from './types';

/**
 * Supabase when it is configured, a local file otherwise. The rest of the app
 * only ever sees the Store interface, so nothing downstream knows or cares.
 */
export const store: Store = configured.db() ? supabaseStore : devStore;
export const storeKind = (): 'supabase' | 'dev' => (configured.db() ? 'supabase' : 'dev');
