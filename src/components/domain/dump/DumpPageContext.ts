import {createContext, use} from 'react';

/**
 * What the Dump page's components read and do without threading it through
 * props: capture and load more, bound to the page's feed, and the last
 * capture's error. `DumpPage` provides it; the entries still come down as
 * props.
 */
export interface DumpPageContextValue {
  /** Prepends the entry optimistically; resolves once it is saved or rolled
      back (`ok: false` — the composer restores the text) */
  capture: (content: string) => Promise<{ok: boolean}>;
  /** The last failed capture's message; null after a success */
  captureError: string | null;
  /** Appends the feed's next page */
  loadMore: () => void;
}

export const DumpPageContext = createContext<DumpPageContextValue | null>(null);

/** The Dump page's context; only its components render inside it. */
export const useDumpPageContext = (): DumpPageContextValue => {
  const context = use(DumpPageContext);
  if (!context) {
    throw new Error('useDumpPageContext must be used within DumpPage');
  }
  return context;
};
