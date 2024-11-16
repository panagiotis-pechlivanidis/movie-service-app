const User = require('./models/userModel');

// Middleware to get the authenticated user
exports.getProfile = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).select('profile username email');
  res.json(user);
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { name, age, favoriteMovies } = req.body;

  await User.findByIdAndUpdate(userId, { profile: { name, age, favoriteMovies } });
  res.json({ message: 'Profile updated successfully' });
};
