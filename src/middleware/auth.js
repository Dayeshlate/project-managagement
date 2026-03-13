const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/errors');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
