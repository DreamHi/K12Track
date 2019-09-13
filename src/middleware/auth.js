const createError = require("http-errors");
const response    = require("../core/response");
const config      = require("../../config/app");
const ctrlToken   = require("../modules/system/controllers/ctrl_token");

exports.authenticate = async (req, res, next) => {
  const token  = req.headers[config.tokenHeader] || "";

  if (!token) {
    response.sendError(res, new createError.Unauthorized());
    return;
  }

  try {
    const result = await ctrlToken.verify(token);
    await ctrlToken.update(token);

    req.user = result.user;
    req.token = token;
    next();
  } catch (err) {
    response.sendError(res, new createError.Unauthorized());
    return;
  }
};
