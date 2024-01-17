function authorize(role) {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
      }
      next();
    };
  }
  
  module.exports = authorize;
  