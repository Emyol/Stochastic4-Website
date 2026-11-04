#!/usr/bin/env bash
# Re-encodes the site's media for the web into client/public/media/.
# Originals in client/public/ are left untouched. Re-run after adding a recording.
# Requires ffmpeg (full build, with libx264, libvpx-vp9 and libwebp).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/client/public"
OUT="$SRC/media"
mkdir -p "$OUT/posters" "$OUT/team"

# App screen recordings (1280x2800 @ 60fps) -> 720px wide, 30fps H.264 with a bitrate ceiling,
# no audio, fast start. Poster = first frame, so nothing jumps when playback starts.
for name in text image filter darkmode pinkmode gallery detail eula loading embedding settings; do
  in="$SRC/$name.mp4"
  [ -f "$in" ] || continue
  ffmpeg -loglevel error -y -i "$in" -an -vf "fps=30,scale=720:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf 28 -maxrate 1200k -bufsize 2400k -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -loglevel error -y -i "$OUT/$name.mp4" -frames:v 1 -c:v libwebp -quality 80 "$OUT/posters/$name.webp"
done

# Hero render with alpha (VP9 + alpha). Decode with libvpx-vp9 so the alpha plane survives.
ffmpeg -loglevel error -y -c:v libvpx-vp9 -i "$SRC/kitako_app_hero.webm" -an \
  -vf "scale=1280:-2:flags=lanczos" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 36 \
  -row-mt 1 -deadline good "$OUT/hero.webm"

# Team portraits -> 640px wide WebP.
for f in Amiel_Acuna Marcus_Austria Ric_barrios Jhezra_Tolentino justine_pura; do
  ffmpeg -loglevel error -y -i "$SRC/$f.png" -vf "scale=640:-2:flags=lanczos" -c:v libwebp -quality 82 "$OUT/team/$f.webp"
done

# "How it works" thumbnails: real ranked results for "mga bulaklak sa garden" (text.mp4 @ 6.5s,
# 1280px-wide coordinates) plus the rose used as the "your photo" input.
mkdir -p "$OUT/how"
crop() { ffmpeg -loglevel error -y -ss 6.5 -i "$SRC/text.mp4" -frames:v 1 -vf "crop=$1,scale=192:192" -c:v libwebp -quality 82 "$OUT/how/$2.webp"; }
crop 388:388:36:636 r1; crop 388:388:446:636 r2; crop 388:388:856:636 r3; crop 388:388:446:1474 r4; crop 200:200:570:1570 photo

# Favicons from the app logo.
ffmpeg -loglevel error -y -i "$SRC/kitako_logo.png" -vf "scale=32:32:flags=lanczos" "$SRC/favicon-32.png"
ffmpeg -loglevel error -y -i "$SRC/kitako_logo.png" -vf "scale=180:180:flags=lanczos" "$SRC/apple-touch-icon.png"
ffmpeg -loglevel error -y -i "$SRC/kitako_logo.png" -vf "scale=192:192:flags=lanczos" -c:v libwebp -quality 90 "$OUT/logo-192.webp"

echo "Done. Sizes:"
du -sh "$OUT" "$OUT"/* 2>/dev/null | sort -h | tail -n 30
