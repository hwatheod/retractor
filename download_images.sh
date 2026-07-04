#!/bin/sh
#
# download_images.sh — fetch all chess piece images required by retractor
#
# The app references 26 PNG files in images/  (see boardGui.js:getImgFilename
# and the <img> tags in retractor.html).  They follow the Wikimedia Commons
# "Cburnett" naming convention:
#
#     Chess_{unit}{pieceColor}{squareColor}{size}.png
#
#   unit        k q r b n p
#   pieceColor  l = white    d = black
#   squareColor l = light    d = dark
#   size        44 (pieces) / 45 (empty squares)
#
# Usage:
#   ./download_images.sh                         # uses the default BASE_URL
#   BASE_URL="https://example.org/chess/" ./download_images.sh
#
set -eu

# ── Configurable base URL ──────────────────────────────────────────────
# Trailing slash is added automatically if missing.
# Default: Wikimedia Commons upload mirror.
BASE_URL="${BASE_URL:-http://xenon.stanford.edu/~hwatheod/retractor2/images/}"

# Ensure trailing slash
BASE_URL="${BASE_URL%/}/"

# Destination directory (relative to the script location)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEST="${SCRIPT_DIR}/images"

mkdir -p "$DEST"

ok=0
fail=0

download() {
    _file="$1"

    # Skip if already present and non-empty
    if [ -s "$DEST/$_file" ]; then
        echo "  ✓ $_file  (already exists)"
        ok=$((ok + 1))
        return 0
    fi

    # Wikimedia Commons uses an MD5-hash directory layout:
    #   /x/xy/Filename  (first char / first two chars of MD5)
    # We try that first, then fall back to a flat URL.
    _md5="$(printf '%s' "$_file" | md5sum | cut -c1-2)"
    _hash_a="$(printf '%s' "$_md5" | cut -c1)"

    _url="${BASE_URL}${_hash_a}/${_md5}/${_file}"

    if curl -fsSL "$_url" -o "$DEST/$_file"; then
        echo "  ✓ $_file"
        ok=$((ok + 1))
    else
        # Fallback: try flat URL (no hash subdirs)
        _url_flat="${BASE_URL}${_file}"
        if curl -fsSL "$_url_flat" -o "$DEST/$_file"; then
            echo "  ✓ $_file  (flat URL)"
            ok=$((ok + 1))
        else
            echo "  ✗ $_file  (FAILED)"
            rm -f "$DEST/$_file"
            fail=$((fail + 1))
        fi
    fi
}

# ── Download ───────────────────────────────────────────────────────────
echo "Downloading chess images into $DEST/"
echo "Base URL: $BASE_URL"
echo

# 1. Empty-square backgrounds (size 45)
for sq in l d; do
    download "Chess_${sq}45.png"
done

# 2. Pieces: every unit × pieceColor × squareColor (size 44)
for unit in k q r b n p; do
    for pcolor in l d; do
        for sq in l d; do
            download "Chess_${unit}${pcolor}${sq}44.png"
        done
    done
done

echo
echo "Done: $ok succeeded, $fail failed (out of 26)"

if [ "$fail" -gt 0 ]; then
    echo ""
    echo "Some downloads failed. Possible causes:"
    echo "  - Wrong BASE_URL (set it explicitly: BASE_URL=... ./download_images.sh)"
    echo "  - Network issues"
    echo "  - File naming differs at the source"
    exit 1
fi
