import type {DumpEntryItem} from '@/lib/db/dumpEntries';

/**
 * What the Dump page starts from: the week its header shows (the current ISO
 * week; Dump is plan-independent), the feed's first page and where the next
 * one starts (null: end of history), and the total for the title bar. The
 * page keeps the feed as client state from here (useDumpFeed).
 */
export interface DumpPageData {
  periodKey: string;
  initialEntries: DumpEntryItem[];
  initialNextCursor: string | null;
  initialTotalCount: number;
}
