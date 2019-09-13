const crypto        = require("crypto");
const createError   = require("http-errors");
const Model         = require("../../../core/model");
const constant      = require("../../../core/constant");
const app           = require("../../../../config/app");
const tokenSchema   = require("../models/mod_token");

const { tokenLength,  tokenExpires } = app;
const { DB_NAME_K12TRACK, SCHEMA_TOKEN } = constant;
const ModelToken = new Model(DB_NAME_K12TRACK, SCHEMA_TOKEN, tokenSchema);

exports.create = async (user) => {
  const token = crypto.randomBytes(tokenLength).toString("hex");
  const expires = new Date(Date.now() + tokenExpires);
  const obj = { token, user, expires };
  try {
    const result = await ModelToken.create(obj);
    return result;
  } catch (err) {
    throw err;
  }
};

exports.verify = async (token) => {
  try {
    const condition = { token };
    const tokenObj = await ModelToken.getOne(condition, "");
    if (!tokenObj || tokenObj.expires < new Date()) {
      throw new createError.Unauthorized();
    }
    return tokenObj;
  } catch (err) {
    throw err;
  }
};

exports.update = async (token) => {
  const condition = { token };
  const expires = new Date(Date.now() + tokenExpires);
  const obj = { expires };
  try {
    const tokenObj = await ModelToken.updateByCondition(condition, obj, {});
    if (!tokenObj) {
      throw new createError.Unauthorized();
    }
  } catch (err) {
    throw err;
  }
};

exports.delete = async (token) => {
  const condition = { token };
  try {
    const result = await ModelToken.delete(condition);
    return result;
  } catch (err) {
    throw err;
  }
};
