const createError = require("http-errors");
const Joi         = require("joi");
const Token       = require("./ctrl_token");
const UserSchema  = require("../models/mod_user");
const Model       = require("../../../core/model");
const log         = require("../../../core/logger");
const helper      = require("../../../core/helper");
const constant    = require("../../../core/constant");

const { DB_NAME_K12TRACK, SCHEMA_USER, VALID } = constant;
const UserModel = new Model(DB_NAME_K12TRACK, SCHEMA_USER, UserSchema);

const loginValidate = (obj) => {
  const schema = Joi.object({
    name: Joi.string().trim().regex(/^[a-zA-Z0-9_-]{4,30}$/).required(),
    pass: Joi.string().trim().max(30).required(),
  });

  const output = Joi.validate(obj, schema, { allowUnknown: true });
  if (output.error) {
    throw new createError.BadRequest(__("modules.system.user.login.error"));
  }
};

exports.simpleLogin = async (req) => {
  log.info("user.simpleLogin() start.");
  const { name, pass } = req.body;

  loginValidate(req.body);

  const sha256Pass = helper.sha256(pass);
  const condition = { name, valid: VALID };
  const projection = "email name password";

  try {
    const user = await UserModel.getOne(condition, projection);
    if (!user || user.password !== sha256Pass) {
      throw new createError.BadRequest(__("modules.system.user.login.error"));
    }

    delete user._doc.password;
    const obj  = { user: {}, token: "" };
    obj.user = user;
    const tokenObj = await Token.create(obj.user);
    obj.token = tokenObj.token;
    
    log.info("user.simpleLogin() end.");
    log.operation("simpleLogin", "login success!", obj.user);
    return obj;
  } catch (err) {
    throw err;
  }
};

exports.logout = async (req) => {
  log.info("user.logout() start.", req.user);
  try {
    await Token.delete(req.token);
    log.info("user.logout() end.", req.user);
    log.operation("logout", "logout success!", req.user);
  } catch (err) {
    throw err;
  }
};
