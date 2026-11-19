# Solace M1.2 — Responsive desktop + planner containment fix

Based on the existing M1 Final Refined Source ZIP; no redesign or data migration.

## Changes
- Fixed timeline overflow: the `fixed` class in the timeline collided with Tailwind CSS's `position: fixed` utility. Timeline rows now use explicit `is-commitment`, `is-rest`, and `is-task` state classes; matching selectors were updated.
- Expanded the content canvas responsively to a maximum 1560px with fluid gutters. The planner grid has a wider schedule area on large desktops, with stacked layouts at tablet/mobile breakpoints.
- Expanded Focus layout max width and adjusted fact grid for wide displays.
- Contained long timeline content and prevented horizontal overflow.
- Added regression tests for the fixed-commitment class collision, desktop width, and horizontal scrolling at common viewport sizes.

## Verification
- Source patch and archive construction: complete.
- `npm ci` in this Linux execution environment timed out; TypeScript, ESLint, Vitest, Vite build and Playwright were **not** rerun here. Previous results for the unmodified M1 project do not validate this patch.
- Run on Windows: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`.
- Manually verify a fixed commitment in a proposed/saved schedule and desktop width at browser zoom 100% (Ctrl+0).

## Boundaries
No deployments, Git commits/pushes/merges, credentials, or cloud resources were changed.
