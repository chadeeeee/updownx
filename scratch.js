const fs = require('fs');
const content = fs.readFileSync('src/screens/ControlPanel/ControlPanel.tsx', 'utf8');

const coins = [];
const COINS_REGEX = /\["([^"]+)","([^"]+)","([^"]+)"\]/g;
let match;
while ((match = COINS_REGEX.exec(content)) !== null) {
  coins.push(match[1]);
}

const validIconsMatch = content.match(/new Set\(\[\s*([\s\S]*?)\s*\]\)/);
const validIconsRaw = validIconsMatch[1];
const VALID_ICONS = new Set(validIconsRaw.match(/"([^"]+)"/g).map(s => s.replace(/"/g, '')));

const symbolToIconMatch = content.match(/const SYMBOL_TO_ICON: Record<string, string> = \{([\s\S]*?)\};/);
const SYMBOL_TO_ICON = {};
if (symbolToIconMatch) {
  const lines = symbolToIconMatch[1].split('\n');
  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      let key = parts[0].trim().replace(/["']/g, '');
      let val = parts[1].split(',')[0].trim().replace(/["']/g, '');
      SYMBOL_TO_ICON[key] = val;
    }
  }
}

let missing = [];
for (let ticker of coins) {
  let mapped = SYMBOL_TO_ICON[ticker];
  if (!mapped || !VALID_ICONS.has(mapped)) {
    missing.push(ticker);
  }
}

console.log('Missing coins:', missing.join(', '));
