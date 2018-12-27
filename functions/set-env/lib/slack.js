'use strict'

const rp = require('request-promise')

function webhook(url) {
  return {
    notify: body => {
      const options = {
        method: 'POST',
        uri: url,
        body: body,
        json: true
      }

      return rp(options)
    }
  }
}

module.exports = { webhook }
