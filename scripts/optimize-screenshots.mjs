import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const jobs = [
  ["desktop-board.png", "desktop-board.webp", 1280],
  ["desktop-midgame.png", "desktop-midgame.webp", 1280],
  ["desktop-win.png", "desktop-win.webp", 1280],
  ["tablet-midgame.png", "tablet-midgame.webp", 768],
  ["mobile-board.png", "mobile-board.webp", 520],
  ["mobile-win.png", "mobile-win.webp", 520],
];

await mkdir("docs/screenshots", { recursive: true });

for (const [input, output, width] of jobs) {
  const info = await sharp(`submission/screenshots/${input}`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(`docs/screenshots/${output}`);
  console.log(
    output,
    `${Math.round(info.size / 1024)} KB`,
    `${info.width}x${info.height}`,
  );
}
