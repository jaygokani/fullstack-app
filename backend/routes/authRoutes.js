// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../db');
const { sendVerificationEmail } = require('../emailService');

const router = express.Router();

// Helper function to generate a unique token
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Customer Registration
router.post('/register/customer', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = generateToken();
    const role = 'customer';

    // Insert user into database
    const [result] = await pool.query(
      'INSERT INTO users (firstName, lastName, email, password, role, emailVerificationToken) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, role, verificationToken]
    );

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Customer registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Admin Registration
router.post('/register/admin', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = generateToken();
    const role = 'admin';

    await pool.query(
      'INSERT INTO users (firstName, lastName, email, password, role, emailVerificationToken) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, role, verificationToken]
    );

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Admin registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Email Verification
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is missing.' });
  }

  try {
    const [users] = await pool.query('SELECT id, isVerified FROM users WHERE emailVerificationToken = ?', [token]);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    const user = users[0];
    if (user.isVerified) {
      return res.status(200).json({ message: 'Email already verified.' });
    }

    await pool.query('UPDATE users SET isVerified = TRUE, emailVerificationToken = NULL WHERE id = ?', [user.id]);

    // Optionally, you can redirect the user to a login page or a success page on the frontend
    // For an API, returning a success message is usually sufficient.
    // res.redirect(`${process.env.APP_BASE_URL}/login?verified=true`);
    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification.' });
  }
});


// Admin Login
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' }); // User not found
    }

    const user = users[0];

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not allowed to login from here' });
    }

    if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Incorrect password
    }

    // At this point, admin is authenticated.
    // You might want to create a session or JWT here.
    // For simplicity, returning a success message.
    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.json({ message: 'Admin login successful', token, user: { id: user.id, email: user.email, role: user.role } });

    res.json({ message: 'Admin login successful', user: { id: user.id, firstName: user.firstName, email: user.email, role: user.role } });


  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;