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

## 2026-11-14 (e) — briefing polish, full-screen/name setup, post-match voice

- **Subtitle animation:** the note now reveals word by word with a blinking cursor while
  the captain's mouth/head/brow move. CSS only; reduced motion shows the full line.
- **Full-screen/name setup:** after the story, a native dialog recommends full screen
  (F11, or Ctrl+Cmd+F on Mac) with a real `requestFullscreen` button, then asks for the
  player's detective name. The name becomes the X side (card, turn, result, stamp,
  coach), is stored in `nine-files:name:v1`, and is editable from **EDIT NAME**.
- **Post-match speech:** after the result, the captain speaks again: names the winner,
  compliments the user's win, or asks for a rematch after a loss/draw.
- **Hydration fix:** the intro/setup character animation was conditional on a
  localStorage-derived open state, so SSR and client markup differed (React #418). The
  character now animates constantly; the dialog controls visibility natively.
- Gates: 40 unit, 21 e2e tests (19 of 20 targeted flow tests passed first, then the
  hydration failure was fixed and the no-console test passed; the post-match and setup
  tests passed). Lighthouse was not rerun because of the host CPU temperature.
- Repo: private; deploy still pending owner review.

## 2026-11-14 (f) — post-match takeover and a visible score reset

- **Post-match takeover:** 1.6 s after the result, Capt. Hale opens a native dialog with
  the verdict, the result, and his note. Primary action follows the user's perspective:
  **CONTINUE** after an X win, **TRY AGAIN** after an O win, **ONE MORE** after a draw.
  **STAY ON THE BOARD** closes it; **RESET SCORES** clears counts + match log from there.
- **Score reset:** the scoreboard reset is now a bordered button, not a tiny text link;
  it still uses the two-step confirm and clears both the counts and the history.
- The post-match note uses the same word-by-word subtitle + cursor and the captain
  animation. Native dialog, focus-trapped, Escape = stay.
- Gates: 40 unit, 23 e2e defined. The targeted post-match/reset/history/axe/no-console
  run passed after adding the note test hook; no Lighthouse rerun because of CPU heat.
- Repo: private; deploy still pending owner review.

## 2026-11-14 (g) — noir music and a speaking voice

- **Background music:** a procedural noir loop (Am7-Dm7-E7, upright-style bass, brushed
  noise, sparse bell) generated with the Web Audio API. No audio files. It starts on the
  first user gesture, fades with the MUSIC toggle, and persists in `nine-files:music:v1`.
- **Speech SFX:** soft per-word blips while Capt. Hale's subtitles reveal, in the coach
  bubble, briefing, setup, and post-match verdict. The SFX toggle mutes them; the music
  is independent.
- The header now has separate **MUSIC** and **SFX** toggles. The music toggle test
  (default on, off, reload, off; SFX off) passed.
- Gates: 40 unit, 24 e2e defined. No Lighthouse rerun because of CPU heat.
- Repo: private; deploy still pending owner review.

## 2026-11-15 (h) — submission hardening

- **CI root causes fixed:** `LayoutProps<"/">` failed `npm run typecheck` on a fresh
  checkout (Next generates it only after build); replaced with `ReactNode`. A UTF-8 BOM
  in `package.json` broke Turbopack; rewritten clean. The win screenshot fired as the
  post-match backdrop appeared; captured at 1000 ms instead. The setup screenshot fired
  before the dialog fade; now waits 400 ms. Both CI jobs are green at `905f210`.
- **README rewritten** for a public repository: centered hero, CI/stack/license badges,
  current screenshots, features, how it plays, coach, sound, quick start, scripts,
  architecture, quality, accessibility, deployment, structure, limits.
- **MIT LICENSE** added; `license` in `package.json`.
- **Repo is public.** Screenshots refreshed from the green CI artifact; the setup image
  and win are correct. Audio defaults on for both MUSIC and SFX.
- **Deploy:** owner is importing the repo into Vercel manually. Intended production URL
  `https://nine-files.vercel.app`; if Vercel assigns a suffix, set
  `NEXT_PUBLIC_SITE_URL` and update the README live link.
- **Next:** live smoke, screenshots to the form, optional demo, submit at
  `apply.capm.us` (Tic-Tac-Toe).

## 2026-11-15 (i) — repository renamed

- GitHub repo renamed `nine-files` → `the-nine-files`; the old URLs redirect. Local
  `origin` updated; the public repo and Actions continue under the new name.
- README Source, CI badge, clone command, and project state updated. Package name and
  local folder stay `tic-tac-toe`; the app title stays **The Nine Files**.
- The owner is renaming the Vercel project manually. The README live links and
  `metadataBase` will be updated when the new production URL is known.
- Submission repo URL: `https://github.com/Calfredo23/the-nine-files`.
