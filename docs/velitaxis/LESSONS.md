# LESSONS

## 2026-11-14 — THE NINE FILES build

- **Playwright treats `aria-disabled="true"` as disabled.** A test that clicks an
  occupied cell a second time times out at the actionability check. Use
  `click({ force: true })` to simulate the stray click, or test the guard in the reducer.
- **axe `label-content-name-mismatch` fires when `aria-label` omits visible text.**
  "Mute sound" over a visible "SFX ON" is a violation. Put the visible words in the
  accessible name ("Mute sound — SFX on") or remove the label and rely on content.
- **React 19's compiler lint rejects `setState` directly inside `useEffect`.** For
  localStorage, use `useSyncExternalStore` with a cached snapshot and a custom event;
  for a mount animation, derive the class from state instead of a `setShaking` effect.
- **CSS-only typewriter.** Rendering each character as a span with an animation delay
  removes the timer, the effect, and the hydration state, and the full text stays in
  the accessibility tree.
- **A transparent stamp over a busy board is unreadable.** The fix was to make it an
  opaque manila label with a shadow and a tape strip, not to add more text shadow.
- **The ARIA grid needs `grid > row > gridcell` directly.** A padded wrapper div
  between the row and the cell breaks `aria-required-parent`. Use the grid's `gap`
  instead; the yarn's 2–3px centre offset is invisible.
