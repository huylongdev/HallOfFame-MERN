const mongoose = require('mongoose');
const commentSchema = require('./comment.model');

const playerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  image: { type: String, required: true },
  cost: { type: Number, required: true },
  isCaptain: { type: Boolean, default: false },
  infomation: { type: String, required: true },
  comments: [commentSchema],
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
