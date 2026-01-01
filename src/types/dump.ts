import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/** One page of the dump feed: newest-first entries and the opaque cursor to
    the next page (null: end of history). */
export interface DumpFeedPage {
  entries: DumpEntryItem[];
  nextCursor: string | null;
}

/**
 * What the Dump page needs: the header's week, and the feed's first page and
 * total count, which the page keeps as client state from there on (capture
 * prepends, load-more appends).
 */
export interface DumpPageData {
  periodKey: string;
  initialEntries: DumpEntryItem[];
  initialNextCursor: string | null;
  initialTotalCount: number;
}
