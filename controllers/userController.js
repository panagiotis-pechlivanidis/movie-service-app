const UserService = require('../services/userService');

const userService = new UserService();

exports.register = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user: result });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: 'Invalid credentials', error: error.message });
  }
};