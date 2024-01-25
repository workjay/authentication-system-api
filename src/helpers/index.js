const jwt = require("jsonwebtoken");

/**
 * This function create json web token with our payload and expiration time
 * @param {Object} payload
 * @param {String} expiresIn
 * @returns jwt token
 */
exports.generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};
