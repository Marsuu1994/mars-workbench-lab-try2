import {afterEach, describe, expect, it, vi} from 'vitest';
import {MOMENTS, WEEK_KEY, freezeTime} from '../../test/time';
import {getTodayDate} from './dateUtils';
import {
  dumpDayKey,
  dumpTodayKey,
  formatDumpDayLabel,
  formatDumpTime,
  groupEntriesByDay,
  shiftDayKey,
  toDumpPageProps,
} from './dump';

afterEach(() => {
  vi.useRealTimers();
});

describe('dump days', () => {
  it('keys and labels a moment by its Los Angeles day', () => {
    const sundayEvening = new Date(MOMENTS.SUNDAY_LATE);
    expect(dumpDayKey(sundayEvening)).toBe('2026-10-18');
    expect(formatDumpDayLabel(sundayEvening)).toBe('Sun, Oct 18');
    expect(formatDumpTime(sundayEvening)).toBe('22:30');
  });

  it("today's key is the Los Angeles day", () => {
    freezeTime(MOMENTS.SUNDAY_LATE);
    expect(dumpTodayKey()).toBe('2026-10-18');
  });

  it.each([
    ['2026-10-31', 1, '2026-11-01'],
    ['2026-11-01', -1, '2026-10-31'],
    ['2026-03-08', 1, '2026-03-09'],
    ['2026-01-01', -1, '2025-12-31'],
  ])('shifts %s by %i day to %s', (key, days, shifted) => {
    expect(shiftDayKey(key, days)).toBe(shifted);
  });
});

describe('groupEntriesByDay', () => {
  it('groups newest-first entries into contiguous days', () => {
    const entries = [
      {id: 'monday-late', createdAt: new Date('2026-10-13T06:00:00Z')},
      {id: 'monday', createdAt: new Date('2026-10-12T19:00:00Z')},
      {id: 'sunday', createdAt: new Date(MOMENTS.SUNDAY_NOON)},
    ];
    const groups = groupEntriesByDay(entries);
    expect(
      groups.map(({key, dateLabel, entries: dayEntries}) => [
        key,
        dateLabel,
        dayEntries.map(({id}) => id),
      ]),
    ).toEqual([
      ['2026-10-12', 'Mon, Oct 12', ['monday-late', 'monday']],
      ['2026-10-18', 'Sun, Oct 18', ['sunday']],
    ]);
  });
});

describe('toDumpPageProps', () => {
  const entries = [
    {
      id: 'sunday',
      content: 'Book the dentist',
      createdAt: new Date(MOMENTS.SUNDAY_NOON),
    },
  ];

  it("seeds the page with the first feed page, the total and today's week", () => {
    // Sunday evening in Los Angeles is already Monday in UTC
    freezeTime(MOMENTS.SUNDAY_LATE);
    expect(
      toDumpPageProps(
        {data: {entries, nextCursor: 'next-page'}},
        21,
        getTodayDate(),
      ),
    ).toEqual({
      entries,
      nextCursor: 'next-page',
      totalCount: 21,
      periodKey: WEEK_KEY,
    });
  });

  it('falls back to an empty feed when the page failed', () => {
    freezeTime(MOMENTS.SUNDAY_LATE);
    expect(
      toDumpPageProps(
        {error: {formErrors: ['failed'], fieldErrors: {}}},
        3,
        getTodayDate(),
      ),
    ).toEqual({
      entries: [],
      nextCursor: null,
      totalCount: 3,
      periodKey: WEEK_KEY,
    });
  });
});
