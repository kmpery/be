const mongoose = require('mongoose');
const { Schema, model, models } = mongoose;

const rsvpSchema = new Schema(
  {
    name: { type: String, required: true },
    willAttend: { type: String, required: true },
  },
  { timestamps: true }
);

const RSVP = models.RSVP || model('RSVP', rsvpSchema);

module.exports = RSVP;
