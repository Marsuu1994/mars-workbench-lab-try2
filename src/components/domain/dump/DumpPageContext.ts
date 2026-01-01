import {createContext, use} from 'react';

/**
 * What the Dump page's components read and do without threading it through
 * props: capture into the feed, its last error, and paging, all bound to the
 * page's one feed. `DumpPage` provides it; the entries still come down as
 * props.
 */
export interface DumpPageContextValue {
  /** Prepends the entry optimistically; resolves `ok: false` once rolled back */
  capture: (content: string) => Promise<{ok: boolean}>;
  /** Why the last capture failed; null once one goes through */
  captureError: string | null;
  /** Appends the next page of the feed */
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
