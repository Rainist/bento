#!/usr/bin/env bash
set -v

bin/prepare.sh

kubeless function deploy $FUNCTION_NAME --runtime nodejs8 \
    --namespace $K8S_NAMESPACE \
    --from-file .code.zip \
    --dependencies package.json \
    --handler handler.html \
    --env MUSTACHE_PATH=$MUSTACHE_PATH \
    --env SET_ENV_ENDPOINT=$SET_ENV_ENDPOINT \
    --env TRAVIS_ORG_NAME=$TRAVIS_ORG_NAME

kubeless --namespace $K8S_NAMESPACE trigger http create ${FUNCTION_NAME}-trigger \
    --function-name $FUNCTION_NAME
