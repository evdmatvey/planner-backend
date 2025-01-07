#!/bin/sh

MIGRATION_NAME="migration_$(date +%Y%m%d%H%M%S)"

npx prisma migrate dev --name $MIGRATION_NAME

npx prisma generate

exec "$@"