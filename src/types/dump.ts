import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/** One page of the feed: its entries, newest first, and the cursor of the
    next (null: the end of history). */
export interface DumpFeedPage {
  entries: DumpEntryItem[];
  nextCursor: string | null;
}

/**
 * What the Dump page needs: the week its header shows, and the feed's first
 * page and total count — the seed the page keeps as client state (capture
 * prepends, load more appends).
 */
export interface DumpPageData {
  periodKey: string;
  initialEntries: DumpEntryItem[];
  initialNextCursor: string | null;
  initialTotalCount: number;
}
