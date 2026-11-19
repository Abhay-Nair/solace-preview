# Solace — M1 Local Prototype

An elegant, medical-student-focused wellness and productivity web application. Built with React, TypeScript, Vite, Tailwind and IndexedDB. **No live AI, backend or analytics.** Private local prototype only.

## Requirements

- Node.js 20.19+ (Node 22 recommended)
- npm

## Run on Windows (PowerShell)

```powershell
cd Solace
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. No API keys or environment variables are needed.

## Verify

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright launches a temporary local development server automatically. Mobile tests run against emulated Chromium. Tests will require the dependencies to be installed successfully.

## Pages

- `/` Today dashboard
- `/medspace` curated and source-linked medical/science facts and favorites
- `/planner` deterministic daily timetable, protected commitments, conflicts and draft acceptance
- `/unwind` mood check-ins, guided breathing, synthesized ambient noise
- `/games` memory match and color matching
- `/focus` focus/break timer
- `/companion` explicitly non-live preview
- `/settings` local-data clear controls

## Architecture

- `src/features/planner/engine.ts` — pure schedule generator and validation
- `src/features/planner/Planner.tsx` — task, commitment and proposal UI
- `src/lib/storage.ts` — IndexedDB abstraction using `idb`
- `src/lib/useStored.ts` — reactive local storage hook
- `src/data/facts.ts` — curated fact content and references
- `src/features/*` — independent feature pages

## Known limitations and safety

- No real AI, chat API, Google Calendar integration, accounts or cloud synchronization.
- The deterministic scheduler supports one date at a time, with a single same-day available window. It does not split tasks across days or plan travel time. Changes are generated as drafts for explicit acceptance.
- Browser data stays on this device; it can be cleared from Settings or lost if browser storage is reset.
- Some externally linked reference pages may change; review facts before public release.
- Sounds are original synthesized noise generated with the browser Web Audio API rather than a full licensed sound library.
- The focus timer may be delayed by browser background throttling; keep the tab active.
- The private preview is not a medically validated intervention. AI use by minors remains disabled; no live AI is provided for any age.
- **Not approved for public deployment.** Accessibility, age-appropriate safeguards, medical content review and production privacy/security requirements need additional verification.

## Safety of development

The project was authored as local source files only. No commits, pushes, migrations, secrets, cloud services or deployment were performed.

## M1.1 maintenance update (November 19, 2026)

This archive is an **in-place revision** of the uploaded M1 project, not a rebuild.

- Repaired an unbalanced parenthesis in `eslint.config.js` that prevented ESLint from starting.
- Disabled generation when neither tasks nor commitments exist, and prevented acceptance of an empty schedule proposal.
- Increased small typography sizes for readability while retaining the original pastel visual system.

### Apply safely to an existing local copy

1. Preserve your current working Solace folder as a backup.
2. Extract this archive to a separate folder. Do **not** copy `node_modules` or `dist` from the old project.
3. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e` from the folder with `package.json`.
4. Compare your local changes before replacing files if you made edits after uploading the ZIP.

The commands above must run successfully on your computer before M1.1 can be considered verified.

## M1 final refinement (November 19, 2026)

This update modifies the existing M1.1 source without changing the architecture, routes, or local-only privacy model.

- Planner: chronological visual timeline with counts and study minutes, unscheduled-task panel, in-form task editing, and validated commitment start/end ordering. Draft changes still require explicit acceptance.
- MedSpace: 17 short source-linked educational facts (previously 7), search, saved-only filter, and clearer zero-results messaging.
- Unwind: two optional breathing rhythms (4-in/6-out and 4-in/4-out) with reset on pattern change.
- UI: responsive spacing, card typography, accessibility, and focus/touch sizing improvements.
- Quality: corrected local storage Hook warning; additional timeline unit test and browser regression tests including mobile navigation without a skip.

**Medical content:** short educational summaries linked to reference material, not clinical advice. Reference URLs should be checked and content reviewed with Yukta before any public release.

**Still intentionally out of scope:** live AI chat, AI-generated facts, cloud accounts, external calendars, multi-day scheduling, public hosting, deployment, and legal/privacy compliance for public minor users.

### Verification limitation in the source-authoring environment

- `tsc --noEmit`: passed.
- `tsc -b`: passed.
- ESLint: 0 errors, 0 warnings (invoked directly via its JavaScript entrypoint).
- Vitest and Vite's final asset bundle: not runnable in the source-authoring Linux container: the available dependency snapshot was installed on Windows and lacks `@rollup/rollup-linux-x64-gnu`. **No test or bundle pass is claimed from that environment.**
- Earlier on Windows, M1.1 passed 13 unit tests, 11 E2E tests with 1 skipped, and the production build. Those results **predate** this source update and do not verify it.

On your Windows laptop, extract the ZIP, open the `Solace` folder, and run:

```powershell
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run dev
```

Keep the previous folder as a backup. Do not copy `node_modules` from an old installation. All data remains local to each browser's IndexedDB; the new folder does not automatically import data from a different browser origin.
