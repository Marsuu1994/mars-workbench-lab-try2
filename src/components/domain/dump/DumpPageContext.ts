import {createContext, use} from 'react';

/**
 * What the Dump page's components do without threading it through props:
 * capture into the feed and page more of it in, bound to the page's feed
 * state. `DumpPage` provides it; the entries still come down as props.
 */
export interface DumpPageContextValue {
  /** Prepends the entry at once; resolves `ok: false` when the save fails
   *  (the entry is rolled back and the composer restores its text) */
  capture: (content: string) => Promise<{ok: boolean}>;
  /** Why the last capture failed; cleared when the next one starts */
  captureError: string | null;
  /** Appends the next page; a no-op while one loads or at the end */
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
