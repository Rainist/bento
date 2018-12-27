const rp = require('request-promise')
const _ = require('lodash')

const { travis } = require('./config')

const travisHeaders = {
  'Travis-API-Version': '3',
  'Authorization': `token ${travis.token}`
}

const env_vars_cached = {}
const env_vars_cache_expiry_sec = 15

function assertCacheExpiry({ cachedTime }) {
  const now = new Date()
  const diff = (now.getTime() - cachedTime.getTime()) / 1000

  return diff < env_vars_cache_expiry_sec
}

function getAllEnvVars(repo) {
  const cached = env_vars_cached[repo]
  if (cached && assertCacheExpiry(cached)) {
    console.log('using cache for fetching envs')
    return Promise.resolve(cached.data)
  }

  var options = {
    method: 'GET',
    uri: `https://api.travis-ci.com/repo/${repo}/env_vars`,
    headers: travisHeaders,
    json: true // Automatically parses the JSON string in the response
  }

  return rp(options).then(data => {
    env_vars_cached[repo] = { data, cachedTime: new Date() }
    return data
  })
}

function getEnv(repo, env) {
  return getAllEnvVars(repo)
    .then(resBody => {
      const { env_vars } = resBody
      return _.chain(env_vars).filter(envVar => envVar.name === env.name).first().value()
    })
}

async function delEnv(repo, env) {
  const envVar = await getEnv(repo, env)
  const { id: env_id } = envVar

  var options = {
    method: 'DELETE',
    uri: `https://api.travis-ci.com/repo/${repo}/env_var/${env_id}`,
    headers: travisHeaders,
    json: true
  }

  return rp(options)
}

function tryRewrite(rewrite, err, repo, env) {
  if (rewrite &&
    err.response.body.error_type === 'duplicate_resource'
  ) {
    return delEnv(repo, env).then(() => setEnv(repo, env))
  }
  throw err
}

function setEnv(repo, env, rewrite=false) {
  let toLog = `attempting to set env: ${env.name}`
  if (rewrite) { toLog = `${toLog}. will retry once if fail` }
  console.log(toLog)

  const body = { 'env_var.name': env.name, 'env_var.value': env.value, 'env_var.public': env.public }

  var options = {
    method: 'POST',
    uri: `https://api.travis-ci.com/repo/${repo}/env_vars`,
    body,
    headers: travisHeaders,
    json: true
  }
 
  return rp(options)
    .then(data => ({ success: true, name: data.name, rawData: data }))
    .catch(err => tryRewrite(rewrite, err, repo, env))
    .catch(err => ({ success: false, name: env.name, message: err.message }))
}

module.exports = { setEnv }
