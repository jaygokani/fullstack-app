const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { sendVerificationEmail } = require('../emailService');
const crypto = require('crypto');

// Helper function to generate a unique token
const generateToken = () => crypto.randomBytes(32).toString('hex');

async function userRegister(req, res, role) {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [existingUsers] = await pool.query('SELECT email, role FROM users WHERE email = ?', [email]);
        // console.log(existingUsers);
        if (existingUsers.length > 0 && existingUsers.some(user => user.role == role)) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = generateToken();
        const isVerified = process.env.NODE_ENV == 'development' ? 1 : 0;

        await pool.query(
            'INSERT INTO users (firstName, lastName, email, password, role, emailVerificationToken, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, role, verificationToken, isVerified]
        );

        isVerified ? console.log('Dev Mode') : await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Admin registered successfully. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}

async function verifyToken(req, res) {
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

        // res.redirect(`${process.env.APP_BASE_URL}/login?verified=true`);
        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Server error during email verification.' });
    }
}

module.exports = {
    userRegister,
    verifyToken,
};