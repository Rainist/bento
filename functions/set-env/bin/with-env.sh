#!/usr/bin/env bash
set -v

BASEDIR=$(dirname "$0")

export $(cat $BASEDIR/.env | xargs)

exec $@
