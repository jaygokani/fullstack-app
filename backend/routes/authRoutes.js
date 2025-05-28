const express = require('express');
const { pool } = require('../db');
const userLogin = require('../controllers/loginController');
const { userRegister, verifyToken } = require('../controllers/registerController');

const router = express.Router();

// Customer Registration
router.post('/register/customer', async (req, res) => userRegister(req, res, 'customer'));

// Admin Registration
router.post('/register/admin', async (req, res) => userRegister(req, res, 'admin'));

// Email Verification
router.get('/verify-email', async (req, res) => verifyToken(req, res));

// Admin Login
router.post('/login/admin', async (req, res) => await userLogin(req, res, 'admin'));

// Customer Login
router.post('login/customer', async (req, res) => await userLogin(req, res, 'admin'));

module.exports = router;