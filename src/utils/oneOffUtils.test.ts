import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

// A Friday in ISO week 28 of 2026, at local midnight like getTodayDate()
const TODAY = new Date(2026, 6, 10);

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'dentist'})];

  it("takes the active plan's id and week", () => {
    expect(
      toPrioritiesPageProps(
        {tasks, activePlan: {id: 'plan', periodKey: '2026-W27'}},
        TODAY,
      ),
    ).toEqual({tasks, activePlanId: 'plan', periodKey: '2026-W27'});
  });

  it("falls back to today's ISO week without an active plan", () => {
    expect(toPrioritiesPageProps({tasks, activePlan: null}, TODAY)).toEqual({
      tasks,
      activePlanId: null,
      periodKey: '2026-W28',
    });
  });
});

describe('groupTasksByQuadrant', () => {
  it('groups by quadrant in the order given, a missing quadrant into Schedule', () => {
    const urgent = buildTask({
      id: 'urgent',
      quadrant: PriorityQuadrant.DO_FIRST,
    });
    const later = buildTask({id: 'later', quadrant: PriorityQuadrant.SCHEDULE});
    const legacy = buildTask({id: 'legacy', quadrant: null});
    const soon = buildTask({id: 'soon', quadrant: PriorityQuadrant.SCHEDULE});

    expect(groupTasksByQuadrant([urgent, later, legacy, soon])).toEqual({
      [PriorityQuadrant.DO_FIRST]: [urgent],
      [PriorityQuadrant.SCHEDULE]: [later, legacy, soon],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: [],
    });
  });
});

describe('isTrackedTask', () => {
  it('is true only on the active plan', () => {
    expect(isTrackedTask({planId: 'plan'}, 'plan')).toBe(true);
    expect(isTrackedTask({planId: 'last-week'}, 'plan')).toBe(false);
    expect(isTrackedTask({planId: null}, 'plan')).toBe(false);
  });

  it('is false without an active plan', () => {
    expect(isTrackedTask({planId: null}, null)).toBe(false);
    expect(isTrackedTask({planId: 'last-week'}, null)).toBe(false);
  });
});
