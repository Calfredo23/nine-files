# DESIGN PLAN — THE NINE FILES

> Namespaced plan. The hub's `DESIGN_PLAN.md` binds the GitHub profile README and is
> not re-scoped by this file.
> Version 1.0 · Date 2026-11-14 · Owner approved (QUALITY)

## 1. Brief

A tic-tac-toe game for the SUpost / CapM junior React + Next.js test. The test is the
whole application; a working game passes, style and personality decide the impression.

**Audience:** a startup founder who will open the link for 30–90 seconds, plus any
engineer who reads the repo afterwards.

**Success:** the reviewer understands the game in under three seconds, plays a full
round, and remembers the win animation. The code and README make the build look
deliberate rather than generated.

## 2. Concept

**The Nine Files.** Two detectives, Cross (X) and O'Rourke (O), claim clues on a cork
case wall. Three connected clues crack the case.

The metaphor is load-bearing, not a skin:

| Game element | Fiction |
|---|---|
| Board | cork case wall, nine pinned evidence cards |
| X | black marker on a manila tag, black pushpin |
| O | brass monocle ring, brass pushpin |
| Turn | which detective is filing |
| Winning line | red yarn stretched pin to pin |
| Win | CASE CLOSED stamp + ink splatter + camera flash |
| Draw | COLD CASE stamp, rain thickens |
| Scoreboard | the case ledger |
| New Game | a fresh case, same ledger |

Literal labels are kept so the test cannot be misread: cells show X and O, the primary
button says **NEW GAME**, and the result says **WINS** or **DRAW**.

## 3. Visual system

### Palette

| Token | Hex | Use |
|---|---|---|
| INK | `#0B0C0E` | page |
| COAL | `#14161A` | panels, frame |
| CORK | `#6F4A2D` | board surface |
| CORK-DARK | `#4A2F1B` | board shadow |
| MANILA | `#D8C39A` | evidence cards |
| MANILA-DEEP | `#B99E70` | card edges |
| PAPER | `#EFE6D2` | primary text |
| OXBLOOD | `#8E2B33` | yarn, stamp, accent |
| TUNGSTEN | `#E3A44B` | lamp, active state, focus |
| BRASS | `#B08D57` | monocle, pins, brackets |
| SMOKE | `#9A958A` | secondary text |

Rules: red is reserved for the winning yarn and the stamp so it stays meaningful.
Text on manila is ink, never smoke. Every pair is measured by `scripts/contrast.mjs`.

### Type

| Role | Family | Use |
|---|---|---|
| Display | Oswald 500/600/700 | title, stamps, result, buttons |
| Body | Source Serif 4 400/600 + italic | prose, instructions, commentary |
| Mono | Courier Prime 400/700 | case numbers, labels, ledger, move log |

Scale: 12 / 14 / 16 / 18 / 22 / 28 / clamp(40, 7vw, 76) for the title.
Tracking: display +0.02em, mono +0.12em on labels.

### Layout

- Max width 1280px. Page padding 16px mobile, 24px tablet, 32px desktop.
- Desktop: `1fr / minmax(0, 560px) / 1fr`. Center column: turn banner, board, result,
  New Game. Left: detective IDs, case note, how to play. Right: ledger, move log.
- Tablet: board centered, IDs and ledger in a 2-up row below.
- Mobile: turn banner → board → result/New Game → IDs → ledger → move log.
- Board `min(100%, 560px)`, square, 8px gaps, 12px frame padding.
- Tap targets ≥44×44.

### Signature details

- Cork texture built from layered radial gradients, no image.
- Cards rotate deterministically −1.4°…+1.2° so the wall feels hand-pinned.
- Cursor spotlight follows the pointer across the cork (fine pointers only).
- Pushpin drops with spring; card flexes 0.5%; mark presses in.
- Monocle has a brass gradient rim, dark glass, one specular arc.
- Yarn is a quadratic path with a small sag, drawn with `pathLength`, then a slow pluck.
- CASE CLOSED stamp: double oxblood border, multiply blend, 2.6× → 1 with a slam and
  300ms screen shake.
- Film grain 5–6%, vignette, tungsten lamp flicker, rain streaks. All CSS.

## 4. Motion

| Event | Motion | Reduced motion |
|---|---|---|
| Cell hover | lift 3px, straighten rotation, spotlight | no lift |
| Place mark | mark scale 1.35→1, rotate −12→0, 380ms spring | fade 150ms |
| Pin | drop from −18px, spring 600/18 | static |
| Turn change | ID card lift + tungsten edge, 250ms | instant |
| Win | yarn 600ms → stamp slam → flash → paper burst | yarn instant, stamp fade |
| Draw | stamp fade, rain opacity up | same |
| Overlay | result bar fades/slides 12px | fade only |

Only `transform` and `opacity` are animated. No layout animation on the board.

## 5. Copy

Voice: dry and understated. No parody, no pop-culture quotes, no hard-boiled clichés.
Plain labels where clarity matters (NEW GAME, SCOREBOARD, RESET SCORES, DRAWS).

- Title: THE NINE FILES
- Subtitle: A tic-tac-toe case in nine clues.
- Turn: CROSS'S TURN / O'ROURKE'S TURN
- Idle: "Nine squares. X starts."
- Mid: "Half the board is claimed. Watch the lines."
- Last cell: "One square left. This is the one."
- Win: "Case closed. Cross takes it."
- Draw: "No winner. The case goes cold."
- New case: "New board. Same scores."
- Score reset: "Reset scores."
- Instructions: "Two players. Nine squares. Take turns; three in a row wins. X goes
  first. New Game clears the board and keeps the scores."

## 6. Accessibility

