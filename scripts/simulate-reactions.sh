#!/usr/bin/env bash
# Simulate many anonymous readers reacting to a post, then verify the counts.
#
# Each simulated user gets its own cookie jar, so the API sees it as a separate visitor.
# By default the script removes its own reactions afterwards, leaving real data untouched.
#
# Usage: scripts/simulate-reactions.sh [options] <slug>
#   -n USERS     number of simulated users              (default: 20)
#   -d PERCENT   share of users who dislike instead     (default: 25)
#   -p PARALLEL  concurrent requests                    (default: 10)
#   -b BASE_URL  site to test                           (default: https://blog.msweelam.dev)
#   -k           keep the reactions (skip cleanup)
#
# Examples:
#   scripts/simulate-reactions.sh software-architecture-time
#   scripts/simulate-reactions.sh -n 100 -d 10 -b http://localhost:8788 lens-framework

set -euo pipefail

USERS=20
DISLIKE_PCT=0
PARALLEL=10
BASE_URL=https://blog.msweelam.dev
KEEP=false

while getopts "n:d:p:b:k" opt; do
  case $opt in
    n) USERS=$OPTARG ;;
    d) DISLIKE_PCT=$OPTARG ;;
    p) PARALLEL=$OPTARG ;;
    b) BASE_URL=${OPTARG%/} ;;
    k) KEEP=true ;;
    *) sed -n '2,16p' "$0"; exit 1 ;;
  esac
done
shift $((OPTIND - 1))
SLUG=${1:?"missing <slug> (see -h)"}
URL="$BASE_URL/api/reactions/$SLUG"

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

count() { grep -o "\"$1\":[0-9]*" | cut -d: -f2; }

snapshot() {
  local body
  body=$(curl -sf "$URL") || { echo "✘ GET $URL failed" >&2; exit 1; }
  echo "$(count likes <<<"$body") $(count dislikes <<<"$body")"
}

# react <user-index> <like|dislike|null> → writes the HTTP status to $WORK/status-<i>
react() {
  local i=$1 reaction=$2 payload
  [[ $reaction == null ]] && payload='{"reaction":null}' || payload="{\"reaction\":\"$reaction\"}"
  curl -s -o /dev/null -w '%{http_code}\n' \
    -c "$WORK/jar-$i" -b "$WORK/jar-$i" \
    -X PUT "$URL" -H 'content-type: application/json' -d "$payload" >"$WORK/status-$i"
}

# run_all <like-or-dislike-per-user|null>: fire one request per user, PARALLEL at a time
run_all() {
  local mode=$1 i reaction
  for ((i = 1; i <= USERS; i++)); do
    if [[ $mode == null ]]; then reaction=null
    elif [[ $(<"$WORK/choice-$i") == dislike ]]; then reaction=dislike
    else reaction=like
    fi
    react "$i" "$reaction" &
    ((i % PARALLEL == 0)) && wait
  done
  wait
  local failed
  failed=$(cat "$WORK"/status-* | grep -cv '^200$' || true)
  ((failed == 0)) || echo "  ⚠ $failed request(s) did not return 200: $(cat "$WORK"/status-* | sort | uniq -c | tr '\n' ' ')"
}

read -r likes0 dislikes0 < <(snapshot)
echo "Target:  $URL"
echo "Before:  👍 $likes0  👎 $dislikes0"

# Decide each user's reaction up front so the expected totals are known.
exp_likes=0 exp_dislikes=0
for ((i = 1; i <= USERS; i++)); do
  if ((RANDOM % 100 < DISLIKE_PCT)); then echo dislike >"$WORK/choice-$i"; ((++exp_dislikes))
  else echo like >"$WORK/choice-$i"; ((++exp_likes))
  fi
done

echo "Sending: $USERS users ($exp_likes like, $exp_dislikes dislike), $PARALLEL at a time…"
start=$(date +%s)
run_all choice
echo "         done in $(($(date +%s) - start))s"

read -r likes1 dislikes1 < <(snapshot)
echo "After:   👍 $likes1  👎 $dislikes1   (Δ +$((likes1 - likes0)) / +$((dislikes1 - dislikes0)), expected +$exp_likes / +$exp_dislikes)"

status=0
if ((likes1 - likes0 == exp_likes && dislikes1 - dislikes0 == exp_dislikes)); then
  echo "✔ Counts match"
else
  echo "✘ Counts differ (real readers reacting at the same time can also cause this)"
  status=1
fi



exit $status
