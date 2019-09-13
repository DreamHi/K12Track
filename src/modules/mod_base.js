const util       = require("util");
const mongoose   = require("mongoose");

const { Schema } = mongoose;
const { Mixed }   = Schema.Types;

const { VALID } = require("../core/constant");

const Base = {
  valid:            { type: Number, description: "数据状态 0:伦理删除 1:正常利用", default: VALID },
  createdAt:        { type: Date,   description: "作成日" },
  createdBy:        { type: Mixed,  description: "作成者" },
  updatedAt:        { type: Date,   description: "更新日" },
  updatedBy:        { type: Mixed,  description: "更新者" },
};

function BaseSchema() {
  Schema.apply(this, arguments);

  this.add(Base);
}
util.inherits(BaseSchema, Schema);

exports.BaseSchema = BaseSchema;
