# Scripts in ./bin

## Deploy

### Use with `bin/with-env.sh`

#### Usage
`$ bin/with-env.sh bin/[something].sh`

#### Example
`$ bin/with-env.sh bin/deploy.sh`

#### Why?
- every script in `bin/` requires some environment variaables.
- you don't have to use `bin/with-env.sh` but it's convinient than export manaully.
- `.env` is gitignored by [./.gitignore](./.gitignore)

an example `.env`:
```
FUNCTION_NAME=bento-set-env
K8S_NAMESPACE=your-name-space
K8S_SECRET_NAMES=your-bento-secret-name-in-k8s
ENVS_FILE_PATH=/your-bento-secret-name-in-k8s/envs.json
TRAVIS_INFO_FILE_PATH=/your-bento-secret-name-in-k8s/travis.json
SLACK_WEBHOOOK_URL=https://hooks.slack.com/services/your-slack-webhook-url
```
