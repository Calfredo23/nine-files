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
