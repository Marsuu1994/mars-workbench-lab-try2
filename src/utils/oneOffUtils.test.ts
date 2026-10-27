import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

describe('groupTasksByQuadrant', () => {
  it('groups by quadrant in the order given, a quadrant-less task under Schedule', () => {
    const tasks = [
      buildTask({id: 'later', quadrant: PriorityQuadrant.MAYBE_LATER}),
      buildTask({id: 'first', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'unsorted', quadrant: null}),
      buildTask({id: 'schedule', quadrant: PriorityQuadrant.SCHEDULE}),
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
      [PriorityQuadrant.DO_FIRST]: ['first'],
      [PriorityQuadrant.SCHEDULE]: ['unsorted', 'schedule'],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: ['later'],
    });
  });
});

describe('isTrackedTask', () => {
  it("is tracked only on this week's active plan", () => {
    expect(isTrackedTask({planId: 'plan-w43'}, 'plan-w43')).toBe(true);
    expect(isTrackedTask({planId: 'plan-w42'}, 'plan-w43')).toBe(false);
    expect(isTrackedTask({planId: null}, 'plan-w43')).toBe(false);
    expect(isTrackedTask({planId: null}, null)).toBe(false);
  });
});

describe('toPrioritiesPageProps', () => {
  const today = new Date(2026, 9, 21);
  const tasks = [buildTask({id: 'one-off'})];

  it("shows the active plan's week", () => {
    const activePlan = {id: 'plan-w42', periodKey: '2026-W42'};
    expect(toPrioritiesPageProps({tasks, activePlan}, today)).toEqual({
      periodKey: '2026-W42',
      tasks,
      activePlan,
    });
  });

  it("falls back to today's ISO week without a plan", () => {
    expect(toPrioritiesPageProps({tasks, activePlan: null}, today)).toEqual({
      periodKey: '2026-W43',
      tasks,
      activePlan: null,
    });
  });
});
