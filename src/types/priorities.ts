import type {TaskItem} from '@/lib/db/tasks';

/**
 * What the Priorities page needs, shaped by the route
 * (`toPrioritiesPageProps`): the matrix's rows, the plan Move to tracks into
 * and the week the header shows.
 */
export interface PrioritiesPageData {
  /** The active plan's week, or the current ISO week without one */
  periodKey: string;
  /** Every non-done one-off — the rows the page keeps as state */
  tasks: TaskItem[];
  /** The plan Move to tracks into; null: no plan this week yet */
  activePlanId: string | null;
}
