#!/usr/bin/env bash
set -v

kubeless function delete $FUNCTION_NAME --namespace $K8S_NAMESPACE
