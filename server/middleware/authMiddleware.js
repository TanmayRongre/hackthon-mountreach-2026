const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes and authenticate JWT tokens
 */
const protect = async (req, res, next) => {
  let token;

  // Check Bearer token in Authorization header or in cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized to access this route, please log in'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'supersecretkey_hackathon_2026_change_in_production'
    );

    // Fetch user and attach to req object
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      return next(new Error('User belonging to this token no longer exists'));
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    return next(new Error('Not authorized, invalid or expired token'));
  }
};

/**
 * Middleware to restrict access based on user role (e.g., admin)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
