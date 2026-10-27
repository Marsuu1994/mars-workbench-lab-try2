import {DumpPage} from '@/components/domain/dump/DumpPage';
import {toDumpPageProps} from '@/utils/dump';
import {ScenarioTabs, type ScenarioTab} from '../ScenarioTabs';
import {ScenarioPage} from '../ScenarioPage';
import {
  DUMP_EMPTY_PAGE,
  DUMP_FEED_PAGE,
  DUMP_FEED_TOTAL_COUNT,
  DUMP_SCENARIO_TODAY,
} from './fixtures';

const DUMP_SCENARIOS: ScenarioTab[] = [
  {
    label: 'Feed',
    title: 'Dump — populated feed',
    note: 'Day-grouped entries (Today / Yesterday / older) with one long entry showing the 6-line clamp + Show more. The first page has no next cursor, so the infinite-scroll observer stays inert against the fixtures.',
    content: (
      <DumpPage
        {...toDumpPageProps(
          DUMP_FEED_PAGE,
          DUMP_FEED_TOTAL_COUNT,
          DUMP_SCENARIO_TODAY,
        )}
      />
    ),
  },
  {
    label: 'Empty',
    title: 'Dump — empty',
    note: 'First visit: the composer over the empty-state feed.',
    content: (
      <DumpPage {...toDumpPageProps(DUMP_EMPTY_PAGE, 0, DUMP_SCENARIO_TODAY)} />
    ),
  },
];

export default function DumpScenarioPage() {
  return (
    <ScenarioPage
      title="Dump scenarios"
      description="The real dump page (BoardHeader + composer + day-grouped feed) fed
        fixture entries through the route's adapter — the populated feed with
        Today/Yesterday/older headers and the 6-line clamp, plus the empty
        state. The first page has no next cursor, so the load-more observer
        stays inert against the fixtures."
    >
      <ScenarioTabs tabs={DUMP_SCENARIOS} />
    </ScenarioPage>
  );
}
