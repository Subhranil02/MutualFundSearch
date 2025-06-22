const mongoose = require('mongoose');

const savedFundSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schemeCode: {
    type: String,
    required: true,
  },
  schemeName: {
    type: String,
    required: true,
  },
  fundHouse: String,
  schemeType: String,
}, { timestamps: true });

module.exports = mongoose.model('SavedFund', savedFundSchema);
