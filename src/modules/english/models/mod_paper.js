const SchemaCommon    = require("../../mod_base");

const { BaseSchema } = SchemaCommon;

const Paper = new BaseSchema({
  type:                { type: String, description: "模块(module)、单元（unit）" },
  grade:               { type: String, description: "年级" },
  name:                { type: String, description: "卷子名" },
});

module.exports = Paper;
