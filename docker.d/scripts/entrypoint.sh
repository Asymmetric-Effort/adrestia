#!/bin/bash
#
# entrypoint.sh
#

[[ ! -d "/var/lib/postgresql/14/main" ]] && {
  echo "initializing database..."
  pg_createcluster 14 "main" || true
}

echo "starting database..."

"/usr/lib/postgresql/14/bin/postgres" \
    -D "/var/lib/postgresql/14/main" \
    -c config_file="/etc/postgresql/14/main/postgresql.conf"
