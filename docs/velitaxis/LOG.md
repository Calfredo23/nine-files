# LOG

## 2026-11-14 (a) — project opened

- Mode: QUALITY (owner selected; hiring artifact). Framework 1.22.1.
- Owner decisions: noir case-wall concept; core + deep polish; folder `tic-tac-toe`.
- Scaffolded Next 16.4.6 / React 19.3 / Tailwind 4 / TypeScript strict with
  `create-next-app`; added Motion 12, Vitest, Playwright, axe.
- Next: design contract, pure game logic, board shell.

## 2026-11-14 (b) — built, tested, copy pass

- Built the full app: noir case wall, red-yarn winning line, taped CASE CLOSED label,
  local scoreboard, keyboard play, reduced motion.
- Gates: 22 unit, 13 e2e, axe 0 (opening + win), contrast 13/13. Lighthouse desktop
  100/100/100/100, mobile 94/100/100/100 (LCP 0.2 s / 1.7 s, TBT 40 / 240 ms, CLS 0).
- Copy pass: plain labels where clarity matters (SCOREBOARD, RESET SCORES, DRAWS,
  MOVE HISTORY, MOVE 05/09), understated commentary, README rewritten in a human voice.
- Repo: `github.com/Calfredo23/nine-files` (private). Pushed 78f0377, then set private
  on the owner's request. Copy pass committed next.
- Deploy: not made. Vercel login was started and cancelled on the owner's request.
- Incident: rebuilding `.next` while `next start` was running left the server serving a
  manifest whose CSS chunk 500'd. Clean rebuild + restart fixed it. Do not build over a
  running server.
- Next: owner review, then `vercel --prod`, make the repo public, submit the form.

## 2026-11-14 (c) — captain, coach, and a single-screen desktop

- Added **Capt. Hale**, an original SVG captain with a speaking mouth, blinking eyes,
  head bob, brow lift, and mug tilt while the note reveals. His note grades every move:
  best, good, inaccuracy, mistake, blunder, win, or draw, backed by a full minimax
  evaluation plus threat/fork detection (`lib/coach.ts`, 12 unit tests).
- Desktop is now a fixed single screen: no page scroll at 1440×900, 1366×768,
  1280×800, or 1024×768. The board sizes from the viewport (`calc(100dvh - 330px)`),
  the result lives in the turn banner, and New Game stays visible. A Playwright test
  asserts both the scroll height and the New Game bottom edge.
- Removed the Motion dependency and the per-character typewriter. Every animation is
  CSS now (mark, yarn draw, stamp slam, tally, note reveal, coach pop, captain talk),
  plus one canvas paper burst. The coach is mounted once and grid-placed, not duplicated.
- Copy pass: plain labels (SCOREBOARD, RESET SCORES, DRAWS, MOVE HISTORY, MOVE 05/09),
  title-case coach prose, understated lines. README rewritten.
- Gates: 31 unit, 15 e2e, axe 0, contrast 13/13. Lighthouse a11y/BP/SEO 100 in every
  run; performance 74–99 desktop and 74–92 mobile while a second dev server was live
  (99/92 in quiet runs).
- Repo: `github.com/Calfredo23/nine-files` (private). Deploy still pending owner review.

## 2026-11-14 (d) — briefing, right-side control, saved match history

- **First-visit briefing:** three beats from Capt. Hale on the Halver case, with the
  captain animating while the note reveals. Skip or replay from **BRIEFING**; the seen
  flag is `nine-files:intro:v1`. Native dialog, focus-trapped, Escape closes.
- **NEW GAME moved to the top-right CASE CONTROL panel** on desktop; a full-width copy
  sits under the board on mobile. The board grew to `min(560px, calc(100dvh - 280px))`
  now that the button is out of the centre column.
- **Match history:** the last 25 finished games are saved in `localStorage`
  (`nine-files:matches:v1`): winner, move list, date. **MATCH HISTORY** opens a native
  dialog; **RESET SCORES** clears both the counts and the log.
- **Bug caught by screenshot:** Tailwind preflight removes the native dialog's
  `margin: auto`, so modal dialogs sat top-left. `.case-dialog { margin: auto }` restores
  centering. A second cause was Playwright reusing a stale `:3211` server; the clean
  build fixed the evidence.
- Gates from the run: 36 unit, 18 e2e (including briefing, history, axeless briefing,
  and the no-scroll desktop test), axe 0. Lighthouse was not re-run because the host
  CPU was at 90 °C; the previous range in `MEASUREMENTS.md` stands.
- Repo: private; deploy still pending owner review.
