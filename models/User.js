const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String }, // null for Google users
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  provider:   { type: String, enum: ['local', 'google'], default: 'local' },
  status:     { type: String, enum: ['active', 'blocked'], default: 'active' },
  avatar:     { type: String, default: '' },
  profile: {
    age:        { type: Number },
    occupation: { type: String, default: '' },
    income:     { type: Number, default: 0 },
    city:       { type: String, default: '' },
    bio:        { type: String, default: '' },
    phone:      { type: String, default: '' },
    onboarded:  { type: Boolean, default: false },
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
