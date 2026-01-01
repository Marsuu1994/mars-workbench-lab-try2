import {createContext, use} from 'react';
import type {PriorityQuadrant} from '@/utils/enums';
import type {TrackTargetStatus} from '@/schemas';

/**
 * What the Priorities page's components read and do without threading it
 * through props: the week Track moves a card onto, which card's Move-to
 * popover is open, and every write and overlay opener, bound to the page's
 * optimistic one-offs. `PrioritiesPage` provides it; the rows still come
 * down as props.
 */
export interface PrioritiesPageContextValue {
  /** The plan Track moves a card onto; null: no plan this week yet */
  activePlanId: string | null;
  /** The card whose desktop Move-to popover is open, if any */
  openPopoverTaskId: string | null;
  /** Opens a card's Move-to popover, or closes it when it is the open one */
  togglePopover: (taskId: string) => void;
  /** Mobile's card tap: the Move-to bottom sheet */
  openMoveToSheet: (taskId: string) => void;
  /** The add-task modal, preset to a quadrant (desktop's per-quadrant Add)
      or with its quadrant picker (mobile's global add) */
  openAddTask: (quadrant?: PriorityQuadrant) => void;
  /** Puts a card on this week's board */
  trackTask: (taskId: string, status: TrackTargetStatus) => void;
  /** Marks a card done; the page opens its undo toast */
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
