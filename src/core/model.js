const createError = require("http-errors");
const constant    = require("./constant");
const db          = require("./db");

class Model {
  constructor(code, name, scheme) {
    const conn = db.createConnection(code);
    this.m = conn.model(name, scheme);
  }

  async create(obj) {
    try {
      // eslint-disable-next-line new-cap
      return await new this.m(obj).save();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.create.error"));
    }
  }

  async remove(id, obj = {}) {
    try {
      obj.valid = constant.INVALID;
      return await this.m.findByIdAndUpdate(id, obj).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.delete.error"));
    }
  }

  async removeByCondition(condition, obj = {}, options) {
    try {
      obj.valid = constant.INVALID;
      return await this.m.update(condition, obj, options).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.delete.error"));
    }
  }

  async delete(condition) {
    try {
      return await  this.m.remove(condition).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.delete.error"));
    }
  }

  async update(id, obj) {
    try {
      return await this.m.findByIdAndUpdate(id, obj).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.update.error"));
    }
  }

  async updateByCondition(condition, obj, options) {
    try {
      return await this.m.update(condition, obj, options).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.update.error"));
    }
  }

  async get(id, projection = "") {
    this.m.findById(id, projection);
    try {
      return await this.m.findById(id, projection).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.search.error"));
    }
  }

  async getOne(condition, projection = "") {
    try {
      return await this.m.findOne(condition, projection).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.search.error"));
    }
  }

  async count(condition) {
    try {
      return await this.m.count(condition).exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.search.error"));
    }
  }

  async getList(condition, projection,
    skip = constant.MOD_FIND_DEFAULT_SKIP,
    limit = constant.MOD_FIND_DEFAULT_LIMIT,
    sort = "") {
    try {
      return await this.m.find(condition)
        .select(projection)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec();
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.search.error"));
    }
  }

  async aggregate(m, p, g) {
    try {
      return await this.m.aggregate([{ $match: m }, { $project: p }, { $group: g }]);
    } catch (err) {
      throw new createError.InternalServerError(__("common.db.search.error"));
    }
  }
}

module.exports = Model;
