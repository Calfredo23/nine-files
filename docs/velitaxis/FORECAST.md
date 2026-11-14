# FORECAST

## Cheap tape-run of the submission

1. Reviewer opens the URL on a laptop. The title and board are visible without scroll.
   **Risk:** the board is below the fold on a short laptop. Mitigation: the title,
   turn banner, and top of the board are above 700px; the board starts at ~338px.
2. Reviewer clicks three cells. Marks animate, the turn banner changes, the move log
   fills. **Risk:** a slow phone; TBT 390ms mobile. Acceptable.
3. Reviewer completes a row. The yarn draws, the label slams, the result bar appears.
   **Risk:** the result bar is below the 900px fold. The stamp and "CROSS WINS" are
   above it, so the outcome is never hidden.
4. Reviewer clicks New Game. The board clears; the ledger stays. **Risk:** none.
5. Reviewer checks the repo. README shows the concept, the stack, the gates, and the
   mobile/desktop screenshots. **Risk:** screenshots are local PNGs; the repo carries
   WebP copies.

## What would change the plan

- If the live URL is rejected by the form for being a preview URL, redeploy with
  `vercel --prod` and resubmit the production alias.
- If the reviewer asks for an AI opponent, TASK-0032 is scoped and can be added without
  changing the required two-player path.
