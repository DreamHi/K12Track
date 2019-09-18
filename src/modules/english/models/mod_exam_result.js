const mongoose        = require('mongoose');
const SchemaCommon    = require("../../mod_base");

const { BaseSchema } = SchemaCommon;
const { Schema } = mongoose;
const { Mixed }   = Schema.Types;

const ExamResult = new BaseSchema({
  paper:            { type: Mixed, description: "试卷ID" },
  questions:        [{
    question:       { type: Mixed, description: "试卷ID" },
    answer:         { type: String, description: "回答内容" },
    type:           { type: String, description: "题型" },
  }],
  score:            { type: Number, description: "考试成绩" },
});

module.exports = ExamResult;
