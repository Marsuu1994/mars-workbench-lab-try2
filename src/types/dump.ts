import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/** One page of the dump feed, newest first; a null cursor: no older page. */
export interface DumpFeedPage {
  entries: DumpEntryItem[];
  nextCursor: string | null;
}

/**
 * What the Dump page starts from, shaped by its route: the header's week
 * (Dump is plan-independent, so the current ISO week), the feed's first page
 * and the total the title bar counts from. The page keeps the feed as state.
 */
export interface DumpPageProps {
  periodKey: string;
  initialEntries: DumpEntryItem[];
  initialNextCursor: string | null;
  initialTotalCount: number;
}
