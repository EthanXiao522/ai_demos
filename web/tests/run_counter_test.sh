#!/usr/bin/env bash
# Run basic HTTP/content checks against counter.html and save a timestamped log
WEBROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=${1:-8000}
LOGDIR="$WEBROOT/logs"
mkdir -p "$LOGDIR"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
LOGFILE="$LOGDIR/test-$TIMESTAMP.log"

echo "Test run at: $(date)" > "$LOGFILE"

# Try request
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/counter.html" || echo "000")
echo "HTTP_CODE: $HTTP_CODE" >> "$LOGFILE"

if [ "$HTTP_CODE" != "200" ]; then
  echo "counter.html not reachable (trying to start server)..." >> "$LOGFILE"
  # attempt to start server
  bash "$WEBROOT/scripts/run_server.sh" "$PORT" >> "$LOGFILE" 2>&1 || true
  sleep 1
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/counter.html" || echo "000")
  echo "HTTP_CODE after start: $HTTP_CODE" >> "$LOGFILE"
  if [ "$HTTP_CODE" != "200" ]; then
    echo "ERROR: counter.html still not reachable" >> "$LOGFILE"
    echo "Dumping curl output:" >> "$LOGFILE"
    curl -s "http://localhost:$PORT/counter.html" >> "$LOGFILE" 2>&1 || true
    echo "Test finished with errors." >> "$LOGFILE"
    cat "$LOGFILE"
    exit 1
  fi
fi

echo "Fetching page snippet..." >> "$LOGFILE"
curl -s "http://localhost:$PORT/counter.html" | sed -n '1,200p' >> "$LOGFILE"

if curl -s "http://localhost:$PORT/counter.html" | grep -q "浏览次数"; then
  echo "Content check: OK (contains 浏览次数)" >> "$LOGFILE"
else
  echo "Content check: FAIL (missing 浏览次数)" >> "$LOGFILE"
fi

echo "Test finished: $(date)" >> "$LOGFILE"
cat "$LOGFILE"
