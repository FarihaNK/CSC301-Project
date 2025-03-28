const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const extractedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole,
};
