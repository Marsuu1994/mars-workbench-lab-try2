import {afterEach, describe, expect, it, vi} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {MOMENTS, WEEK_KEY, freezeTime} from '../../test/time';
import {getTodayDate} from './dateUtils';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

afterEach(() => {
  vi.useRealTimers();
});

describe('isTrackedTask', () => {
  it("is tracked only on the active plan's week", () => {
    expect(isTrackedTask({planId: 'plan-w42'}, 'plan-w42')).toBe(true);
    expect(isTrackedTask({planId: 'plan-w41'}, 'plan-w42')).toBe(false);
    expect(isTrackedTask({planId: null}, 'plan-w42')).toBe(false);
  });

  it('tracks nothing without an active plan', () => {
    expect(isTrackedTask({planId: null}, null)).toBe(false);
  });
});

describe('groupTasksByQuadrant', () => {
  it('fills each quadrant in the order given, a null quadrant under Schedule', () => {
    const tasks = [
      buildTask({id: 'call', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'legacy', quadrant: null}),
      buildTask({id: 'gift', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'plan', quadrant: PriorityQuadrant.SCHEDULE}),
      buildTask({id: 'pottery', quadrant: PriorityQuadrant.MAYBE_LATER}),
    ];
    const idsByQuadrant = Object.fromEntries(
      Object.entries(groupTasksByQuadrant(tasks)).map(
        ([quadrant, quadrantTasks]) => [
          quadrant,
          quadrantTasks.map(({id}) => id),
        ],
      ),
    );
    expect(idsByQuadrant).toEqual({
      [PriorityQuadrant.DO_FIRST]: ['call', 'gift'],
      [PriorityQuadrant.SCHEDULE]: ['legacy', 'plan'],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: ['pottery'],
    });
  });
});

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'call', quadrant: PriorityQuadrant.DO_FIRST})];

  it("shows the active plan's week and tracks into it", () => {
    expect(
      toPrioritiesPageProps(
        {tasks, activePlan: {id: 'plan-w41', periodKey: '2026-W41'}},
        new Date(MOMENTS.WEDNESDAY_NOON),
      ),
    ).toEqual({periodKey: '2026-W41', tasks, activePlanId: 'plan-w41'});
  });

  it("falls back to today's week without an active plan", () => {
    freezeTime(MOMENTS.WEDNESDAY_NOON);
    expect(
      toPrioritiesPageProps({tasks, activePlan: null}, getTodayDate()),
    ).toEqual({periodKey: WEEK_KEY, tasks, activePlanId: null});
  });
});
