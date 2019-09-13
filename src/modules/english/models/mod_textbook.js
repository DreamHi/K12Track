const SchemaCommon    = require("../../mod_base");

const { BaseSchema } = SchemaCommon;

const TextBook = new BaseSchema({
  name:               { type: String, description: "教材名" },
  grade:              { type: String, description: "年级" },
  year:               { type: String, description: "出版年" },
  imgURL:             { type: String, description: "封皮" },
});

module.exports = TextBook;
