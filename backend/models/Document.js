import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'txt'],
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  // How many chunks were created from this doc
  chunkCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);