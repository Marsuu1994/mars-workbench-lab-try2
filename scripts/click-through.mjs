/**
 * Clicks through the Board, Priorities and Dump pages on the local stack as
 * the e2e user: every page-level handler once, on desktop and on mobile,
 * asserting the optimistic update and the state after a reload. Prints
 * PASS / FAIL per check and the console errors seen, and exits non-zero on
 * any failure — the behaviour check for a change to these pages
 * (`npm run check:clicks`).
 *
 * Needs a running dev server and the e2e user signed in on the seed's week:
 *
 *   npm run dev &
 *   npm run e2e:session -- .auth/e2e-session.json
 *   npm run check:clicks
 *
 * The checks change the e2e user's data (captures, added and moved tasks):
 * rerun `npm run e2e:session` before running them again. Settings, by
 * argument or environment: `--base-url=` / CHECK_CLICKS_BASE_URL (default
 * http://localhost:3000) and `--storage-state=` / CHECK_CLICKS_STORAGE_STATE
 * (default .auth/e2e-session.json).
 */
import {existsSync} from 'node:fs';
import {chromium, expect} from '@playwright/test';

const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_STORAGE_STATE = '.auth/e2e-session.json';
/** A cloud agent's container ships this Chromium; elsewhere Playwright's own. */
const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium';
const DESKTOP = {viewport: {width: 1280, height: 800}};
const MOBILE = {
  viewport: {width: 390, height: 844},
  isMobile: true,
  hasTouch: true,
};
const PAGES = {
  board: '/kanban',
  priorities: '/kanban/priorities',
  dump: '/kanban/dump',
};
/** After a warm-up load: lets the page's client code attach. */
const WARM_UP_SETTLE_MS = 1500;
const LOAD_MORE_TIMEOUT_MS = 10_000;
/** Enough captures to push the seed's oldest entry onto a second page. */
const DUMP_CAPTURE_COUNT = 18;
const REASON_MAX_LENGTH = 300;

const argument = (name, fallback) => {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
};
const BASE_URL = argument(
  'base-url',
  process.env.CHECK_CLICKS_BASE_URL ?? DEFAULT_BASE_URL,
);
const STORAGE_STATE = argument(
  'storage-state',
  process.env.CHECK_CLICKS_STORAGE_STATE ?? DEFAULT_STORAGE_STATE,
);

const results = [];
const consoleErrors = [];

const check = async (name, run) => {
  try {
    await run();
    results.push(['PASS', name]);
  } catch (error) {
    const reason = String(error.message).split('\n')[0];
    results.push(['FAIL', name, reason.slice(0, REASON_MAX_LENGTH)]);
  }
};

const collectErrors = page => {
  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text().slice(0, REASON_MAX_LENGTH));
    }
  });
  page.on('pageerror', error =>
    consoleErrors.push(error.message.slice(0, REASON_MAX_LENGTH)),
  );
};

const openPage = async (page, path) => {
  await page.goto(BASE_URL + path);
  await page.waitForLoadState('networkidle');
};

const reload = async page => {
  await page.reload();
  await page.waitForLoadState('networkidle');
};

/** The server action a page posts to: resolves once the write has landed. */
const waitForAction = (page, path) =>
  page.waitForResponse(
    response =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === path,
  );

const newPage = async (browser, device) => {
  const context = await browser.newContext({
    ...device,
    storageState: STORAGE_STATE,
    baseURL: BASE_URL,
  });
  const page = await context.newPage();
  collectErrors(page);
  return page;
};

/**
 * Warms the dev server's compile cache: on a cold Turbopack server the first
 * load reaches networkidle before React has attached its handlers.
 */
const warmUp = async (browser, paths) => {
  const page = await newPage(browser, DESKTOP);
  for (const path of paths) {
    await openPage(page, path);
    await page.waitForTimeout(WARM_UP_SETTLE_MS);
  }
  await page.context().close();
};

