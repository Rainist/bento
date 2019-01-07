#!/usr/bin/env bash
set -v
kubeless function ls $FUNCTION_NAME --namespace $K8S_NAMESPACE
