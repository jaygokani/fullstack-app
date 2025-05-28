const jwt = require('jsonwebtoken');
const config = require('../config.js');

function createJWT(id, email, role, userOptions = {}) {
    const payload = {
        id: id,
        email: email,
        role: role
    }
    let options = {
        expiresIn: config.JWT_EXPIRATION // Token expiration time
    }
    if (userOptions) {
        options = {
            ...options,
            ...userOptions
        }
    }

    const token = jwt.sign(payload, config.JWT_SECRET, options);

    return token;
}

module.exports = createJWT;
