const pairs = [
  ["PAPER on INK", "#EFE6D2", "#0B0C0E", 4.5],
  ["SMOKE on INK", "#9A958A", "#0B0C0E", 4.5],
  ["SMOKE on COAL", "#9A958A", "#14161A", 4.5],
  ["TUNGSTEN on INK", "#E3A44B", "#0B0C0E", 4.5],
  ["TUNGSTEN on COAL", "#E3A44B", "#14161A", 4.5],
  ["EMBER on INK", "#D97079", "#0B0C0E", 3],
  ["INK on MANILA", "#0B0C0E", "#D8C39A", 4.5],
  ["OXBLOOD on MANILA", "#8E2B33", "#D8C39A", 4.5],
  ["COLD on MANILA", "#3F4753", "#D8C39A", 4.5],
  ["PAPER on OXBLOOD", "#EFE6D2", "#8E2B33", 4.5],
  ["PAPER on COAL", "#EFE6D2", "#14161A", 4.5],
  ["MANILA on CORK (non-text)", "#D8C39A", "#6F4A2D", 3],
];

function rgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function luminance({ r, g, b }) {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(rgb(a)), luminance(rgb(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function composite(foreground, alpha, background) {
  const fg = rgb(foreground);
  const bg = rgb(background);
  const mix = (a, b) => Math.round(a * alpha + b * (1 - alpha));
  return `#${[mix(fg.r, bg.r), mix(fg.g, bg.g), mix(fg.b, bg.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

const composites = [
  ["INK 70% on MANILA", composite("#0B0C0E", 0.7, "#D8C39A"), "#D8C39A", 4.5],
  ["SMOKE on COAL 70% over INK", "#9A958A", composite("#14161A", 0.7, "#0B0C0E"), 4.5],
  ["SMOKE on COAL 60% over INK", "#9A958A", composite("#14161A", 0.6, "#0B0C0E"), 4.5],
  ["PAPER on COAL 80% over INK", "#EFE6D2", composite("#14161A", 0.8, "#0B0C0E"), 4.5],
];

let failed = false;

for (const [label, foreground, background, minimum] of [...pairs, ...composites]) {
  const value = ratio(foreground, background);
  const pass = value >= minimum;
  if (!pass) {
    failed = true;
  }
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${value.toFixed(2)}:1  (min ${minimum}:1)  ${label}`,
  );
}

if (failed) {
  process.exitCode = 1;
}
