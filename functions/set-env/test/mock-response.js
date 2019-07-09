function makeResponse(assert) {
  const res = {
    end: arg => {
      if (assert.end) assert.end(arg);
    },
    json: arg => {
      if (assert.json) assert.json(arg);
    }
  };

  const acceptStatus = {
    status: code => {
      if (assert.status) assert.status(code);
      return res;
    }
  };

  const response = Object.assign(res, acceptStatus);
  return response;
}

module.exports = { makeResponse };
