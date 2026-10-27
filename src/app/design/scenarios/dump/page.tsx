import type {DumpEntryItem} from '@/lib/db/dumpEntries';
import {DumpPage} from '@/components/domain/dump/DumpPage';
import {toDumpPageProps} from '@/utils/dump';
import {ScenarioTabs, type ScenarioTab} from '../ScenarioTabs';
import {ScenarioPage} from '../ScenarioPage';
import {DUMP_FEED_ENTRIES, DUMP_TODAY} from './fixtures';

/** The page as its route renders it: the entries as the feed's only page
 *  (no next cursor, so the load-more observer stays inert), all of them
 *  counted. */
const renderDumpPage = (entries: DumpEntryItem[]) => (
  <DumpPage
    {...toDumpPageProps(
      {data: {entries, nextCursor: null}},
      entries.length,
      DUMP_TODAY,
    )}
  />
);

const DUMP_SCENARIOS: ScenarioTab[] = [
  {
    label: 'Feed',
    title: 'Dump — populated feed',
    note: "Day-grouped entries (Today / Yesterday / older) with one long entry showing the 6-line clamp + Show more. The feed's next cursor is null so the infinite-scroll observer stays inert against the fixtures.",
    content: renderDumpPage(DUMP_FEED_ENTRIES),
  },
  {
    label: 'Empty',
    title: 'Dump — empty',
    note: 'First visit: the composer over the empty-state feed.',
    content: renderDumpPage([]),
  },
];

export default function DumpScenarioPage() {
  return (
    <ScenarioPage
      title="Dump scenarios"
      description="The real dump page (BoardHeader + composer + day-grouped feed) fed
        fixture entries through the route's adapter — the populated feed with
        Today/Yesterday/older headers and the 6-line clamp, plus the empty
        state. The feed's next cursor is pinned null so the load-more observer
        stays inert against the fixtures."
    >
      <ScenarioTabs tabs={DUMP_SCENARIOS} />
    </ScenarioPage>
  );
}
