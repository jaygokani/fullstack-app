const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const createJWT = require('../utils/jwtToken');

async function userLogin(req, res, role) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' }); // User not found
        }

        const userIndex = users.findIndex(user => user.role == role);
        const user = users[userIndex];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // User not found
        }

        if (user.role !== role) {
            return res.status(403).json({ message: 'You are not allowed to login from here' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Incorrect password
        }

        // create and set jwt token in the set-Cookie
        token = await createJWT(user.id, user.email, user.role);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'Strict', // Adjust as needed
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })

        res.json({ message: 'Admin login successful', user: { id: user.id, firstName: user.firstName, email: user.email, role: user.role } });


    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

module.exports = userLogin;