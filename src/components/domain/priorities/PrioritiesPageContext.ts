import {createContext, use} from 'react';
import type {TaskItem} from '@/lib/db/tasks';
import type {PriorityQuadrant} from '@/utils/enums';
import type {TrackTargetStatus} from '@/schemas';

/**
 * What the Priorities page's components read and do without threading it
 * through props: the week a one-off tracks into, which card's Move-to
 * popover is open, the overlay openers and the writes, bound to the page's
 * optimistic tasks. `PrioritiesPage` provides it; the rows still come down
 * as props.
 */
export interface PrioritiesPageContextValue {
  /** The plan Move to › Todo tracks into; null: no plan this week yet */
  activePlanId: string | null;
  /** The card whose desktop Move-to popover is open */
  openPopoverTaskId: string | null;
  /** Opens a card's popover, or closes it when it is the open one */
  togglePopover: (taskId: string) => void;
  /** Mobile: a tapped card opens the Move-to bottom sheet */
  openMoveToSheet: (task: TaskItem) => void;
  /** Desktop: a quadrant's Add opens the task modal preset to it */
  openAddTask: (quadrant: PriorityQuadrant) => void;
  trackTask: (taskId: string, status: TrackTargetStatus) => void;
  completeTask: (taskId: string) => void;
}

export const PrioritiesPageContext =
  createContext<PrioritiesPageContextValue | null>(null);

/** The Priorities page's context; only its components render inside it. */
export const usePrioritiesPageContext = (): PrioritiesPageContextValue => {
  const context = use(PrioritiesPageContext);
  if (!context) {
    throw new Error(
      'usePrioritiesPageContext must be used within PrioritiesPage',
    );
  }
  return context;
};
