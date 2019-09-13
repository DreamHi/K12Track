const Log4js     = require("log4js");
const helper     = require("./helper");

Log4js.configure(`${process.cwd()}/config/log4js.json`);

const application = Log4js.getLogger("application");
const error = Log4js.getLogger("error");
const access = Log4js.getLogger("access");
const operation = Log4js.getLogger("operation");

function stack(self) {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, s) {
    return s;
  };

  const err = new Error();
  Error.captureStackTrace(err, self);

  const result = err.stack;
  Error.prepareStackTrace = orig;

  return result;
}

function getIP() {
  return helper.ip();
}

function lineNo() {
  return stack(stack)[3].getLineNumber();
}

function fileName() {
  return stack(stack)[3].getFileName();
}

function getName(user) {
  let name = "";
  if (user) {
    name = `${user.name || ""}(${user.fullName || ""})`;
  }
  return name;
}

function formatOpLog(action, message, user) {
  return `[${getIP()}] [${getName(user)}] [${action}] [${message}]`;
}

function screenOpLog(action, from, to, user) {
  return `[${getIP()}] [${getName(user)}] [${from}] [${action}] [${to}]`;
}

function formatLog(message, user) {
  const host = helper.ip();
  const file = fileName();
  const line = lineNo();
  return `${message} [${getName(user)}] [${host}] [${file}] [${line}]`;
}

exports.debug = (message, user) => application.debug(formatLog(message, user));

exports.warn = (message, user) => application.warn(formatLog(message, user));

exports.info = (message, user) => application.info(formatLog(message, user));

exports.error = (message, user) => {
  error.error(formatLog(message, user));
};

exports.operation = (action, message, user) => operation.info(formatOpLog(action, message, user));

exports.screen = (action, from, to, user) => operation.info(screenOpLog(action, from, to, user));

exports.access = access;
