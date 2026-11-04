#!/usr/bin/env bash
# Crops real photos out of the app's screen recordings for the "Every photo has a place"
# map and the hero constellation. Output: client/public/media/galaxy/<cluster>-<n>.webp (160px).
# Coordinates are in the recordings' native 1280px-wide space.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/client/public"
OUT="$SRC/media/galaxy"
mkdir -p "$OUT"

# crop <video> <time> <x> <y> <size> <name>
crop() {
  ffmpeg -loglevel error -y -ss "$2" -i "$SRC/$1.mp4" -frames:v 1 \
    -vf "crop=$5:$5:$3:$4,scale=160:160:flags=lanczos" -c:v libwebp -quality 78 "$OUT/$6.webp"
}

# Home grid, 4 columns (cells 284px): churches and fiestas, then markets.
G4X=(36 344 652 960)
n=0
for row in 594 902 1210; do for x in "${G4X[@]}"; do n=$((n+1)); crop gallery 4 $((x+7)) $((row+7)) 270 "church-$n"; done; done
n=0
for cell in "0 1518" "1 1518" "2 1518" "1 1826" "3 1826" "0 2134" "1 2134" "2 2134"; do
  set -- $cell; n=$((n+1)); crop gallery 4 $((${G4X[$1]}+7)) $(($2+7)) 270 "market-$n"
done

# Home grid, 3 columns (cells 388px): sea and sky, mountains.
G3X=(36 446 856)
n=0
for cell in "0 696" "1 696" "2 696" "2 1516"; do
  set -- $cell; n=$((n+1)); crop gallery 7.5 $((${G3X[$1]}+10)) $(($2+10)) 368 "sea-$n"
done
# Top row is partly under the app header: only 334px of it is visible.
crop gallery 7.5 $((856+30)) 342 328 sea-5; crop gallery 7.5 $((446+30)) 342 328 sea-6
n=0
for cell in "0 1516" "1 1516" "0 1926" "1 1926" "2 1926"; do
  set -- $cell; n=$((n+1)); crop gallery 7.5 $((${G3X[$1]}+10)) $(($2+10)) 368 "mountain-$n"
done

# Results grids (cells ~388px with a rank badge top-left and a score icon bottom-right).
n=0
for row in 864 1274 1684 2094; do for x in 36 448 860; do n=$((n+1)); crop image 9 $((x+12)) $((row+88)) 272 "bus-$n"; done; done
n=0
for row in 636 1056 1474 1890; do for x in 36 446 856; do n=$((n+1)); crop text 6.5 $((x+12)) $((row+88)) 272 "flower-$n"; done; done
# The photo the app was asked to match (thumbnail in the results header of image.mp4).
crop image 9 92 432 144 bus-query

ls "$OUT" | wc -l
du -sh "$OUT"
