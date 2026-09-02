// One-off generator for docs/project-title.svg — renders "COURSE EXPERIENCE
// EXCHANGE" as retro pixel-art text (5x7 dot-matrix font) with a small
// animated scanline sweeping across it. Run with: node generate-pixel-title.js
const fs = require('fs');
const path = require('path');

// 5 wide x 7 tall bitmap font. 1 = filled pixel, 0 = empty.
const FONT = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  N: ['10001', '11001', '10101', '10101', '10011', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
};

const LINES = ['COURSE', 'EXPERIENCE', 'EXCHANGE'];
const COLORS = ['#20201e', '#6c48d7', '#e0663e'];

const PIXEL = 6; // px per bitmap dot
const GAP = 1; // px gap between dots (for the retro grid look)
const LETTER_SPACING = 2; // dots of space between letters
const CELL = PIXEL + GAP;

function lineWidthDots(line) {
  let dots = 0;
  for (const ch of line) {
    const glyph = FONT[ch] || FONT[' '];
    dots += glyph[0].length + LETTER_SPACING;
  }
  return dots - LETTER_SPACING;
}

function renderLine(line, offsetXDots, offsetYDots, color) {
  let cursor = offsetXDots;
  let rects = '';
  for (const ch of line) {
    const glyph = FONT[ch] || FONT[' '];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') {
          const x = (cursor + col) * CELL;
          const y = (offsetYDots + row) * CELL;
          rects += `<rect x="${x}" y="${y}" width="${PIXEL}" height="${PIXEL}" fill="${color}"/>`;
        }
      }
    }
    cursor += glyph[0].length + LETTER_SPACING;
  }
  return rects;
}

const lineDots = LINES.map(lineWidthDots);
const maxDots = Math.max(...lineDots);
const rowHeightDots = 9; // 7 dot glyph + 2 dots vertical spacing between lines
const widthPx = (maxDots + 4) * CELL;
const heightPx = (LINES.length * rowHeightDots + 2) * CELL;

const groups = LINES.map((line, i) => {
  const offsetX = (maxDots - lineDots[i]) / 2 + 2;
  const offsetY = 1 + i * rowHeightDots;
  return `<g>${renderLine(line, offsetX, offsetY, COLORS[i % COLORS.length])}</g>`;
}).join('\n  ');

const svg = `<svg width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Course Experience Exchange</title>
  <desc id="desc">Pixel-art wordmark reading Course Experience Exchange, with an animated highlight sweeping across the letters.</desc>
  <rect width="${widthPx}" height="${heightPx}" rx="14" fill="#f5f4f0"/>
  ${groups}
  <rect x="${-heightPx}" y="0" width="${heightPx * 0.7}" height="${heightPx}" fill="#c7b9f4" opacity=".3" transform="skewX(-18)">
    <animate attributeName="x" from="${-heightPx}" to="${widthPx + heightPx}" dur="3.4s" repeatCount="indefinite"/>
  </rect>
</svg>
`;

fs.writeFileSync(path.join(__dirname, 'project-title.svg'), svg);
console.log(`Wrote project-title.svg (${widthPx}x${heightPx})`);