// Board: every BoardPageContext handler — drag to Done (desktop), pull to
// Todo (mobile).
const checkBoard = async browser => {
  const column = (page, status) =>
    page.locator(`[data-rfd-droppable-id="${status}"]`);
  const heading = (page, status, title) =>
    column(page, status).getByRole('heading', {name: title});

  {
    const page = await newPage(browser, DESKTOP);
    await check(
      'Board desktop: a Todo card dragged to Done stays done (handleDragEnd)',
      async () => {
        const title = 'Flashcards';
        await openPage(page, PAGES.board);
        await expect(heading(page, 'TODO', title)).toBeVisible();
        const announcements = page.locator('[aria-live]');
        await column(page, 'TODO')
          .getByRole('button', {name: new RegExp(title)})
          .focus();
        await page.keyboard.press('Space');
        await expect(announcements).toContainText([/lifted/]);
        await page.keyboard.press('ArrowRight');
        await expect(announcements).toContainText([/to list DONE/]);
        const saved = waitForAction(page, PAGES.board);
        await page.keyboard.press('Space');
        await expect(heading(page, 'DONE', title)).toBeVisible();
        await saved;
        await reload(page);
        await expect(heading(page, 'DONE', title)).toBeVisible();
        await expect(heading(page, 'TODO', title)).toHaveCount(0);
      },
    );
    await page.context().close();
  }

  {
    const page = await newPage(browser, MOBILE);
    await check(
      'Board mobile: the backlog sheet pulls a card to Todo (pullToTodo)',
      async () => {
        const title = 'Unit 3 — Travel';
        await openPage(page, PAGES.board);
        await expect(heading(page, 'TODO', title)).toHaveCount(0);
        await page.getByTitle('Open backlog').filter({visible: true}).click();
        const sheet = page.locator('dialog[open]');
        await expect(sheet).toBeVisible();
        const card = sheet.locator('div.card', {
          has: page.getByRole('heading', {name: title}),
        });
        await expect(card).toBeVisible();
        const saved = waitForAction(page, PAGES.board);
        await card.getByRole('button', {name: 'Todo'}).click();
        await saved;
        await page.keyboard.press('Escape');
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        await expect(heading(page, 'TODO', title)).toBeVisible();
        await reload(page);
        await expect(heading(page, 'TODO', title)).toBeVisible();
      },
    );
    await page.context().close();
  }
};

