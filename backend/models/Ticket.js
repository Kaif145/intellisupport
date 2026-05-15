import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  visitorMessage: {
    type: String,
    required: true
  },
  // Full chat history at time of escalation
  chatHistory: [{
    role: String,
    content: String
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);