import type {TaskItem} from '@/lib/db/tasks';

/**
 * What the Priorities page needs, shaped by its route: the week its header
 * shows, the open one-offs — the rows the page keeps as state and patches
 * optimistically — and the plan Track moves a card onto (null: no plan this
 * week yet).
 */
export interface PrioritiesPageData {
  periodKey: string;
  tasks: TaskItem[];
  activePlanId: string | null;
}
