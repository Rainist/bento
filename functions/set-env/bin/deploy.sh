#!/usr/bin/env bash
set -v

bin/prepare.sh

kubeless function deploy $FUNCTION_NAME --runtime nodejs8 \
    --namespace $K8S_NAMESPACE \
    --from-file .code.zip \
    --dependencies package.json \
    --handler handler.add \
    --secrets $K8S_SECRET_NAMES \
    --env ENVS_FILE_PATH=$ENVS_FILE_PATH \
    --env TRAVIS_INFO_FILE_PATH=$TRAVIS_INFO_FILE_PATH \
    --env SLACK_WEBHOOOK_URL=$SLACK_WEBHOOOK_URL

kubeless --namespace $K8S_NAMESPACE trigger http create ${FUNCTION_NAME}-trigger \
    --function-name $FUNCTION_NAME
