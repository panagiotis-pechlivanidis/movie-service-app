const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profile: {
    name: String,
    age: Number,
    favoriteMovies: [String]
  }
});

// Password hashing
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    console.log(`Hashing password for user: ${this.username}`);
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log(`Comparing passwords for user: ${this.username}`);
  console.log(`Stored hashed password: ${this.password}`);
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`Password match result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
