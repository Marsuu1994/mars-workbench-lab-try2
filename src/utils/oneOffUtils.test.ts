import {afterEach, describe, expect, it, vi} from 'vitest';
import {MOMENTS, WEEK_KEY, freezeTime} from '../../test/time';
import {getTodayDate} from './dateUtils';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';
import {buildTask} from '../../test/buildTask';

afterEach(() => {
  vi.useRealTimers();
});

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'one-off'})];

  it("heads the page with the active plan's week", () => {
    freezeTime(MOMENTS.WEDNESDAY_NOON);
    const activePlan = {id: 'plan', periodKey: '2026-W41'};
    expect(toPrioritiesPageProps({tasks, activePlan}, getTodayDate())).toEqual({
      periodKey: '2026-W41',
      tasks,
      activePlan,
    });
  });

  it("falls back to the kanban day's week without a plan", () => {
    // Sunday evening in Los Angeles is already Monday in UTC
    freezeTime(MOMENTS.SUNDAY_LATE);
    expect(
      toPrioritiesPageProps({tasks, activePlan: null}, getTodayDate()),
    ).toEqual({periodKey: WEEK_KEY, tasks, activePlan: null});
  });
});

describe('groupTasksByQuadrant', () => {
  it('fills every quadrant in order, a null quadrant counting as Schedule', () => {
    const tasks = [
      {id: 'first', quadrant: PriorityQuadrant.DO_FIRST},
      {id: 'unsorted', quadrant: null},
      {id: 'scheduled', quadrant: PriorityQuadrant.SCHEDULE},
      {id: 'second', quadrant: PriorityQuadrant.DO_FIRST},
    ];
    const ids = Object.fromEntries(
      Object.entries(groupTasksByQuadrant(tasks)).map(
        ([quadrant, quadrantTasks]) => [
          quadrant,
          quadrantTasks.map(({id}) => id),
        ],
      ),
    );
    expect(ids).toEqual({
      [PriorityQuadrant.DO_FIRST]: ['first', 'second'],
      [PriorityQuadrant.SCHEDULE]: ['unsorted', 'scheduled'],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: [],
    });
  });
});

describe('isTrackedTask', () => {
  it.each([
    ['on the active plan', 'plan', 'plan', true],
    ['on another plan', 'last-plan', 'plan', false],
    ['on no plan', null, 'plan', false],
    ['without an active plan', null, null, false],
  ])('%s → %s', (_label, planId, activePlanId, isTracked) => {
    expect(isTrackedTask({planId}, activePlanId)).toBe(isTracked);
  });
});
