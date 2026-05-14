#!/usr/bin/env bash
# Start a simple static HTTP server serving the `web` directory
WEBROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=${1:-8000}
LOGFILE="$WEBROOT/server.log"
cd "$WEBROOT" || exit 1
nohup python3 -m http.server "$PORT" > "$LOGFILE" 2>&1 &
echo $! > "$WEBROOT/.server.pid"
echo "Started server on port $PORT, pid $(cat $WEBROOT/.server.pid)"
