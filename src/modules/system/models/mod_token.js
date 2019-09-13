const mongoose   = require("mongoose");

const { Schema } = mongoose;
const { Mixed }   = Schema.Types;

const Token = new Schema({
  token:           { type: String, description: "" },
  user:            { type: Mixed, description: "" },
  expires:         { type: Date, description: "" },
});

module.exports = Token;
