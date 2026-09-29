#!/bin/zsh
# Tile a surveyed site's captures into one sheet: scripts/research/survey-sheet.sh <slug>
d="docs/research/survey/$1"
f=($d/01-9s.jpg(N) $d/02-after-gate.jpg(N) $d/03-cursor.jpg(N) $d/1*-scroll.jpg(N))
node scripts/research/sheet.mjs "$d/sheet.png" 4 440 "${f[@]}" >/dev/null && echo "$d/sheet.png"
