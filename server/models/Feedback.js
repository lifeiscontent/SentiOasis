import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  apiKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  predictedSentiment: {
    type: String,
    required: true
  },
  userCorrection: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    required: true
  },
  comments: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Feedback', feedbackSchema);
