const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  trader: { type: String },
  amount: { type: Number },
  ticker: { type: String },
  side: { type: String },
  filled: { type: Number },
  price: { type: Number },
  date: { type: String },
  signature: { type: String },
});

module.exports = mongoose.model("Order", schema);
