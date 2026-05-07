const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SUPER_ADMIN_EMAIL = 'designcustombox@gmail.com';

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Allow both admin and super_admin roles
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Only super_admin can access
const superAdminOnly = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Unauthorized: Only the Super Admin can perform this action.' });
  }
  next();
};

module.exports = { protect, adminOnly, superAdminOnly, SUPER_ADMIN_EMAIL };
