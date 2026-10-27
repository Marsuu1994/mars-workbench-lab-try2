/**
 * Dump feature constants + client-safe date helpers — shared by the zod schema,
 * the server action's paging, and the composer/feed UI (textarea maxLength,
 * skeletons, day grouping) — and the Dump page's route adapter.
 */
import type {DumpEntryItem} from '@/lib/db/dumpEntries';
import {
  KANBAN_TZ,
  formatDayLabel,
  formatKanbanISODate,
  getISOWeekKey,
} from './dateUtils';

export const DUMP_PAGE_SIZE = 20;
export const DUMP_ENTRY_MAX_LENGTH = 10000;

/** One page of the feed, newest first; nextCursor null = end of history. */
interface DumpFeedPage {
  entries: DumpEntryItem[];
  nextCursor: string | null;
}

/** The feed the page opens on: its first page and the total entry count. */
export interface InitialDumpFeed extends DumpFeedPage {
  totalCount: number;
}

/** What the Dump page renders from: the opening feed and the header's week. */
export interface DumpPageData extends InitialDumpFeed {
  periodKey: string;
}

const EMPTY_FEED_PAGE: DumpFeedPage = {entries: [], nextCursor: null};

/**
 * The Dump route's adapter: the first-page action result, the total count and
 * today → the page's props. Dump is plan-independent, so the header badge is
 * just today's ISO week. The cursorless first page can only succeed; its
 * (unreachable) error branch opens on an empty feed so the types stay honest.
 */
export function toDumpPageProps(
  feed: {data: DumpFeedPage} | {error: unknown},
  totalCount: number,
  today: Date,
): DumpPageData {
  const {entries, nextCursor} = 'data' in feed ? feed.data : EMPTY_FEED_PAGE;
  return {entries, nextCursor, totalCount, periodKey: getISOWeekKey(today)};
}

const pad2 = (value: number) => String(value).padStart(2, '0');

// All feed dates are rendered in the app's canonical timezone so day grouping
// and "Today"/"Yesterday" are stable regardless of the client's local offset.
const timeFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: KANBAN_TZ,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** KANBAN-tz calendar day key, e.g. "2026-07-16". */
export function dumpDayKey(date: Date): string {
  return formatKanbanISODate(date);
}

/** KANBAN-tz weekday + date label, e.g. "Wed, Jul 16". */
export function formatDumpDayLabel(date: Date): string {
  return formatDayLabel(date);
}

/** KANBAN-tz 24h time, e.g. "09:42". */
export function formatDumpTime(date: Date): string {
  return timeFmt.format(date);
}

/** Today's day key in KANBAN tz (compared against group keys for the header). */
export function dumpTodayKey(): string {
  return formatKanbanISODate(new Date());
}

/** Shift a "YYYY-MM-DD" key by whole days — DST-immune calendar arithmetic. */
export function shiftDayKey(key: string, days: number): string {
  const [year, month, day] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day + days));
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

export interface DumpDayGroup<T> {
  key: string;
  dateLabel: string;
  entries: T[];
}

/**
 * Bucket entries (already newest-first) into contiguous day groups, preserving
 * order. The header's "Today"/"Yesterday" wording is the caller's concern
 * (i18n): compare `group.key` against `dumpTodayKey()` / `shiftDayKey(key, -1)`.
 */
export function groupEntriesByDay<T extends {createdAt: Date}>(
  entries: T[],
): DumpDayGroup<T>[] {
  const groups: DumpDayGroup<T>[] = [];
  let current: DumpDayGroup<T> | null = null;
  for (const entry of entries) {
    const key = dumpDayKey(entry.createdAt);
    if (!current || current.key !== key) {
      current = {
        key,
        dateLabel: formatDumpDayLabel(entry.createdAt),
        entries: [],
      };
      groups.push(current);
    }
    current.entries.push(entry);
  }
  return groups;
}
