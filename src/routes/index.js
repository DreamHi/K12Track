const createError = require("http-errors");
const system      = require("./r_system");
const english     = require("./r_english");
const auth        = require("../middleware/auth");
const config      = require("../../config/app");
const response    = require("../core/response");
const log         = require("../core/logger");
const ctrlUser    = require("../modules/system/controllers/ctrl_user");

const appName  = config.name;

module.exports = (app) => {
  app.post(`/${appName}/login`, async (req, res) => {
    try {
      const result = await ctrlUser.simpleLogin(req);
      response.sendSuccess(res, result);
    } catch (err) {
      response.sendError(res, err);
    }
  });

  app.use(`/${appName}`, auth.authenticate, system);
  app.use(`/${appName}/english`, auth.authenticate, english);

  // catch 404 and forward to error handler
  app.all("*", (req, res) => {
    response.sendError(res, new createError.NotFound("Not Found."));
  });

  // error handler for all the applications
  app.use((err, req, res) => {
    log.error(err);
    response.sendError(res, new createError.InternalServerError("Internal Server Error."));
  });
};
