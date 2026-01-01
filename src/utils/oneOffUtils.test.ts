import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

const ACTIVE_PLAN_ID = 'plan-w42';
// A Wednesday in ISO week 2026-W42
const TODAY = new Date(2026, 9, 14);

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'call-dentist', planId: null})];

  it("shows the active plan's week", () => {
    const props = toPrioritiesPageProps(
      {tasks, activePlan: {id: 'plan-w41', periodKey: '2026-W41'}},
      TODAY,
    );

    expect(props).toEqual({
      tasks,
      activePlan: {id: 'plan-w41', periodKey: '2026-W41'},
      periodKey: '2026-W41',
    });
  });

  it('falls back to the current ISO week without a plan', () => {
    const props = toPrioritiesPageProps({tasks, activePlan: null}, TODAY);

    expect(props).toEqual({tasks, activePlan: null, periodKey: '2026-W42'});
  });
});

describe('groupTasksByQuadrant', () => {
  it('puts each task in its quadrant, keeping the order given', () => {
    const tasks = [
      buildTask({id: 'a', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'b', quadrant: PriorityQuadrant.MAYBE_LATER}),
      buildTask({id: 'c', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'd', quadrant: PriorityQuadrant.SQUEEZE_IN}),
    ];

    const ids = (quadrantTasks: {id: string}[]) =>
      quadrantTasks.map(({id}) => id);
    const tasksByQuadrant = groupTasksByQuadrant(tasks);

    expect(ids(tasksByQuadrant[PriorityQuadrant.DO_FIRST])).toEqual(['a', 'c']);
    expect(ids(tasksByQuadrant[PriorityQuadrant.SCHEDULE])).toEqual([]);
    expect(ids(tasksByQuadrant[PriorityQuadrant.SQUEEZE_IN])).toEqual(['d']);
    expect(ids(tasksByQuadrant[PriorityQuadrant.MAYBE_LATER])).toEqual(['b']);
  });

  it('groups a task without a quadrant into Schedule', () => {
    const tasks = [
      buildTask({id: 'scheduled', quadrant: PriorityQuadrant.SCHEDULE}),
      buildTask({id: 'unsorted', quadrant: null}),
    ];

    expect(
      groupTasksByQuadrant(tasks)[PriorityQuadrant.SCHEDULE].map(({id}) => id),
    ).toEqual(['scheduled', 'unsorted']);
  });
});

describe('isTrackedTask', () => {
  it('is tracked on the active plan', () => {
    expect(isTrackedTask({planId: ACTIVE_PLAN_ID}, ACTIVE_PLAN_ID)).toBe(true);
  });

  it('is not tracked on the matrix or on last week', () => {
    expect(isTrackedTask({planId: null}, ACTIVE_PLAN_ID)).toBe(false);
    expect(isTrackedTask({planId: 'plan-w41'}, ACTIVE_PLAN_ID)).toBe(false);
  });

  it('is never tracked without an active plan', () => {
    expect(isTrackedTask({planId: null}, null)).toBe(false);
    expect(isTrackedTask({planId: 'plan-w41'}, null)).toBe(false);
  });
});
