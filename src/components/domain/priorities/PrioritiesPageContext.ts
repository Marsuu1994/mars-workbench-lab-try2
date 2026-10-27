import {createContext, use} from 'react';
import type {TaskItem} from '@/lib/db/tasks';
import type {PriorityQuadrant} from '@/utils/enums';
import type {TrackTargetStatus} from '@/schemas';

/**
 * What the Priorities page's components read and do without threading it
 * through props: the week Move to tracks into, which card's popover is open,
 * and every write and overlay, bound to the page's optimistic tasks.
 * `PrioritiesPage` provides it; the tasks still come down as props.
 */
export interface PrioritiesPageContextValue {
  /** The plan Move to tracks into; null: no plan this week yet */
  activePlanId: string | null;
  /** The card whose desktop Move-to popover is open */
  openPopoverTaskId: string | null;
  /** Opens a card's popover, or closes it when it is the open one */
  togglePopover: (taskId: string) => void;
  /** Mobile's tap on a card: the Move-to bottom sheet */
  openMoveToSheet: (task: TaskItem) => void;
  /** The add modal: preset to a quadrant (desktop), or with its picker */
  openAddTask: (quadrant?: PriorityQuadrant) => void;
  /** Tracks a one-off into this week's board column */
  trackTask: (taskId: string, status: TrackTargetStatus) => void;
  /** Marks a one-off done, with the undo toast */
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
