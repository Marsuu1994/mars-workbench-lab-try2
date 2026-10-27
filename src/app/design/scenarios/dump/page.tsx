import {DumpPage} from '@/components/domain/dump/DumpPage';
import {toDumpPageProps} from '@/utils/dump';
import {ScenarioTabs, type ScenarioTab} from '../ScenarioTabs';
import {ScenarioPage} from '../ScenarioPage';
import {
  DUMP_FEED,
  DUMP_TODAY,
  DUMP_TOTAL_COUNT,
  EMPTY_DUMP_FEED,
} from './fixtures';

const DUMP_SCENARIOS: ScenarioTab[] = [
  {
    label: 'Feed',
    title: 'Dump — populated feed',
    note: 'Day-grouped entries (Today / Yesterday / older) with one long entry showing the 6-line clamp + Show more. The first page has no nextCursor, so the infinite-scroll observer stays inert against the fixtures.',
    content: (
      <DumpPage {...toDumpPageProps(DUMP_FEED, DUMP_TOTAL_COUNT, DUMP_TODAY)} />
    ),
  },
  {
    label: 'Empty',
    title: 'Dump — empty',
    note: 'First visit: the composer over the empty-state feed.',
    content: <DumpPage {...toDumpPageProps(EMPTY_DUMP_FEED, 0, DUMP_TODAY)} />,
  },
];

export default function DumpScenarioPage() {
  return (
    <ScenarioPage
      title="Dump scenarios"
      description="The real dump page (BoardHeader + composer + day-grouped feed)
        fed the read actions' raw fixtures through the route's adapter — the
        populated feed with Today/Yesterday/older headers and the 6-line
        clamp, plus the empty state. The first page has no nextCursor, so the
        load-more observer stays inert against the fixtures."
    >
      <ScenarioTabs tabs={DUMP_SCENARIOS} />
    </ScenarioPage>
  );
}
