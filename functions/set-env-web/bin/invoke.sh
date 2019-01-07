#!/kubelessusr/bin/env bash
set -v

kubeless function call $FUNCTION_NAME \
    --namespace $K8S_NAMESPACE \
    --data '{"key": "value"}'
