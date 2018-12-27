const config = {
  envsFilePath: process.env.ENVS_FILE_PATH,
  travisInfoFilePath: process.env.TRAVIS_INFO_FILE_PATH,
  slackWebhookURL: process.env.SLACK_WEBHOOOK_URL
}

if (!config.envsFilePath
  || !config.travisInfoFilePath) {
  throw new Error("ENVS_FILE_PATH or TRAVIS_INFO_FILE_PATH is not provided")
}

const envs = () => require(config.envsFilePath) // refresh every time
const travis = require(config.travisInfoFilePath)

module.exports = { envs, travis, slackWebhookURL: config.slackWebhookURL }
