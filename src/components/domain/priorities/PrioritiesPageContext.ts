import {createContext, use} from 'react';
import type {TrackTargetStatus} from '@/schemas';
import type {PriorityQuadrant} from '@/utils/enums';

/**
 * What the Priorities page's components read and do without threading it
 * through props: the plan tracking writes into, which card's Move-to popover
 * is open, and every write and overlay, bound to the page's optimistic
 * one-offs. `PrioritiesPage` provides it; the rows still come down as props.
 */
export interface PrioritiesPageContextValue {
  /** The plan Move to tracks into; null: no plan this week yet */
  activePlanId: string | null;
  /** The card whose desktop Move-to popover is open; null: none */
  openPopoverTaskId: string | null;
  /** Opens the card's popover, or closes it when it's the open one */
  togglePopover: (taskId: string) => void;
  /** Mobile tap on a card: the Move-to bottom sheet */
  openMoveToSheet: (taskId: string) => void;
  /** The add modal, preset to a quadrant; without one it shows the picker */
  openAddTask: (quadrant?: PriorityQuadrant) => void;
  /** Puts the one-off on the active plan's board, in the given column */
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
