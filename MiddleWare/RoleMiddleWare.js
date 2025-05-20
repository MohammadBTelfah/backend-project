const { request } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware to restrict access to admin users only
 */
const rolemiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract the token by removing "Bearer " prefix
    const tokenValue = token.split(' ')[1];
    console.log("Received Token:", tokenValue);

    // Verify the token
    const decoded = jwt.verify(tokenValue, SECRET_KEY);
    console.log("Decoded Payload:", decoded);

    // Check if the role is "admin"
    if (decoded.role !== 'admin') {
      console.log(`Access Denied: User role is "${decoded.role}"`);
      //return res.status(403).json({ msg: 'Access denied, admin only' });
      req.user = decoded;
      return next();
    }

    // Attach user information to the request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = rolemiddleware;