// Priorities: every PrioritiesPageContext handler — popover track / complete
// / undo, quadrant drag and quadrant Add (desktop); sheet complete / undo /
// track and the picker add (mobile).
const checkPriorities = async browser => {
  const quadrant = (page, id) =>
    page.locator(`[data-rfd-droppable-id="${id}"]`);
  const cardIn = (page, id, title) =>
    quadrant(page, id).getByRole('button', {name: new RegExp(title)});
  const anyCard = (page, title) =>
    page.getByRole('button', {name: new RegExp(title)});
  const toast = page => page.getByRole('status');
  const DESKTOP_ADDED_TITLE = 'Click-through desktop add';
  const MOBILE_ADDED_TITLE = 'Click-through mobile add';

  {
    const page = await newPage(browser, DESKTOP);
    await check('Priorities desktop: page opens', () =>
      openPage(page, PAGES.priorities),
    );

    await check(
      'Priorities desktop: popover → Todo tracks the task (trackTask)',
      async () => {
        const title = 'Set up a retirement account';
        const card = anyCard(page, title);
        await card.hover();
        await card.getByRole('button', {name: 'Move task'}).click();
        const saved = waitForAction(page, PAGES.priorities);
        await page.getByRole('button', {name: 'Todo', exact: true}).click();
        await expect(card).toContainText('This Week');
        await saved;
        await reload(page);
        await expect(anyCard(page, title)).toContainText('This Week');
      },
    );

    await check(
      'Priorities desktop: popover → Done removes the card and opens the undo toast (completeTask)',
      async () => {
        const title = 'Reply to the landlord';
        const card = anyCard(page, title);
        await card.hover();
        await card.getByRole('button', {name: 'Move task'}).click();
        const completed = waitForAction(page, PAGES.priorities);
        await page.getByRole('button', {name: 'Done', exact: true}).click();
        await expect(anyCard(page, title)).toHaveCount(0);
        await expect(toast(page)).toContainText('Marked done');
        await completed;
      },
    );

    await check(
      'Priorities desktop: Undo puts the card back where it was (undo)',
      async () => {
        const title = 'Reply to the landlord';
        const restored = waitForAction(page, PAGES.priorities);
        await toast(page).getByRole('button', {name: 'Undo'}).click();
        await expect(cardIn(page, 'SQUEEZE_IN', title)).toBeVisible();
        await restored;
        await reload(page);
        await expect(cardIn(page, 'SQUEEZE_IN', title)).toBeVisible();
      },
    );

    await check(
      'Priorities desktop: a card dragged to another quadrant is reprioritized (handleDragEnd)',
      async () => {
        const title = 'Sort old photos';
        await expect(cardIn(page, 'MAYBE_LATER', title)).toBeVisible();
        const announcements = page.locator('[aria-live]');
        await cardIn(page, 'MAYBE_LATER', title).focus();
        await page.keyboard.press('Space');
        await expect(announcements).toContainText([/lifted/]);
        await page.keyboard.press('ArrowLeft');
        await expect(announcements).toContainText([/to list SQUEEZE_IN/]);
        const saved = waitForAction(page, PAGES.priorities);
        await page.keyboard.press('Space');
        await expect(cardIn(page, 'SQUEEZE_IN', title)).toBeVisible();
        await saved;
        await reload(page);
        await expect(cardIn(page, 'SQUEEZE_IN', title)).toBeVisible();
        await expect(cardIn(page, 'MAYBE_LATER', title)).toHaveCount(0);
      },
    );

    await check(
      'Priorities desktop: the quadrant Add opens the modal and the task lands in that quadrant (openAddTask)',
      async () => {
        const title = DESKTOP_ADDED_TITLE;
        await quadrant(page, 'DO_FIRST')
          .getByRole('button', {name: 'Add', exact: true})
          .click();
        const dialog = page.locator('dialog[open]');
        await expect(dialog).toBeVisible();
        await expect(dialog).toContainText('Add Priority Task');
        await dialog.getByPlaceholder('e.g. File tax report').fill(title);
        const saved = waitForAction(page, PAGES.priorities);
        await dialog.getByRole('button', {name: 'Add to matrix'}).click();
        await saved;
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        await expect(cardIn(page, 'DO_FIRST', title)).toBeVisible();
        await reload(page);
        await expect(cardIn(page, 'DO_FIRST', title)).toBeVisible();
      },
    );
    await page.context().close();
  }

  {
    const page = await newPage(browser, MOBILE);
    await check('Priorities mobile: page opens', () =>
      openPage(page, PAGES.priorities),
    );

    await check(
      'Priorities mobile: tapping a card opens the sheet; Done completes; Undo restores (openMoveToSheet, completeTask, undo)',
      async () => {
        const title = 'Sort old photos';
        await anyCard(page, title).click();
        const sheet = page.locator('dialog[open]');
        await expect(sheet).toBeVisible();
        await expect(sheet.getByRole('heading', {name: title})).toBeVisible();
        const completed = waitForAction(page, PAGES.priorities);
        await sheet.getByRole('button', {name: 'Done', exact: true}).click();
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        await expect(anyCard(page, title)).toHaveCount(0);
        await expect(toast(page)).toContainText('Marked done');
        await completed;
        const restored = waitForAction(page, PAGES.priorities);
        await toast(page).getByRole('button', {name: 'Undo'}).click();
        await expect(cardIn(page, 'SQUEEZE_IN', title)).toBeVisible();
        await restored;
      },
    );

    await check(
      'Priorities mobile: sheet → Todo tracks the task (trackTask)',
      async () => {
        const title = DESKTOP_ADDED_TITLE;
        await anyCard(page, title).click();
        const sheet = page.locator('dialog[open]');
        await expect(sheet).toBeVisible();
        const saved = waitForAction(page, PAGES.priorities);
        await sheet.getByRole('button', {name: 'Todo', exact: true}).click();
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        await expect(anyCard(page, title)).toContainText('★');
        await saved;
        await reload(page);
        await expect(anyCard(page, title)).toContainText('★');
      },
    );

    await check(
      'Priorities mobile: the title-bar + opens the picker modal and the task lands in the chosen quadrant (openAddTask)',
      async () => {
        const title = MOBILE_ADDED_TITLE;
        await page.getByTitle('Add priority task').click();
        const dialog = page.locator('dialog[open]');
        await expect(dialog).toBeVisible();
        await dialog.getByPlaceholder('e.g. File tax report').fill(title);
        await dialog.getByRole('button', {name: /maybe later/i}).click();
        const saved = waitForAction(page, PAGES.priorities);
        await dialog.getByRole('button', {name: 'Add to matrix'}).click();
        await saved;
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        await expect(cardIn(page, 'MAYBE_LATER', title)).toBeVisible();
        await expect(toast(page)).toContainText(/Added to/);
        await reload(page);
        await expect(cardIn(page, 'MAYBE_LATER', title)).toBeVisible();
      },
    );
    await page.context().close();
  }
};

