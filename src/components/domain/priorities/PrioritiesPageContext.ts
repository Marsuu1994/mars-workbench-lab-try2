import {createContext, use} from 'react';
import type {TaskItem} from '@/lib/db/tasks';
import type {PriorityQuadrant} from '@/utils/enums';
import type {TrackTargetStatus} from '@/schemas';

/**
 * What the Priorities page's components read and do without threading it
 * through props: the week tracking lands on, which card's Move-to popover is
 * open, and every write and overlay, bound to the page's optimistic tasks.
 * `PrioritiesPage` provides it; the tasks still come down as props.
 */
export interface PrioritiesPageContextValue {
  /** The plan tracking lands on; null: no plan this week yet (the column
      rows disable, Done stays live) */
  activePlanId: string | null;
  /** The card whose desktop Move-to popover is open; null: none */
  openPopoverTaskId: string | null;
  /** Opens the card's popover, or closes it if it is the open one */
  togglePopover: (taskId: string) => void;
  /** Mobile tap on a card: the Move-to bottom sheet */
  openMoveToSheet: (task: TaskItem) => void;
  /** The add modal: preset to a quadrant (desktop's per-quadrant Add), or
      with its quadrant picker (mobile's global +) */
  openAddTask: (quadrant?: PriorityQuadrant) => void;
  /** Puts the one-off on this week's board, in the given column */
  trackTask: (taskId: string, status: TrackTargetStatus) => void;
  /** Marks the one-off done; the card leaves under an undo toast */
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