- `role="grid"` > `role="row"` > `role="gridcell"` buttons; roving tabindex; arrows,
  Home/End, Enter/Space.
- Visually hidden `aria-live="polite"` for turns, `assertive` for the result.
- Result heading receives focus once (`preventScroll`) when the game ends.
- Focus ring: 2px tungsten, 3px offset, never removed.
- X and O differ by shape and material, not only colour.
- Contrast AA for all text; target 4.5:1 minimum, measured.
- `prefers-reduced-motion` removes shake, burst, drift, flicker, typewriter.
- Sound is optional, off via one labelled button, and failure-safe.

## 7. Engineering

- Pure `lib/game.ts`; reducer tested in isolation.
- `lib/coach.ts` grades each move with minimax plus threat/fork detection.
- No server, no data fetching, no secrets.
- Animations are CSS keyframes/transitions plus one canvas burst; no animation library.
- localStorage guarded and validated; in-memory fallback.
- CI runs typecheck, lint, unit, build, e2e.

## 8. Out of scope

- AI opponent (TASK-0032), accounts, online multiplayer, leaderboards.
- Analytics, cookies, PII.

## 9. Revision 2026-11-14 — captain and single-screen desktop

- **Capt. Hale** joins as the coach: an original SVG portrait that blinks, bobs, lifts a
  brow, and moves its mouth while the note reveals. The note grades every move (best,
  good, inaccuracy, mistake, blunder, win, draw) using minimax values plus immediate
  threat and fork detection. He never plays.
- The coach is mounted once and grid-placed: front-left on desktop, above the board on
  mobile. It is not duplicated.
- Desktop is a fixed single screen. The board width is `min(100%, 560px, calc(100dvh -
  330px))`; the result lives in the turn banner, so New Game never leaves the viewport.
- The Motion dependency and the per-character typewriter were removed. Mark, yarn,
  stamp, tally, note reveal, coach pop, move log, and captain motion are CSS; the paper
  burst is the only canvas.
- Labels use plain language where clarity matters: SCOREBOARD, RESET SCORES, DRAWS,
  MOVE HISTORY, NEW GAME, WINNER/OUT.

## 10. Revision 2026-11-14 — briefing, control rail, saved history

- **First-visit briefing:** a three-beat native dialog. Capt. Hale greets the player,
  sets up the Halver case, names the detectives, and gives the rule. Skip or replay from
  **BRIEFING**; `nine-files:intro:v1` stores the seen flag.
- **NEW GAME moved to the top-right CASE CONTROL rail** on desktop so it is always in
  reach; a full-width copy sits under the board on mobile. The board uses
  `min(100%, 560px, calc(100dvh - 280px))` now that the control no longer lives under it.
- **Match history:** the last 25 finished games persist in
  `nine-files:matches:v1` (winner, move list, date) and open in **MATCH HISTORY**.
  **RESET SCORES** clears both the counts and the log.
- Native dialogs handle focus and Escape. `.case-dialog { margin: auto }` is required
  because Tailwind preflight removes the native centering.

## 11. Revision 2026-11-14 — setup, personalized X, post-match voice

- After the story, a native setup dialog recommends full screen (F11, or Ctrl+Cmd+F on
  Mac), offers a real `requestFullscreen` button, then asks for the detective name.
  The name becomes the X side everywhere (`playerFor`): card, turn, result, stamp, coach.
- `nine-files:name:v1` and `nine-files:setup:v1` store the name and the seen flag; the
  name is editable from **EDIT NAME**.
- The subtitle is a word-by-word CSS reveal with a blinking cursor, synced to the
  captain's mouth/head/brow. Reduced motion shows the full line.
- After the result, the captain speaks again: names the winner, compliments the user's
  win, or asks for a rematch after a loss/draw.
- The character animation is constant so the dialog's localStorage-derived open state
  cannot change the SSR markup (React #418).

## 12. Revision 2026-11-14 — post-match takeover and visible reset

- 1.6 s after a result, a native post-match dialog takes over: verdict, result, and
  Capt. Hale's note. Primary follows the user's perspective: CONTINUE (X win), TRY
  AGAIN (O win), ONE MORE (draw). STAY ON THE BOARD closes; RESET SCORES clears counts
  and the match log from the dialog.
- The scoreboard reset is a bordered button (two-step confirm) instead of a tiny link.
- The post-match note uses the subtitle word reveal + cursor and the captain animation.

## 13. Revision 2026-11-14 — noir score and voice

- A procedural noir loop (Web Audio, no files): Am7 / Dm7 / E7 pads, upright-style bass,
  brushed noise, sparse bell, vinyl ticks. Starts on the first gesture; MUSIC toggle;
  persisted in `nine-files:music:v1`.
- A soft per-word voice blip plays with the subtitle reveal in the coach bubble,
  briefing, setup, and post-match verdict. The SFX toggle mutes it; music is separate.
- Header gets independent MUSIC and SFX toggles.

## 14. Revision 2026-11-15 — Vercel Web Analytics

- Owner-approved scope change: add the official `@vercel/analytics/next` component to
  the root layout, rendered only when `VERCEL_ENV=production`. This adds standard
  page-view analytics only; no custom events. Local/preview builds do not request the
  Vercel-only endpoint.
- The visible disclosure reads **VERCEL ANALYTICS · AGGREGATED · NO COOKIES**. Vercel's
  current privacy documentation states that data is aggregated, does not use cookies,
  and does not include personal identifiers; visitor recognition uses hashed request data.
- Dashboard enablement is separate from the code integration. Confirm the project's
  Vercel plan before enabling collection: Hobby includes 50,000 events/month, while Pro
  usage is billed per event. The owner reports activation on Hobby; this session could
  not inspect the dashboard or verify event reporting.
