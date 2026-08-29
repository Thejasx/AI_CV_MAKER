const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aicvmaker_jwt_secret_key_2026_super_secure', {
    expiresIn: '30d',
  });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  if (!getIsConnected()) {
    // In-memory mock response if DB is offline
    const mockUser = { _id: 'guest_' + Date.now(), name, email };
    const token = generateToken(mockUser._id);
    return res.status(201).json({
      success: true,
      user: mockUser,
      token,
      message: 'Registered in session mode (MongoDB offline)',
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  if (!getIsConnected()) {
    const mockUser = { _id: 'guest_' + Date.now(), name: email.split('@')[0], email };
    return res.status(200).json({
      success: true,
      user: mockUser,
      token: generateToken(mockUser._id),
      message: 'Logged in session mode',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  if (!getIsConnected() || req.user.id.startsWith('guest_')) {
    return res.json({
      success: true,
      user: { _id: req.user.id, name: 'Guest User', email: 'guest@session.local' },
    });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
