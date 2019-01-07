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
FUNCTION_NAME=bento-set-env-web
K8S_NAMESPACE=your-name-space
SET_ENV_ENDPOINT=/set-env/
TRAVIS_ORG_NAME=your-travis-org-name
MUSTACHE_PATH=/kubeless
```
