const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    // Extract the token from the 'Bearer' format
    const extractedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);

    // Check if the token contains the necessary user data
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token, missing user information' });
    }

    req.user = decoded;  // Attach the decoded token (user info) to the request object
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};