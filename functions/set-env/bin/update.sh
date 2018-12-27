#!/usr/bin/env bash
set -v

bin/prepare.sh

kubeless function update $FUNCTION_NAME \
    --namespace $K8S_NAMESPACE \
    --from-file .code.zip \
    --dependencies package.json \
    --handler handler.add
