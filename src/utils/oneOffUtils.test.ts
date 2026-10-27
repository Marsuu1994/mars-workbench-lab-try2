import {describe, expect, it} from 'vitest';
import {buildTask} from '../../test/buildTask';
import {PriorityQuadrant} from './enums';
import {
  FALLBACK_QUADRANT,
  groupTasksByQuadrant,
  isTrackedTask,
  toPrioritiesPageProps,
} from './oneOffUtils';

const oneOff = (id: string, overrides = {}) =>
  buildTask({id, planId: null, ...overrides});

describe('toPrioritiesPageProps', () => {
  const tasks = [oneOff('passport'), oneOff('dentist', {planId: 'w28'})];

  it("shows the active plan's week and tracks into its plan", () => {
    expect(
      toPrioritiesPageProps(
        {tasks, activePlan: {id: 'w28', periodKey: '2026-W28'}},
        new Date(2026, 6, 20),
      ),
    ).toEqual({periodKey: '2026-W28', tasks, activePlanId: 'w28'});
  });

  it("falls back to today's ISO week without an active plan", () => {
    expect(
      toPrioritiesPageProps({tasks, activePlan: null}, new Date(2026, 6, 10)),
    ).toEqual({periodKey: '2026-W28', tasks, activePlanId: null});
  });

  it('takes the ISO week year across New Year', () => {
    const {periodKey} = toPrioritiesPageProps(
      {tasks: [], activePlan: null},
      new Date(2027, 0, 1),
    );
    expect(periodKey).toBe('2026-W53');
  });
});

describe('isTrackedTask', () => {
  it("is true for a one-off on the active plan's week", () => {
    expect(isTrackedTask({planId: 'w28'}, 'w28')).toBe(true);
  });

  it('is false for a one-off on no week', () => {
    expect(isTrackedTask({planId: null}, 'w28')).toBe(false);
    expect(isTrackedTask({planId: null}, null)).toBe(false);
  });

  it("is false for a one-off left on last week's plan", () => {
    expect(isTrackedTask({planId: 'w27'}, 'w28')).toBe(false);
    expect(isTrackedTask({planId: 'w27'}, null)).toBe(false);
  });
});

describe('groupTasksByQuadrant', () => {
  it('lists every quadrant, empty ones included', () => {
    expect(groupTasksByQuadrant([])).toEqual({
      [PriorityQuadrant.DO_FIRST]: [],
      [PriorityQuadrant.SCHEDULE]: [],
      [PriorityQuadrant.SQUEEZE_IN]: [],
      [PriorityQuadrant.MAYBE_LATER]: [],
    });
  });

  it('groups by quadrant, each keeping the order given', () => {
    const tax = oneOff('tax', {quadrant: PriorityQuadrant.DO_FIRST});
    const recipe = oneOff('recipe', {quadrant: PriorityQuadrant.MAYBE_LATER});
    const dentist = oneOff('dentist', {quadrant: PriorityQuadrant.DO_FIRST});
    const landlord = oneOff('landlord', {
      quadrant: PriorityQuadrant.SQUEEZE_IN,
    });

    const tasksByQuadrant = groupTasksByQuadrant([
      tax,
      recipe,
      dentist,
      landlord,
    ]);

    expect(tasksByQuadrant[PriorityQuadrant.DO_FIRST]).toEqual([tax, dentist]);
    expect(tasksByQuadrant[PriorityQuadrant.SCHEDULE]).toEqual([]);
    expect(tasksByQuadrant[PriorityQuadrant.SQUEEZE_IN]).toEqual([landlord]);
    expect(tasksByQuadrant[PriorityQuadrant.MAYBE_LATER]).toEqual([recipe]);
  });

  it('puts a one-off without a quadrant into the fallback quadrant', () => {
    const coach = oneOff('coach', {quadrant: FALLBACK_QUADRANT});
    const legacy = oneOff('legacy', {quadrant: null});

    expect(groupTasksByQuadrant([coach, legacy])[FALLBACK_QUADRANT]).toEqual([
      coach,
      legacy,
    ]);
  });
});
