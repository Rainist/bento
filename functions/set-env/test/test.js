const assert = require("assert");
const _ = require("lodash");

process.env.ENVS_FILE_PATH = "../examples/envs.json"; // relative to "../lib/config.js"
process.env.TRAVIS_INFO_FILE_PATH = "../examples/travis.json";

const { preset } = require("../handler");
const { makeResponse } = require("./mock-response");

const envsObscured = [
  {
    name: "TEST_1",
    value: "TEST_1",
    rewrite: true,
    public: true
  },
  {
    name: "TEST_2",
    value: "(hidden)",
    rewrite: true,
    public: false
  },
  {
    name: "TEST_4",
    value: "(hidden)",
    rewrite: false,
    public: false
  },
  {
    name: "TEST_5",
    value: "TEST_5",
    rewrite: true,
    public: true
  },
  {
    name: "TEST_3",
    value: "TEST_3",
    rewrite: true,
    public: true
  }
];

describe("handler.js", () => {
  describe("Fetch", () => {
    it("should fetch obscured envs preset", () => {
      const response = makeResponse({
        json: arg => {
          assert(JSON.stringify(arg) === JSON.stringify(envsObscured));
        }
      });

      preset({ extensions: { response } });
    });
  });
});
