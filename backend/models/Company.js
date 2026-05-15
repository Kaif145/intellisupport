import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  // Bot customization
  botName: {
    type: String,
    default: 'Support Bot'
  },
  botColor: {
    type: String,
    default: '#6366f1'
  },
  welcomeMessage: {
    type: String,
    default: 'Hi! How can I help you today?'
  },
  // Plan
  plan: {
    type: String,
    enum: ['free', 'growth', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Hash password before saving
companySchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to check password
companySchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Company', companySchema);