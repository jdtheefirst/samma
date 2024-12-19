// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  participants: { type: [String] },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isAllDay: { type: Boolean, default: false },
  recurrenceRule: { type: String },
});

module.exports = mongoose.model("Event", eventSchema);
