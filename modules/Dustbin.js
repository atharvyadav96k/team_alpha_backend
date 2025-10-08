const mongoose = require("mongoose");

const binSchema = new mongoose.Schema({
  type: { type: String, enum: ["dry", "wet", "recycle"], required: true },
  level: { type: Number, default: 0 }
});

const dustbinSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  bins: [binSchema],
  points: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

dustbinSchema.pre("save", function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("Dustbin", dustbinSchema);
