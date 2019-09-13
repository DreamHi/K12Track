const SchemaCommon    = require("../../mod_base");

const { BaseSchema } = SchemaCommon;

const Word = new BaseSchema({
  textbook:            { type: String, description: "教材" },
  grade:               { type: String, description: "年级" },
  module:              { type: String, description: "模块" },
  unit:                { type: String, description: "单元" },
  word:                { type: String, description: "单词" },
  meaning:             { type: String, description: "词义" },
  example:             { type: String, description: "例句" },
  partsOfSpeech:       { type: String, description: "词性" },
  phoneticSymbol:      { type: String, description: "音标" },
});

module.exports = Word;
