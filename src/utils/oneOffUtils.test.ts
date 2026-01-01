import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {WEEK_KEY} from '../../test/time';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'call-dentist'})];
  // Thursday of the frozen week, as getTodayDate returns it: local midnight
  const thursday = new Date(2026, 9, 15);

  it("heads the page with the active plan's week", () => {
    const activePlan = {id: 'plan', periodKey: '2026-W41'};
    expect(toPrioritiesPageProps({tasks, activePlan}, thursday)).toEqual({
      periodKey: '2026-W41',
      tasks,
      activePlan,
    });
  });

  it('falls back to the current ISO week without a plan', () => {
    expect(toPrioritiesPageProps({tasks, activePlan: null}, thursday)).toEqual({
      periodKey: WEEK_KEY,
      tasks,
      activePlan: null,
    });
  });
});

describe('groupTasksByQuadrant', () => {
  it('splits the tasks into the four cells, each keeping the order given', () => {
    const tasks = [
      buildTask({id: 'urgent', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'someday', quadrant: PriorityQuadrant.MAYBE_LATER}),
      buildTask({id: 'also-urgent', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'quick', quadrant: PriorityQuadrant.SQUEEZE_IN}),
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
      [PriorityQuadrant.DO_FIRST]: ['urgent', 'also-urgent'],
      [PriorityQuadrant.SCHEDULE]: [],
      [PriorityQuadrant.SQUEEZE_IN]: ['quick'],
      [PriorityQuadrant.MAYBE_LATER]: ['someday'],
    });
  });

  it('puts a task without a quadrant in Schedule', () => {
    const task = buildTask({id: 'pre-matrix', quadrant: null});
    expect(groupTasksByQuadrant([task])[PriorityQuadrant.SCHEDULE]).toEqual([
      task,
    ]);
  });
});

describe('isTrackedTask', () => {
  it.each([
    ['on the active plan', true, 'plan', 'plan'],
    ['on another plan', false, 'last-week', 'plan'],
    ['on no plan', false, null, 'plan'],
    ['with no active plan', false, null, null],
  ])('a task %s is tracked: %s', (_label, isTracked, planId, activePlanId) => {
    expect(isTrackedTask(buildTask({id: 'task', planId}), activePlanId)).toBe(
      isTracked,
    );
  });
});
