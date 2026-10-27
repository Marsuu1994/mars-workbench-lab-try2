import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/** One page of the dump feed: newest-first entries and the cursor to the next
 *  page (null: the end of history). */
export interface DumpFeedPage {
  entries: DumpEntryItem[];
  nextCursor: string | null;
}

/**
 * What the Dump page needs, shaped by its route: the header's week and the
 * feed's first page and total — the seed the page keeps as client state
 * (capture prepends, load more appends).
 */
export interface DumpPageData {
  periodKey: string;
  initialEntries: DumpEntryItem[];
  initialNextCursor: string | null;
  initialTotalCount: number;
}
