const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract the token by removing "Bearer " prefix
    const tokenValue = token.split(' ')[1];
    console.log("Received Token:", tokenValue);

    const decoded = jwt.verify(tokenValue, SECRET_KEY);
    console.log("Decoded Payload:", decoded);

    req.user = decoded;

    if (!roles.includes(decoded.role)) {
      console.log(`Access Denied: Expected roles - ${role}, User role - ${decoded.role}`);
      return res.status(403).json({ msg: 'Access denied' });
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
