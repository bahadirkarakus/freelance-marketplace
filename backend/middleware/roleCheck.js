/**
 * Role-based access control middleware
 * Ensures users can only access endpoints for their role
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by authMiddleware
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({ 
        error: 'Access denied. You do not have permission to perform this action.',
        requiredRole: allowedRoles,
        yourRole: req.user.user_type
      });
    }

    next();
  };
};

module.exports = roleCheck;
