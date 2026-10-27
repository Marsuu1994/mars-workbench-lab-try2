import {DumpPage} from '@/components/domain/dump/DumpPage';
import {ScenarioTabs, type ScenarioTab} from '../ScenarioTabs';
import {ScenarioPage} from '../ScenarioPage';
import {DUMP_EMPTY_PAGE, DUMP_FEED_PAGE} from './fixtures';

const DUMP_SCENARIOS: ScenarioTab[] = [
  {
    label: 'Feed',
    title: 'Dump — populated feed',
    note: 'Day-grouped entries (Today / Yesterday / older) with one long entry showing the 6-line clamp + Show more. initialNextCursor is null so the infinite-scroll observer stays inert against the fixtures.',
    content: <DumpPage {...DUMP_FEED_PAGE} />,
  },
  {
    label: 'Empty',
    title: 'Dump — empty',
    note: 'First visit: the composer over the empty-state feed.',
    content: <DumpPage {...DUMP_EMPTY_PAGE} />,
  },
];

export default function DumpScenarioPage() {
  return (
    <ScenarioPage
      title="Dump scenarios"
      description="The real dump page (BoardHeader + composer + day-grouped feed) fed
        fixture entries — the populated feed with Today/Yesterday/older headers
        and the 6-line clamp, plus the empty state. initialNextCursor is pinned
        null so the load-more observer stays inert against the fixtures."
    >
      <ScenarioTabs tabs={DUMP_SCENARIOS} />
    </ScenarioPage>
  );
}
