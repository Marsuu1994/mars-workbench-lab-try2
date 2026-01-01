import {createContext, use} from 'react';

/**
 * What the Dump page's components read and do without threading it through
 * props: the feed's writes, bound to the page's feed state (useDumpFeed).
 * `DumpPage` provides it; the entries still come down as props.
 */
export interface DumpPageContextValue {
  /** Prepends the entry optimistically; resolves ok: false on failure */
  capture: (content: string) => Promise<{ok: boolean}>;
  /** The last capture's error, shown under the composer */
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
