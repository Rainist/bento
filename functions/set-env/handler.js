const _ = require("lodash");
const { from, of } = require("rxjs");
const { concatMap, catchError, toArray } = require("rxjs/operators");

const { envs, slackWebhookURL } = require("./lib/config");
const { setEnv } = require("./lib/travis");

const { webhook } = require("./lib/slack");
const { notify } = webhook(slackWebhookURL);

function genResponse(result) {
  const allSuccess = _.chain(result)
    .map(({ success }) => success)
    .reduce((acc, curr) => acc && curr)
    .value();

  const env = _.chain(result)
    .map(({ success, name, message }) => ({ success, name, message }))
    .value();

  const status = allSuccess ? 201 : 200;

  return { status, env, allSuccess };
}

function emitResponse(res, result) {
  if (!res) {
    console.error('no "res" provided trying to respond');
    console.log("with the result: ", result);
    return;
  }

  const { status, env, allSuccess } = genResponse(result);
  res.status(status).json({ env, allSuccess });

  return Promise.resolve(allSuccess);
}

function notifySuccess(repo, who) {
  const text = `env has set for \`${repo}\` in travis by ${who}`;
  return notify({ text });
}

function notifyFail(repo, who) {
  let text = `set env has *failed* for \`${repo}\` in travis by ${who}`;

  if (!repo || !who) {
    text =
      "set env targeting travis has *failed* and either *repo* or *who* is not provided.";
  }

  return notify({ text });
}

async function _add(rawRepo, who, res) {
  const repo = rawRepo.replace("/", "%2F");

  const result = await from(envs())
    .pipe(
      concatMap(env =>
        from(setEnv(repo, env, env.rewrite)).pipe(catchError(err => of(err)))
      ),
      toArray()
    )
    .toPromise();

  const isSuccess = await emitResponse(res, result);

  if (slackWebhookURL) {
    const notifyFn = isSuccess ? notifySuccess : notifyFail;
    await notifyFn(rawRepo, who).catch(console.error);
  }
}

async function add(event, context) {
  const {
    data: body,
    extensions: { response: res }
  } = event;
  const { repo, who } = body;

  try {
    await _add(repo, who, res);
  } catch (e) {
    console.error(e);
    if (res) {
      res.status(500).end("something went wrong");
    }

    notifyFail(repo, who).catch(console.error);
  }
}

module.exports = { add };
