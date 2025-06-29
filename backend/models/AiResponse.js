const mongoose = require('mongoose');

const AiResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    emotion: {
      type: String,
      required: true
    },
    journalText: {
      type: String,
      required: true
    },
    aiResponse: {
      type: String,
      required: true
    },
    playlistId: {
      type: String,
      default: null
    },
    ttsUrl: {
      type: String,
      default: null  
    },
    sessionUrl: {
      type: String,
      default: null  
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiResponse', AiResponseSchema);
