import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/** One feed page, newest first; `nextCursor` is null at the end of history. */
export interface DumpEntriesPage {
  entries: DumpEntryItem[];
  nextCursor: string | null;
}

/** The feed as the page first renders it: its newest page and the total. */
export interface InitialDumpFeed extends DumpEntriesPage {
  totalCount: number;
}

/**
 * What the Dump page needs, shaped by the route (`toDumpPageProps`): the
 * header's week and the feed the page seeds its client state from.
 */
export interface DumpPageData {
  periodKey: string;
  initialFeed: InitialDumpFeed;
}
