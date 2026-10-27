import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {PriorityQuadrant} from './enums';
import {
  FALLBACK_QUADRANT,
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

/** A Tuesday in ISO week 44, as getTodayDate returns it: local midnight. */
const TODAY = new Date(2026, 9, 27);

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'call-dentist'})];

  it("shows the active plan's week and tracks into it", () => {
    expect(
      toPrioritiesPageProps(
        {tasks, activePlan: {id: 'plan-w43', periodKey: '2026-W43'}},
        TODAY,
      ),
    ).toEqual({tasks, activePlanId: 'plan-w43', periodKey: '2026-W43'});
  });

  it("falls back to today's ISO week without a plan", () => {
    expect(toPrioritiesPageProps({tasks, activePlan: null}, TODAY)).toEqual({
      tasks,
      activePlanId: null,
      periodKey: '2026-W44',
    });
  });
});

describe('groupTasksByQuadrant', () => {
  it('groups by quadrant, each keeping the order given', () => {
    const tasks = [
      buildTask({id: 'a', quadrant: PriorityQuadrant.MAYBE_LATER}),
      buildTask({id: 'b', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'c', quadrant: PriorityQuadrant.MAYBE_LATER}),
    ];

    const tasksByQuadrant = groupTasksByQuadrant(tasks);

    expect(
      tasksByQuadrant[PriorityQuadrant.DO_FIRST].map(({id}) => id),
    ).toEqual(['b']);
    expect(
      tasksByQuadrant[PriorityQuadrant.MAYBE_LATER].map(({id}) => id),
    ).toEqual(['a', 'c']);
    expect(tasksByQuadrant[PriorityQuadrant.SQUEEZE_IN]).toEqual([]);
  });

  it('puts a task without a quadrant in the fallback one', () => {
    const tasks = [
      buildTask({id: 'scheduled', quadrant: FALLBACK_QUADRANT}),
      buildTask({id: 'legacy', quadrant: null}),
    ];

    expect(
      groupTasksByQuadrant(tasks)[FALLBACK_QUADRANT].map(({id}) => id),
    ).toEqual(['scheduled', 'legacy']);
  });

  it('returns every quadrant, empty ones included', () => {
    expect(groupTasksByQuadrant([])).toEqual({
      [PriorityQuadrant.DO_FIRST]: [],
      [PriorityQuadrant.SCHEDULE]: [],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: [],
    });
  });
});

describe('isTrackedTask', () => {
  it('is tracked when it sits on the active plan', () => {
    expect(isTrackedTask({planId: 'plan-w44'}, 'plan-w44')).toBe(true);
  });

  it('is not tracked on another plan or none', () => {
    expect(isTrackedTask({planId: 'plan-w43'}, 'plan-w44')).toBe(false);
    expect(isTrackedTask({planId: null}, 'plan-w44')).toBe(false);
  });

  it('is never tracked without an active plan', () => {
    expect(isTrackedTask({planId: null}, null)).toBe(false);
    expect(isTrackedTask({planId: 'plan-w43'}, null)).toBe(false);
  });
});
