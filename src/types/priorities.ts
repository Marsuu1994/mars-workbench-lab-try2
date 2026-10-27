import type {TaskItem} from '@/lib/db/tasks';

/**
 * What the Priorities page starts from, shaped by its route: the header's
 * week (the active plan's, else the current ISO week), the user's non-DONE
 * one-offs — the rows the page keeps as state and patches optimistically —
 * and the plan Move to tracks into (null: no plan this week yet).
 */
export interface PrioritiesPageProps {
  periodKey: string;
  tasks: TaskItem[];
  activePlanId: string | null;
}
