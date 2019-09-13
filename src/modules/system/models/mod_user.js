const SchemaCommon    = require("../../mod_base");

const { BaseSchema } = SchemaCommon;

const User = new BaseSchema({
  name:              { type: String, description: "用户ID" },
  password:          { type: String, description: "密码" },
  fullName:          { type: String, description: "姓名" },
  email:             { type: String, description: "邮箱" },
});

module.exports = User;
