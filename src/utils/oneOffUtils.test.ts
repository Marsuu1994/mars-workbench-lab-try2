import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {PriorityQuadrant} from './enums';
import {
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

const ACTIVE_PLAN = {id: 'plan-w28', periodKey: '2026-W28'};

describe('toPrioritiesPageProps', () => {
  const tasks = [buildTask({id: 'dentist', planId: null})];

  it("shows the active plan's week and passes its id", () => {
    expect(
      toPrioritiesPageProps(
        {tasks, activePlan: ACTIVE_PLAN},
        new Date(2026, 9, 27),
      ),
    ).toEqual({periodKey: '2026-W28', tasks, activePlanId: 'plan-w28'});
  });

  it("falls back to today's ISO week without a plan", () => {
    expect(
      toPrioritiesPageProps({tasks, activePlan: null}, new Date(2026, 6, 10)),
    ).toEqual({periodKey: '2026-W28', tasks, activePlanId: null});
  });

  it('takes the ISO week of the Thursday across a year boundary', () => {
    const {periodKey} = toPrioritiesPageProps(
      {tasks, activePlan: null},
      new Date(2027, 0, 1),
    );
    expect(periodKey).toBe('2026-W53');
  });
});

describe('groupTasksByQuadrant', () => {
  it('groups by quadrant, keeping the order given, every quadrant present', () => {
    const tasks = [
      buildTask({id: 'gift', quadrant: PriorityQuadrant.DO_FIRST}),
      buildTask({id: 'gym', quadrant: PriorityQuadrant.SCHEDULE}),
      buildTask({id: 'dentist', quadrant: PriorityQuadrant.DO_FIRST}),
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
      [PriorityQuadrant.DO_FIRST]: ['gift', 'dentist'],
      [PriorityQuadrant.SCHEDULE]: ['gym'],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: [],
    });
  });

  it('puts a task with no quadrant into Schedule', () => {
    const legacy = buildTask({id: 'legacy', quadrant: null});

    expect(groupTasksByQuadrant([legacy])[PriorityQuadrant.SCHEDULE]).toEqual([
      legacy,
    ]);
  });
});

describe('isTrackedTask', () => {
  it("is tracked on this week's plan", () => {
    expect(isTrackedTask({planId: 'plan-w28'}, 'plan-w28')).toBe(true);
  });

  it('is not tracked on the matrix only', () => {
    expect(isTrackedTask({planId: null}, 'plan-w28')).toBe(false);
  });

  it("is not tracked on last week's plan", () => {
    expect(isTrackedTask({planId: 'plan-w27'}, 'plan-w28')).toBe(false);
  });

  it('is not tracked when there is no plan this week', () => {
    expect(isTrackedTask({planId: 'plan-w27'}, null)).toBe(false);
    expect(isTrackedTask({planId: null}, null)).toBe(false);
  });
});
