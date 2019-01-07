'use strict'

const fs = require('fs');
const config = {
  host: process.env.SET_ENV_ENDPOINT,
  orgName: process.env.TRAVIS_ORG_NAME,
  mustachePath: process.env.MUSTACHE_PATH
}

const filename = `${config.mustachePath}/handler.mustache`
const toBeRendered = fs.readFileSync(filename, 'utf8')
const rendered = render(toBeRendered, config)

const { render } = require('mustache')

async function html(event, context) {
  const { data: body, extensions: { response: res } } = event

  res.type('html').send(rendered)
}

module.exports = { html }
