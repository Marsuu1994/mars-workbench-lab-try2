import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/**
 * The feed as the server first sends it — the newest page, the cursor to the
 * next one (null: no more history) and the total — which the page then keeps
 * as client state (`useDumpFeed`).
 */
export interface DumpFeedSeed {
  entries: DumpEntryItem[];
  nextCursor: string | null;
  totalCount: number;
}

/** What the Dump page needs: the feed's seed and the week its header shows. */
export interface DumpPageData extends DumpFeedSeed {
  periodKey: string;
}