// Dump: every DumpPageContext handler — capture (⌘/Ctrl+Enter and the
// button), load more.
const checkDump = async browser => {
  const composer = page => page.getByPlaceholder("What's on your mind?");
  const entry = index => `Click-through capture ${index}`;
  const OLDEST_SEED =
    'Maybe the board needs a weekly review ritual on Sundays.';
  const SECOND_SEED = 'Idea: a reading list project once the book is done.';

  const page = await newPage(browser, DESKTOP);
  await check('Dump: page opens', () => openPage(page, PAGES.dump));

  await check(
    'Dump: Ctrl+Enter captures an entry at the top of the feed (capture)',
    async () => {
      await composer(page).fill(entry(1));
      const saved = waitForAction(page, PAGES.dump);
      await composer(page).press('Control+Enter');
      await expect(page.getByText(entry(1))).toBeVisible();
      await saved;
      await expect(composer(page)).toHaveValue('');
    },
  );

  await check(
    `Dump: the Dump button captures ${DUMP_CAPTURE_COUNT - 1} more entries (capture)`,
    async () => {
      for (let index = 2; index <= DUMP_CAPTURE_COUNT; index += 1) {
        await composer(page).fill(entry(index));
        const saved = waitForAction(page, PAGES.dump);
        await page.getByRole('button', {name: 'Dump', exact: true}).click();
        await expect(page.getByText(entry(index))).toBeVisible();
        await saved;
      }
    },
  );

  await check(
    'Dump: scrolling to the bottom loads the next page (loadMore)',
    async () => {
      await reload(page);
      await expect(page.getByText(SECOND_SEED)).toBeVisible();
      await expect(page.getByText(OLDEST_SEED)).toHaveCount(0);
      await page.evaluate(() => {
        for (const element of document.querySelectorAll('.overflow-y-auto')) {
          element.scrollTop = element.scrollHeight;
        }
        window.scrollTo(0, document.body.scrollHeight);
      });
      await expect(page.getByText(OLDEST_SEED)).toBeVisible({
        timeout: LOAD_MORE_TIMEOUT_MS,
      });
    },
  );
  await page.context().close();
};

const report = () => {
  for (const row of results) console.log(row.join(' | '));
  console.log(`console errors: ${consoleErrors.length}`);
  for (const error of consoleErrors) console.log(`  ${error}`);
  const failed = results.filter(([status]) => status === 'FAIL').length;
  console.log(
    `SUMMARY ${results.length - failed}/${results.length} passed, ${consoleErrors.length} console errors`,
  );
  return failed === 0 && consoleErrors.length === 0;
};

const main = async () => {
  if (!existsSync(STORAGE_STATE)) {
    throw new Error(
      `${STORAGE_STATE} is missing: run \`npm run e2e:session -- ${STORAGE_STATE}\` first.`,
    );
  }
  const browser = await chromium.launch({
    executablePath: existsSync(PREINSTALLED_CHROMIUM)
      ? PREINSTALLED_CHROMIUM
      : undefined,
  });
  try {
    await warmUp(browser, Object.values(PAGES));
    await checkBoard(browser);
    await checkPriorities(browser);
    await checkDump(browser);
  } finally {
    await browser.close();
  }
  process.exitCode = report() ? 0 : 1;
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
