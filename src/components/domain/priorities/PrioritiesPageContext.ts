import {createContext, use} from 'react';
import type {PriorityQuadrant} from '@/utils/enums';
import type {TrackTargetStatus} from '@/schemas';

/**
 * What the Priorities page's components read and do without threading it
 * through props: the week a card can be tracked into, which card's Move-to
 * popover is open, and every write and overlay, bound to the page's
 * optimistic tasks. `PrioritiesPage` provides it; the tasks still come down
 * as props.
 */
export interface PrioritiesPageContextValue {
  /** The plan Track This Week attaches to; null: no plan this week yet */
  activePlanId: string | null;
  /** The card whose desktop Move-to popover is open, if any */
  openPopoverTaskId: string | null;
  /** Opens a card's popover, or closes it when it is the open one */
  togglePopover: (taskId: string) => void;
  /** Mobile tap on a card: the Move-to bottom sheet */
  openMoveToSheet: (taskId: string) => void;
  /** The add-task modal; without a quadrant (mobile) it shows its picker */
  openAddTask: (quadrant?: PriorityQuadrant) => void;
  /** Onto this week's board, in the given column */
  trackTask: (taskId: string, status: TrackTargetStatus) => void;
  /** Marks the task done, with an undo toast */
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
