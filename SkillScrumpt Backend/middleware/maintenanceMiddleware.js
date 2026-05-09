const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const maintenanceMiddleware = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    
    if (settings && settings.maintenanceMode) {
      // Check if it's a login/register request - allow these so admin can log in
      const publicPaths = ['/api/v1/users/login', '/api/v1/users/register'];
      if (publicPaths.includes(req.originalUrl)) {
        return next();
      }

      // Check for admin token
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          const user = await User.findById(decoded.id);
          if (user && user.role === 'admin') {
            return next();
          }
        } catch (err) {
          // Token invalid, continue to block
        }
      }

      return res.status(503).json({
        success: false,
        message: settings.maintenanceMessage || 'Website is under maintenance',
        maintenanceMode: true
      });
    }
    
    next();
  } catch (err) {
    next();
  }
};

module.exports = maintenanceMiddleware;
