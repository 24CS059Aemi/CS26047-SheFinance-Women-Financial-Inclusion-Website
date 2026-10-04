const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'shefinance_secret_key';

// Verify JWT token from Authorization header
function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again.' });
  }
}

// Admin only middleware
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }
  next();
}

module.exports = { protect, adminOnly };
