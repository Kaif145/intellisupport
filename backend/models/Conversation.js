import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  visitorId: {
    type: String,
    default: 'anonymous'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated'],
    default: 'active'
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);