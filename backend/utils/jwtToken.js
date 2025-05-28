const jwt = require('jsonwebtoken');

function createJWT(id, email, role, userOptions = {}) {
    const payload = {
        id: id,
        email: email,
        role: role
    }
    let options = {
        expiresIn: process.env.JWT_EXPIRATION // Token expiration time
    }
    if (userOptions) {
        options = {
            ...options,
            ...userOptions
        }
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    return token;
}

module.exports = createJWT;
