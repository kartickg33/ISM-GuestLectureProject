const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    accountType: { type: Number, required: true, enum: [1, 2, 3] }, //1:Mobile 2:UPI 3:IFSC Code
    accountInfo: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
