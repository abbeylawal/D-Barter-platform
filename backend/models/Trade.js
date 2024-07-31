const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  counterparty: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["initiated", "completed", "cancelled"],
    default: "initiated",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Trade", TradeSchema);
