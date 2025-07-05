

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Function to create a token
const createToken = (_id) => {
  try {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw new Error('Failed to create token');
  }
}

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
}

// Signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.signup(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message || 'Signup failed' });
  }
}

module.exports = { signupUser, loginUser };
